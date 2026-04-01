import { memo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { DebouncedTextareaV2 } from "@/components/admin/shared-v2/DebouncedTextareaV2";
import { ImageUploadV2 } from "@/components/admin/shared-v2/ImageUploadV2";
import { SectionCTAEditorV2 } from "@/components/admin/shared-v2/SectionCTAEditorV2";
import { IconPickerV2 } from "@/components/admin/shared-v2/IconPickerV2";
import type { BenefitsSection } from "@/lib/cms-v2/cms-types";
import type { V2SectionEditorProps } from "./types";

export const BenefitsEditorV2 = memo(({
  draft,
  updateField,
  updateSection,
}: V2SectionEditorProps) => {
  const benefits = draft.benefits;
  const items = benefits?.items || [];

  const addItem = useCallback(() => {
    const newItems = [...items, { title: '', description: '', image: '' }];
    updateSection('benefits', { ...benefits, items: newItems });
  }, [items, benefits, updateSection]);

  const removeItem = useCallback((index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateSection('benefits', { ...benefits, items: newItems });
  }, [items, benefits, updateSection]);

  const updateItem = useCallback((index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSection('benefits', { ...benefits, items: newItems });
  }, [items, benefits, updateSection]);

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header + Enabled Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Benefícios</h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={benefits?.enabled !== false}
            onCheckedChange={(checked) => updateField('benefits', 'enabled', checked)}
          />
          <Label className="text-foreground text-sm font-semibold">Ativar seção</Label>
        </div>
      </div>

      {/* Título da Seção */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Título da Seção</Label>
        <DebouncedInputV2
          value={benefits?.title || ''}
          onDebouncedChange={(v) => updateField('benefits', 'title', v)}
          className="input-admin"
          placeholder="Ex: Por que escolher a LimpMe?"
        />
      </div>

      {/* Lista de Benefícios */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold text-lg">
            Itens de Benefício ({items.length})
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            Nenhum benefício cadastrado. Clique em &quot;Adicionar&quot; para criar.
          </p>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-muted/20 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span>Benefício {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-foreground font-semibold mb-2 block">Título</Label>
                  <DebouncedInputV2
                    value={item.title || ''}
                    onDebouncedChange={(v) => updateItem(index, 'title', v)}
                    className="input-admin"
                    placeholder="Ex: Praticidade"
                  />
                  <div className="flex items-center gap-2">
                    <Label className="text-foreground text-xs">Ícone:</Label>
                    <IconPickerV2
                      value={item.icon}
                      onChange={(icon) => updateItem(index, 'icon', icon)}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <ImageUploadV2
                    label="Imagem"
                    value={item.image}
                    onChange={(url) => updateItem(index, 'image', url)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-foreground font-semibold mb-2 block">Descrição</Label>
                <DebouncedTextareaV2
                  value={item.description || ''}
                  onDebouncedChange={(v) => updateItem(index, 'description', v)}
                  className="input-admin"
                  placeholder="Descrição do benefício..."
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Benefícios"
        ctaData={benefits?.footerCta}
        onUpdate={(updates) => {
          updateSection('benefits', {
            ...benefits,
            footerCta: {
              ...(benefits?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }),
              ...updates,
            },
          });
        }}
      />
    </div>
  );
});

BenefitsEditorV2.displayName = 'BenefitsEditorV2';
