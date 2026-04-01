import { memo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { SectionCTAEditorV2 } from "@/components/admin/shared-v2/SectionCTAEditorV2";
import type { ServicesSection } from "@/lib/cms-v2/cms-types";
import type { V2SectionEditorProps } from "./types";

export const ServicesEditorV2 = memo(({
  draft,
  updateField,
  updateSection,
}: V2SectionEditorProps) => {
  const services = draft.services;
  const items = services?.items || [];

  const addItem = useCallback(() => {
    const newItems = [...items, { text: '', enabled: true }];
    updateSection('services', { ...services, items: newItems });
  }, [items, services, updateSection]);

  const removeItem = useCallback((index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateSection('services', { ...services, items: newItems });
  }, [items, services, updateSection]);

  const updateItemText = useCallback((index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], text: value };
    updateSection('services', { ...services, items: newItems });
  }, [items, services, updateSection]);

  const toggleItemEnabled = useCallback((index: number, checked: boolean) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], enabled: checked };
    updateSection('services', { ...services, items: newItems });
  }, [items, services, updateSection]);

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header + Enabled Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Serviços</h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={services?.enabled !== false}
            onCheckedChange={(checked) => updateField('services', 'enabled', checked)}
          />
          <Label className="text-foreground text-sm font-semibold">Ativar seção</Label>
        </div>
      </div>

      {/* Título da Seção */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Título da Seção</Label>
        <DebouncedInputV2
          value={services?.title || ''}
          onDebouncedChange={(v) => updateField('services', 'title', v)}
          className="input-admin"
          placeholder="Ex: Nossos Serviços"
        />
      </div>

      {/* Lista de Serviços */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold text-lg">
            Serviços ({items.length})
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            Nenhum serviço cadastrado. Clique em &quot;Adicionar&quot; para criar.
          </p>
        )}

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
                <GripVertical className="h-4 w-4" />
              </div>
              <Switch
                checked={item.enabled !== false}
                onCheckedChange={(checked) => toggleItemEnabled(index, checked)}
              />
              <DebouncedInputV2
                value={item.text || ''}
                onDebouncedChange={(v) => updateItemText(index, v)}
                className="input-admin flex-1"
                placeholder={`Serviço ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-destructive hover:text-destructive shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Serviços"
        ctaData={services?.footerCta}
        onUpdate={(updates) => {
          updateSection('services', {
            ...services,
            footerCta: {
              ...(services?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }),
              ...updates,
            },
          });
        }}
      />
    </div>
  );
});

ServicesEditorV2.displayName = 'ServicesEditorV2';
