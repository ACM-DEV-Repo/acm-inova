import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Trophy, Plus, Trash2 } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import type { ConversionSettings } from "@/lib/cms-v2/cms-types";

interface SocialProofEditorProps {
  socialProof: ConversionSettings['socialProof'];
  onUpdate: (field: string, value: unknown) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: string, value: string) => void;
}

export function SocialProofEditorV2({ socialProof, onUpdate, onAddItem, onRemoveItem, onUpdateItem }: SocialProofEditorProps) {
  return (
    <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-foreground font-semibold text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Prova Social (Toasts)
        </Label>
        <div className="flex items-center gap-2">
          <Switch checked={socialProof.enabled} onCheckedChange={(v) => onUpdate('enabled', v)} />
          <Label className="text-foreground text-sm font-semibold">
            {socialProof.enabled ? 'Ligado' : 'Desligado'}
          </Label>
        </div>
      </div>

      {socialProof.enabled && (
        <div className="space-y-4 pt-2">
          <div className="space-y-3">
            <Label className="text-foreground text-sm font-semibold">Mensagens ({socialProof.items.length})</Label>

            {socialProof.items.map((item, index) => (
              <div key={index} className="space-y-2 bg-muted/10 rounded-lg p-3">
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end">
                  <div className="space-y-1">
                    {index === 0 && <Label className="text-foreground text-xs">Nome</Label>}
                    <DebouncedInputV2 value={item.name} onDebouncedChange={(v) => onUpdateItem(index, 'name', v)} placeholder="Maria" className="input-admin text-sm" />
                  </div>
                  <div className="space-y-1">
                    {index === 0 && <Label className="text-foreground text-xs">Cidade</Label>}
                    <DebouncedInputV2 value={item.city} onDebouncedChange={(v) => onUpdateItem(index, 'city', v)} placeholder="Sao Paulo" className="input-admin text-sm" />
                  </div>
                  <div className="space-y-1">
                    {index === 0 && <Label className="text-foreground text-xs">Produto</Label>}
                    <DebouncedInputV2 value={item.plan} onDebouncedChange={(v) => onUpdateItem(index, 'plan', v)} placeholder="Ouro" className="input-admin text-sm" />
                  </div>
                  <div className="space-y-1">
                    {index === 0 && <Label className="text-foreground text-xs">Tempo</Label>}
                    <DebouncedInputV2 value={item.timeAgo} onDebouncedChange={(v) => onUpdateItem(index, 'timeAgo', v)} placeholder="3 min" className="input-admin text-sm" />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveItem(index)} className="h-9 w-9 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <Label className="text-foreground text-xs">Mensagem customizada (opcional)</Label>
                  <DebouncedInputV2 value={item.message || ''} onDebouncedChange={(v) => onUpdateItem(index, 'message', v)} placeholder="Substitui o template padrão" className="input-admin text-sm" />
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" size="sm" onClick={onAddItem} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Adicionar mensagem
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Intervalo (segundos)</Label>
              <div className="flex items-center gap-4">
                <Slider value={[socialProof.intervalSeconds || 20]} onValueChange={([v]) => onUpdate('intervalSeconds', v)} min={10} max={60} step={5} className="flex-1" />
                <span className="text-sm text-foreground font-mono w-8 text-right">{socialProof.intervalSeconds || 20}s</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Duração do toast (segundos)</Label>
              <div className="flex items-center gap-4">
                <Slider value={[socialProof.toastDuration || 4]} onValueChange={([v]) => onUpdate('toastDuration', v)} min={2} max={10} step={1} className="flex-1" />
                <span className="text-sm text-foreground font-mono w-8 text-right">{socialProof.toastDuration || 4}s</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Max por visita</Label>
              <div className="flex items-center gap-4">
                <Slider value={[socialProof.maxPerVisit || 5]} onValueChange={([v]) => onUpdate('maxPerVisit', v)} min={1} max={15} step={1} className="flex-1" />
                <span className="text-sm text-foreground font-mono w-8 text-right">{socialProof.maxPerVisit || 5}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Posição</Label>
              <Select value={socialProof.position || 'bottom-left'} onValueChange={(v) => onUpdate('position', v)}>
                <SelectTrigger className="input-admin"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom-left">Inferior Esquerdo</SelectItem>
                  <SelectItem value="bottom-right">Inferior Direito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
