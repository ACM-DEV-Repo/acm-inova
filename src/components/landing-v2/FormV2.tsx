import { useState } from "react";
import * as Sentry from "@sentry/react";
import { LPContent, FormField } from "@/lib/cms-v2/cms-types";
import { SectionCTAV2 } from "./SectionCTAV2";
import { DynamicFormFieldV2 } from "./form/DynamicFormFieldV2";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CheckCircle, Send } from "lucide-react";

interface FormV2Props {
  data: LPContent['form'];
  lpKey: string;
  couponCode?: string;
}

export const FormV2 = ({ data, lpKey, couponCode }: FormV2Props) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  if (!data || data.enabled === false) return null;

  const fields = data?.fields || [];

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleAddressFound = (address: { logradouro: string; bairro: string; cidade: string; uf: string }) => {
    setFormValues(prev => ({
      ...prev,
      cep_logradouro: address.logradouro,
      cep_bairro: address.bairro,
      cep_cidade: address.cidade,
      cep_uf: address.uf,
    }));

    const addressMappings: Record<string, keyof typeof address> = {
      'logradouro': 'logradouro',
      'rua': 'logradouro',
      'endereco': 'logradouro',
      'bairro': 'bairro',
      'cidade': 'cidade',
      'uf': 'uf',
      'estado': 'uf',
    };

    fields.forEach(field => {
      const fieldIdLower = field.id.toLowerCase();
      const labelLower = field.label.toLowerCase();

      for (const [key, addressKey] of Object.entries(addressMappings)) {
        if (fieldIdLower.includes(key) || labelLower.includes(key)) {
          const value = address[addressKey];
          if (value) {
            setFormValues(prev => ({ ...prev, [field.id]: value }));
          }
          break;
        }
      }
    });
  };

  const handleAddressFieldsChange = (addressFields: { bairro: string; cidade: string; uf: string }) => {
    setFormValues(prev => ({
      ...prev,
      cep_bairro: addressFields.bairro,
      cep_cidade: addressFields.cidade,
      cep_uf: addressFields.uf,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field: FormField) => {
      if (field.type === 'paragraph') return;

      const value = formValues[field.id]?.trim() || '';

      if (field.required && !value) {
        newErrors[field.id] = 'Campo obrigatório';
        return;
      }

      if (!value) return;

      switch (field.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[field.id] = 'E-mail inválido';
          }
          break;
        case 'phone':
        case 'whatsapp':
          if (value.replace(/\D/g, '').length < 10) {
            newErrors[field.id] = 'Telefone inválido';
          }
          break;
        case 'cpf':
          if (value.replace(/\D/g, '').length !== 11) {
            newErrors[field.id] = 'CPF inválido';
          }
          break;
        case 'cep':
          if (value.replace(/\D/g, '').length !== 8) {
            newErrors[field.id] = 'CEP inválido';
          }
          break;
        case 'checkbox': {
          const selectedCount = value.split(',').filter(Boolean).length;
          if (field.required && selectedCount === 0) {
            newErrors[field.id] = 'Selecione pelo menos uma opção';
          } else if (field.minSelect && selectedCount < field.minSelect) {
            newErrors[field.id] = `Selecione pelo menos ${field.minSelect} opção(ões)`;
          } else if (field.maxSelect && selectedCount > field.maxSelect) {
            newErrors[field.id] = `Selecione no máximo ${field.maxSelect} opção(ões)`;
          }
          break;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePostSubmit = () => {
    const action = data?.successAction;

    switch (action?.type) {
      case 'redirect':
        if (action.redirectUrl) {
          try {
            const url = new URL(action.redirectUrl, window.location.origin);
            if (url.protocol === 'https:' || url.protocol === 'http:') {
              window.location.href = action.redirectUrl;
            }
          } catch {
            // Relative path (starts with / but not // to prevent protocol-relative redirect)
            if (action.redirectUrl.startsWith('/') && !action.redirectUrl.startsWith('//')) {
              window.location.href = action.redirectUrl;
            }
          }
        }
        break;
      case 'success-card':
        setShowSuccessCard(true);
        break;
      case 'toast':
      default:
        toast.success(action?.successTitle || "Enviado com sucesso!", {
          description: action?.successMessage || "Entraremos em contato em breve.",
        });
        setFormValues({});
        setErrors({});
    }
  };

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const deviceType = isMobile ? 'mobile' : 'desktop';

    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return { deviceType, os };
  };

  /**
   * Dispara webhook (non-blocking) — se falhar, não afeta o submit principal
   */
  const fireWebhook = async (submittedData: Record<string, string>) => {
    if (!data?.webhookUrl) return;

    try {
      const utmParams: Record<string, string> = {};
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.forEach((value, key) => {
        if (key.startsWith('utm_')) {
          utmParams[key] = value;
        }
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      await fetch(data.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          lp_key: lpKey,
          campos: submittedData,
          utm_params: utmParams,
          timestamp: new Date().toISOString(),
          origin_url: window.location.href,
        }),
      });
      clearTimeout(timeout);
    } catch (err) {
      Sentry.captureException(err, { extra: { context: 'FormV2.fireWebhook', lpKey } });
      console.warn('[FormV2] Webhook failed (non-blocking):', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Formulário incompleto", {
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSubmit: Record<string, string> = {};
      fields.forEach(field => {
        if (field.type !== 'paragraph' && formValues[field.id]) {
          dataToSubmit[field.id] = formValues[field.id];
        }
      });

      // Hidden CEP address fields
      if (formValues.cep_logradouro) dataToSubmit.cep_logradouro = formValues.cep_logradouro;
      if (formValues.cep_bairro) dataToSubmit.cep_bairro = formValues.cep_bairro;
      if (formValues.cep_cidade) dataToSubmit.cep_cidade = formValues.cep_cidade;
      if (formValues.cep_uf) dataToSubmit.cep_uf = formValues.cep_uf;

      const { deviceType, os } = getDeviceInfo();
      const metadata = {
        device_type: deviceType,
        device_os: os,
        submitted_at_local: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      };

      const { error } = await supabase.functions.invoke('submit-lp-form', {
        body: {
          lp_id: lpKey,
          data: dataToSubmit,
          metadata,
          origin_url: window.location.href,
        },
      });
      if (error) throw error;

      // Fire webhook (non-blocking)
      fireWebhook(dataToSubmit);

      handlePostSubmit();
    } catch (error) {
      Sentry.captureException(error, { extra: { context: 'FormV2.handleSubmit', lpKey } });
      console.error('[FormV2] Submit error:', error);
      toast.error("Erro ao enviar", {
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Card View
  if (showSuccessCard) {
    return (
      <section className="w-full py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-10 md:p-16 text-center">
            {data?.successAction?.successImage ? (
              <img loading="lazy"
                src={data.successAction.successImage}
                alt="Sucesso"
                className="w-32 h-32 object-contain mx-auto mb-6"
              />
            ) : (
              <CheckCircle className="w-20 h-20 text-[hsl(var(--ds-color-accent))] mx-auto mb-6" />
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {data?.successAction?.successTitle || 'Obrigado!'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {data?.successAction?.successMessage || 'Entraremos em contato em breve.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 md:mb-8 text-[hsl(var(--ds-color-title))] leading-tight">
          {data?.title || 'Assine agora'}
        </h2>

        <p className="text-base md:text-lg lg:text-xl text-muted-foreground text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          {data?.subtitle || 'Preencha o formulário e comece hoje'}
        </p>

        <form onSubmit={handleSubmit} className="glass-strong p-6 md:p-10 lg:p-12">
          {fields.length > 0 ? (
            <div className="flex flex-wrap gap-4 mb-6">
              {fields.map((field: FormField) => (
                <DynamicFormFieldV2
                  key={field.id}
                  field={field}
                  value={formValues[field.id] || ''}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  onAddressFound={handleAddressFound}
                  onAddressFieldsChange={handleAddressFieldsChange}
                  error={errors[field.id]}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center mb-6">
              Configure os campos do formulário no painel administrativo.
            </p>
          )}

          <div className="text-center mt-2">
            <button
              type="submit"
              disabled={isSubmitting || fields.length === 0}
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-10 md:px-14 py-4 md:py-5 rounded-full font-bold text-base md:text-lg bg-[hsl(var(--ds-color-btn))] text-[hsl(var(--ds-color-btn-text))] hover:scale-105 hover:shadow-[0_16px_32px_hsl(var(--ds-color-accent)/0.4)] shadow-[0_8px_16px_hsl(var(--ds-color-accent)/0.2)] transition-transform duration-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {data?.ctaButton || 'Contratar'}
                </>
              )}
            </button>
          </div>
        </form>

        <SectionCTAV2 data={data?.footerCta} lpKey={lpKey} couponCode={couponCode} />
      </div>
    </section>
  );
};
