import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ShieldAlert } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { DebouncedTextareaV2 } from "@/components/admin/shared-v2/DebouncedTextareaV2";
import { ImageUploadV2 } from "@/components/admin/shared-v2/ImageUploadV2";
import type { ConversionSettings } from "@/lib/cms-v2/cms-types";

interface ExitIntentEditorProps {
  exitIntent: ConversionSettings['exitIntent'];
  onUpdate: (field: string, value: unknown) => void;
}

export function ExitIntentEditorV2({ exitIntent, onUpdate }: ExitIntentEditorProps) {
  return (
    <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-foreground font-semibold text-lg flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-red-400" />
          Retencao (Exit Intent)
        </Label>
        <div className="flex items-center gap-2">
          <Switch checked={exitIntent.enabled} onCheckedChange={(v) => onUpdate('enabled', v)} />
          <Label className="text-foreground text-sm font-semibold">
            {exitIntent.enabled ? 'Ligado' : 'Desligado'}
          </Label>
        </div>
      </div>

      {exitIntent.enabled && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-foreground text-sm">Titulo do Popup</Label>
            <DebouncedInputV2 value={exitIntent.title} onDebouncedChange={(v) => onUpdate('title', v)} placeholder="Espera! Antes de ir..." className="input-admin" />
            <p className="text-xs text-muted-foreground">Use **texto** para negrito e {'{{texto}}'} para destaque colorido.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm">Texto</Label>
            <DebouncedTextareaV2 value={exitIntent.text} onDebouncedChange={(v) => onUpdate('text', v)} placeholder="Garanta 15% de desconto" className="input-admin" rows={3} />
            <p className="text-xs text-muted-foreground">Use **texto** para negrito, {'{{texto}}'} para destaque e quebra de linha com Enter.</p>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={exitIntent.titleUppercase !== false} onCheckedChange={(v) => onUpdate('titleUppercase', v)} />
            <Label className="text-foreground text-sm">Titulo em MAIUSCULAS</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Texto do Botao CTA</Label>
              <DebouncedInputV2 value={exitIntent.ctaText} onDebouncedChange={(v) => onUpdate('ctaText', v)} placeholder="Quero meu desconto" className="input-admin" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Link do CTA</Label>
              <DebouncedInputV2 value={exitIntent.ctaLink} onDebouncedChange={(v) => onUpdate('ctaLink', v)} placeholder="/checkout" className="input-admin font-mono" />
              <p className="text-xs text-muted-foreground">O cupom da campanha sera adicionado automaticamente</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm">Texto de dispensa</Label>
            <DebouncedInputV2 value={exitIntent.dismissText || ''} onDebouncedChange={(v) => onUpdate('dismissText', v)} placeholder="Nao, obrigado" className="input-admin" />
          </div>

          <div className="bg-muted/10 rounded-xl p-4 space-y-3">
            <Label className="text-foreground text-sm font-semibold">Imagem do Popup (opcional)</Label>
            <div className="flex flex-wrap gap-6 justify-center">
              <ImageUploadV2 label="Imagem do Popup" recommendedSize="800 x 600" value={exitIntent.imageUrl || ''} onChange={(url) => onUpdate('imageUrl', url)} />
            </div>
            {exitIntent.imageUrl?.trim() && (
              <div className="space-y-2">
                <Label className="text-foreground text-xs">Posicao da Imagem</Label>
                <Select value={exitIntent.imagePosition || 'top'} onValueChange={(v) => onUpdate('imagePosition', v)}>
                  <SelectTrigger className="input-admin"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Topo (acima do texto)</SelectItem>
                    <SelectItem value="left">Lateral esquerda (desktop)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Frequencia</Label>
              <Select value={exitIntent.frequency} onValueChange={(v) => onUpdate('frequency', v)}>
                <SelectTrigger className="input-admin"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="session">1x por sessao</SelectItem>
                  <SelectItem value="day">1x por dia</SelectItem>
                  <SelectItem value="week">1x por semana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Delay minimo (segundos)</Label>
              <div className="flex items-center gap-4">
                <Slider value={[exitIntent.delaySeconds || 5]} onValueChange={([v]) => onUpdate('delaySeconds', v)} min={0} max={30} step={1} className="flex-1" />
                <span className="text-sm text-foreground font-mono w-8 text-right">{exitIntent.delaySeconds || 5}s</span>
              </div>
              <p className="text-xs text-muted-foreground">So mostra se o visitante ficou pelo menos X segundos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
