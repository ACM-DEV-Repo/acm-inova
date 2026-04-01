import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { SectionCTAEditorV2 } from "@/components/admin/shared-v2/SectionCTAEditorV2";
import { IconPickerV2 } from "@/components/admin/shared-v2/IconPickerV2";
import { V2SectionEditorProps } from "./types";

export const KPIsEditorV2 = memo(({ draft, updateField, updateSection }: V2SectionEditorProps) => {
  const kpis = draft.kpis;
  const items = kpis?.items || [];

  const updateItem = (index: number, field: string, value: unknown) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSection('kpis', { ...kpis, items: newItems });
  };

  const addItem = () => {
    updateSection('kpis', {
      ...kpis,
      items: [...items, { enabled: true, value: '', label: '', description: '' }]
    });
  };

  const removeItem = (index: number) => {
    updateSection('kpis', { ...kpis, items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Números de Impacto</h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={kpis?.enabled !== false}
            onCheckedChange={(checked) => updateField('kpis', 'enabled', checked)}
          />
          <Label className="text-foreground text-sm font-semibold">Ativar seção</Label>
        </div>
      </div>

      {items.map((item, index) => (
        <div key={index} className="bg-muted/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-semibold">KPI {index + 1}</Label>
            <div className="flex items-center gap-3">
              <Switch
                checked={item.enabled !== false}
                onCheckedChange={(checked) => updateItem(index, 'enabled', checked)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                className="text-destructive hover:text-destructive h-8 w-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Valor</Label>
              <DebouncedInputV2
                value={item.value || ''}
                onDebouncedChange={(v) => updateItem(index, 'value', v)}
                placeholder="Ex: +1.800"
                className="input-admin"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Rótulo</Label>
              <DebouncedInputV2
                value={item.label || ''}
                onDebouncedChange={(v) => updateItem(index, 'label', v)}
                placeholder="Ex: Clientes atendidos"
                className="input-admin"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-foreground text-xs">Ícone:</Label>
            <IconPickerV2
              value={item.icon}
              onChange={(icon) => updateItem(index, 'icon', icon)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Descrição (opcional)</Label>
            <DebouncedInputV2
              value={item.description || ''}
              onDebouncedChange={(v) => updateItem(index, 'description', v)}
              placeholder="Ex: em todo o Brasil"
              className="input-admin"
            />
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addItem}
        className="text-foreground border-border hover:bg-accent/10 rounded-full"
      >
        + Adicionar KPI
      </Button>

      <SectionCTAEditorV2
        sectionTitle="KPIs"
        ctaData={kpis?.footerCta}
        onUpdate={(updates) => {
          updateSection('kpis', {
            ...kpis,
            footerCta: { ...(kpis?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }), ...updates }
          });
        }}
      />
    </div>
  );
});

KPIsEditorV2.displayName = 'KPIsEditorV2';
