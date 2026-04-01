import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { MessageCircle, Smartphone } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { DebouncedTextareaV2 } from "@/components/admin/shared-v2/DebouncedTextareaV2";
import { V2SectionEditorProps } from "./types";

export const FloatingWhatsappEditorV2 = memo(({ draft, updateField, updateSection }: V2SectionEditorProps) => {
  const wpp = draft.floatingWhatsapp;
  const sticky = wpp?.stickyCta || { enabled: false, text: 'Contratar agora', link: '#plans', scrollThreshold: 30 };

  const updateSticky = (field: string, value: unknown) => {
    updateSection('floatingWhatsapp', {
      ...wpp,
      stickyCta: { ...sticky, [field]: value },
    });
  };

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-green-500" />
          CTAs Flutuantes
        </h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={wpp?.enabled !== false}
            onCheckedChange={(checked) => updateField('floatingWhatsapp', 'enabled', checked)}
          />
          <Label className="text-foreground text-sm font-semibold">Ativado</Label>
        </div>
      </div>

      {/* Número e Mensagem */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Configuração</Label>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Número do WhatsApp *</Label>
            <DebouncedInputV2
              value={wpp?.phoneNumber || ''}
              onDebouncedChange={(v) => updateField('floatingWhatsapp', 'phoneNumber', v)}
              placeholder="5548999999999"
              className="input-admin font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Formato: código do país + DDD + número (sem espaços ou caracteres)
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Mensagem Pré-preenchida</Label>
            <DebouncedTextareaV2
              value={wpp?.message || ''}
              onDebouncedChange={(v) => updateField('floatingWhatsapp', 'message', v)}
              placeholder="Olá! Gostaria de saber mais sobre..."
              className="input-admin"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Esta mensagem aparecerá preenchida quando o usuário clicar no botão
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Texto do Botão</Label>
            <DebouncedInputV2
              value={wpp?.label || ''}
              onDebouncedChange={(v) => updateField('floatingWhatsapp', 'label', v)}
              placeholder="Fale Conosco"
              className="input-admin"
            />
          </div>
        </div>
      </div>

      {/* Opções Visuais */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Opções Visuais</Label>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground text-sm">Efeito Pulse (Glow)</Label>
              <p className="text-xs text-muted-foreground">Animação pulsante para chamar atenção</p>
            </div>
            <Switch
              checked={wpp?.pulseEffect !== false}
              onCheckedChange={(checked) => updateField('floatingWhatsapp', 'pulseEffect', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground text-sm">Exibir em Mobile</Label>
              <p className="text-xs text-muted-foreground">Mostrar o botão em dispositivos móveis</p>
            </div>
            <Switch
              checked={wpp?.showOnMobile !== false}
              onCheckedChange={(checked) => updateField('floatingWhatsapp', 'showOnMobile', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground text-sm">Exibir Rótulo em Mobile</Label>
              <p className="text-xs text-muted-foreground">Mostrar texto junto ao ícone em mobile</p>
            </div>
            <Switch
              checked={wpp?.showLabelOnMobile || false}
              onCheckedChange={(checked) => updateField('floatingWhatsapp', 'showLabelOnMobile', checked)}
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      {wpp?.enabled && (
        <div className="bg-muted/20 rounded-2xl p-6 space-y-3">
          <Label className="text-foreground font-semibold text-lg">Prévia</Label>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg">
              <MessageCircle className="h-6 w-6" />
            </div>
            {wpp?.label && (
              <span className="px-4 py-2 bg-background/80 rounded-full shadow text-sm font-medium text-foreground">
                {wpp.label}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Sticky CTA Mobile */}
      {/* ============================================================ */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold text-lg flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            Sticky CTA Mobile
          </Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={sticky.enabled}
              onCheckedChange={(v) => updateSticky('enabled', v)}
            />
            <Label className="text-foreground text-sm font-semibold">
              {sticky.enabled ? 'Ligado' : 'Desligado'}
            </Label>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Barra fixa no rodape do celular que aparece apos o visitante rolar a pagina. Ideal para manter o CTA sempre visivel.
        </p>

        {sticky.enabled && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Texto do Botão</Label>
              <DebouncedInputV2
                value={sticky.text}
                onDebouncedChange={(v) => updateSticky('text', v)}
                placeholder="Contratar agora"
                className="input-admin"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm">Link</Label>
              <DebouncedInputV2
                value={sticky.link}
                onDebouncedChange={(v) => updateSticky('link', v)}
                placeholder="#plans ou /checkout"
                className="input-admin font-mono"
              />
              <p className="text-xs text-muted-foreground">
                O cupom da campanha (se configurado) será adicionado automaticamente
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm">Scroll para aparecer (%)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[sticky.scrollThreshold || 30]}
                  onValueChange={([v]) => updateSticky('scrollThreshold', v)}
                  min={10}
                  max={80}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm text-foreground font-mono w-12 text-right">
                  {sticky.scrollThreshold || 30}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                A barra aparece quando o visitante rolar esta porcentagem da pagina
              </p>
            </div>

            {/* Preview do Sticky */}
            <div className="bg-muted/10 rounded-xl p-4">
              <Label className="text-foreground text-xs font-semibold mb-2 block">Previa (Mobile)</Label>
              <div className="mx-auto w-[200px] h-10 bg-accent rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-sm font-semibold text-accent-foreground">
                  {sticky.text || 'Contratar agora'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

FloatingWhatsappEditorV2.displayName = 'FloatingWhatsappEditorV2';
