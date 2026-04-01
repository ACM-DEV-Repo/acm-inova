import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Timer, Palette } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import type { ConversionSettings } from "@/lib/cms-v2/cms-types";

interface CountdownEditorProps {
  countdown: ConversionSettings['countdown'];
  onUpdate: (field: string, value: unknown) => void;
}

export function CountdownEditorV2({ countdown, onUpdate }: CountdownEditorProps) {
  return (
    <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-foreground font-semibold text-lg flex items-center gap-2">
          <Timer className="h-5 w-5 text-orange-400" />
          Urgencia (Countdown)
        </Label>
        <div className="flex items-center gap-2">
          <Switch checked={countdown.enabled} onCheckedChange={(v) => onUpdate('enabled', v)} />
          <Label className="text-foreground text-sm font-semibold">
            {countdown.enabled ? 'Ligado' : 'Desligado'}
          </Label>
        </div>
      </div>

      {countdown.enabled && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-foreground text-sm">Modo</Label>
            <Select value={countdown.mode} onValueChange={(v) => onUpdate('mode', v)}>
              <SelectTrigger className="input-admin"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">Deadline fixa (data/hora)</SelectItem>
                <SelectItem value="evergreen">Evergreen (por visitante)</SelectItem>
                <SelectItem value="roundHour">Proxima hora cheia (trafego pago)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {countdown.mode === 'deadline' && (
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Data/Hora Limite</Label>
              <input
                type="datetime-local"
                value={countdown.deadline || ''}
                onChange={(e) => onUpdate('deadline', e.target.value)}
                className="input-admin font-mono w-full px-4 py-2 rounded-lg bg-muted/20 text-foreground"
              />
              <p className="text-xs text-muted-foreground">Selecione a data e hora limite da oferta</p>
            </div>
          )}

          {countdown.mode === 'evergreen' && (
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Duração (horas)</Label>
              <div className="flex items-center gap-4">
                <Slider value={[countdown.evergreenHours || 24]} onValueChange={([v]) => onUpdate('evergreenHours', v)} min={1} max={72} step={1} className="flex-1" />
                <span className="text-sm text-foreground font-mono w-12 text-right">{countdown.evergreenHours || 24}h</span>
              </div>
              <p className="text-xs text-muted-foreground">Cada visitante ve o timer a partir da primeira visita</p>
            </div>
          )}

          {countdown.mode === 'roundHour' && (
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Horas a frente</Label>
              <div className="flex items-center gap-4">
                <Slider value={[countdown.roundHourAhead || 2]} onValueChange={([v]) => onUpdate('roundHourAhead', v)} min={1} max={6} step={1} className="flex-1" />
                <span className="text-sm text-foreground font-mono w-12 text-right">{countdown.roundHourAhead || 2}h</span>
              </div>
              <p className="text-xs text-muted-foreground">Timer conta ate a proxima hora cheia. Ex: visitante entra 15:37 com 2h → expira as 17:00.</p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-foreground text-sm">Texto antes do timer</Label>
            <DebouncedInputV2 value={countdown.label || ''} onDebouncedChange={(v) => onUpdate('label', v)} placeholder="Oferta termina em:" className="input-admin" />
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={countdown.showInPlans} onCheckedChange={(v) => onUpdate('showInPlans', v)} />
              <Label className="text-foreground text-sm">Mostrar nos Produtos</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={countdown.showInCtaFinal} onCheckedChange={(v) => onUpdate('showInCtaFinal', v)} />
              <Label className="text-foreground text-sm">Mostrar no CTA Final</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm">Texto quando expirar (opcional)</Label>
            <DebouncedInputV2 value={countdown.expiredText || ''} onDebouncedChange={(v) => onUpdate('expiredText', v)} placeholder="Oferta encerrada" className="input-admin" />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm flex items-center gap-2">
              <Palette className="h-3.5 w-3.5" />
              Cor de urgencia (opcional)
            </Label>
            <div className="flex items-center gap-3">
              <input type="color" value={countdown.urgencyColor || '#DC2626'} onChange={(e) => onUpdate('urgencyColor', e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
              <DebouncedInputV2 value={countdown.urgencyColor || ''} onDebouncedChange={(v) => onUpdate('urgencyColor', v)} placeholder="Vazio = cor accent do tema" className="input-admin font-mono flex-1" />
              {countdown.urgencyColor && (
                <Button type="button" variant="ghost" size="sm" onClick={() => onUpdate('urgencyColor', '')} className="text-xs">Limpar</Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Deixe vazio para usar a cor accent do tema.</p>
          </div>
        </div>
      )}
    </div>
  );
}
