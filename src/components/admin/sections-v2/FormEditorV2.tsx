import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, GripVertical } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { DebouncedTextareaV2 } from "@/components/admin/shared-v2/DebouncedTextareaV2";
import { SectionCTAEditorV2 } from "@/components/admin/shared-v2/SectionCTAEditorV2";
import { V2SectionEditorProps } from "./types";
import { FormFieldType, FormField } from "@/lib/cms-v2/cms-types";

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefone' },
  { value: 'cpf', label: 'CPF' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'cep', label: 'CEP' },
  { value: 'select', label: 'Seleção' },
  { value: 'date', label: 'Data' },
  { value: 'textarea', label: 'Texto Longo' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'paragraph', label: 'Parágrafo (info)' },
];

export const FormEditorV2 = memo(({ draft, updateField, updateSection }: V2SectionEditorProps) => {
  const form = draft.form;
  const fields = form?.fields || [];

  const updateFormField = (index: number, field: string, value: unknown) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [field]: value };
    updateSection('form', { ...form, fields: newFields });
  };

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      width: '100%',
    };
    updateSection('form', { ...form, fields: [...fields, newField] });
  };

  const removeField = (index: number) => {
    updateSection('form', { ...form, fields: fields.filter((_, i) => i !== index) });
  };

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Formulário</h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={form?.enabled !== false}
            onCheckedChange={(checked) => updateField('form', 'enabled', checked)}
          />
          <Label className="text-foreground text-sm font-semibold">Ativar seção</Label>
        </div>
      </div>

      {/* Configurações Gerais */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Configuração Geral</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground">Título</Label>
            <DebouncedInputV2
              value={form?.title || ''}
              onDebouncedChange={(v) => updateField('form', 'title', v)}
              placeholder="Ex: Agende sua limpeza"
              className="input-admin"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Subtítulo</Label>
            <DebouncedInputV2
              value={form?.subtitle || ''}
              onDebouncedChange={(v) => updateField('form', 'subtitle', v)}
              placeholder="Ex: Preencha os dados abaixo"
              className="input-admin"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Texto do Botão de Envio</Label>
          <DebouncedInputV2
            value={form?.ctaButton || ''}
            onDebouncedChange={(v) => updateField('form', 'ctaButton', v)}
            placeholder="Ex: Enviar"
            className="input-admin"
          />
        </div>
      </div>

      {/* Webhook URL */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Webhook (n8n / Integração)</Label>
        <p className="text-sm text-muted-foreground">
          URL para onde os dados do formulário serão enviados automaticamente após o submit.
          O envio é não-bloqueante: se falhar, o submit principal continua funcionando.
        </p>
        <DebouncedInputV2
          value={form?.webhookUrl || ''}
          onDebouncedChange={(v) => updateField('form', 'webhookUrl', v)}
          placeholder="Ex: https://n8n.seudominio.com/webhook/abc123"
          className="input-admin"
        />
      </div>

      {/* Ação de Sucesso */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Ação Após Envio</Label>
        <Select
          value={form?.successAction?.type || 'toast'}
          onValueChange={(v) => {
            updateSection('form', {
              ...form,
              successAction: { ...(form?.successAction || {}), type: v as 'toast' | 'redirect' | 'success-card' }
            });
          }}
        >
          <SelectTrigger className="input-admin">
            <SelectValue placeholder="Tipo de ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toast">Toast (notificação)</SelectItem>
            <SelectItem value="redirect">Redirecionar</SelectItem>
            <SelectItem value="success-card">Card de Sucesso</SelectItem>
          </SelectContent>
        </Select>

        {form?.successAction?.type === 'redirect' && (
          <DebouncedInputV2
            value={form.successAction.redirectUrl || ''}
            onDebouncedChange={(v) => {
              updateSection('form', {
                ...form,
                successAction: { ...form.successAction!, redirectUrl: v }
              });
            }}
            placeholder="URL de redirecionamento"
            className="input-admin"
          />
        )}

        {form?.successAction?.type === 'success-card' && (
          <div className="space-y-3">
            <DebouncedInputV2
              value={form.successAction.successTitle || ''}
              onDebouncedChange={(v) => {
                updateSection('form', {
                  ...form,
                  successAction: { ...form.successAction!, successTitle: v }
                });
              }}
              placeholder="Título de sucesso"
              className="input-admin"
            />
            <DebouncedTextareaV2
              value={form.successAction.successMessage || ''}
              onDebouncedChange={(v) => {
                updateSection('form', {
                  ...form,
                  successAction: { ...form.successAction!, successMessage: v }
                });
              }}
              placeholder="Mensagem de sucesso"
              className="input-admin"
            />
          </div>
        )}
      </div>

      {/* Campos do Formulário */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Campos ({fields.length})</Label>

        {fields.map((field, index) => (
          <div key={field.id || index} className="bg-background/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <Label className="text-foreground font-semibold">Campo {index + 1}</Label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeField(index)}
                className="text-destructive hover:text-destructive h-8 w-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-foreground text-xs">Tipo</Label>
                <Select
                  value={field.type}
                  onValueChange={(v) => updateFormField(index, 'type', v)}
                >
                  <SelectTrigger className="input-admin">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((ft) => (
                      <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-foreground text-xs">Label</Label>
                <DebouncedInputV2
                  value={field.label || ''}
                  onDebouncedChange={(v) => updateFormField(index, 'label', v)}
                  placeholder="Ex: Nome completo"
                  className="input-admin"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground text-xs">Placeholder</Label>
                <DebouncedInputV2
                  value={field.placeholder || ''}
                  onDebouncedChange={(v) => updateFormField(index, 'placeholder', v)}
                  placeholder="Ex: Digite seu nome"
                  className="input-admin"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={field.required}
                  onCheckedChange={(checked) => updateFormField(index, 'required', checked)}
                />
                <Label className="text-foreground text-sm">Obrigatório</Label>
              </div>
              <Select
                value={field.width || '100%'}
                onValueChange={(v) => updateFormField(index, 'width', v)}
              >
                <SelectTrigger className="input-admin w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100%">Largura total</SelectItem>
                  <SelectItem value="50%">Meia largura</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {field.type === 'select' && (
              <div className="space-y-2">
                <Label className="text-foreground text-xs">Opções (uma por linha)</Label>
                <DebouncedTextareaV2
                  value={(field.options || []).join('\n')}
                  onDebouncedChange={(v) => updateFormField(index, 'options', v.split('\n').filter(Boolean))}
                  placeholder="Opção 1\nOpção 2\nOpção 3"
                  className="input-admin"
                  rows={3}
                />
              </div>
            )}

            {field.type === 'paragraph' && (
              <div className="space-y-2">
                <Label className="text-foreground text-xs">Conteúdo do Parágrafo</Label>
                <DebouncedTextareaV2
                  value={field.content || ''}
                  onDebouncedChange={(v) => updateFormField(index, 'content', v)}
                  placeholder="Texto informativo exibido no formulário"
                  className="input-admin"
                  rows={3}
                />
              </div>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addField}
          className="text-foreground border-border hover:bg-accent/10 rounded-full"
        >
          + Adicionar Campo
        </Button>
      </div>

      <SectionCTAEditorV2
        sectionTitle="Formulário"
        ctaData={form?.footerCta}
        onUpdate={(updates) => {
          updateSection('form', {
            ...form,
            footerCta: { ...(form?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }), ...updates }
          });
        }}
      />
    </div>
  );
});

FormEditorV2.displayName = 'FormEditorV2';
