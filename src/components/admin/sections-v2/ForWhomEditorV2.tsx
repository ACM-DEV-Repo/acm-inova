import { memo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { ImageUploadV2 } from "@/components/admin/shared-v2/ImageUploadV2";
import { SectionCTAEditorV2 } from "@/components/admin/shared-v2/SectionCTAEditorV2";
import type { ForWhomSection } from "@/lib/cms-v2/cms-types";
import type { V2SectionEditorProps } from "./types";

export const ForWhomEditorV2 = memo(({
  draft,
  updateField,
  updateSection,
}: V2SectionEditorProps) => {
  const forWhom = draft.forWhom;
  const items = forWhom?.items || [];

  const addItem = useCallback(() => {
    const newItems = [...items, ''];
    updateSection('forWhom', { ...forWhom, items: newItems });
  }, [items, forWhom, updateSection]);

  const removeItem = useCallback((index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateSection('forWhom', { ...forWhom, items: newItems });
  }, [items, forWhom, updateSection]);

  const updateItem = useCallback((index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    updateSection('forWhom', { ...forWhom, items: newItems });
  }, [items, forWhom, updateSection]);

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header + Enabled Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Para Quem</h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={forWhom?.enabled !== false}
            onCheckedChange={(checked) => updateField('forWhom', 'enabled', checked)}
          />
          <Label className="text-foreground text-sm font-semibold">Ativar seção</Label>
        </div>
      </div>

      {/* Textos */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Textos</Label>

        <div>
          <Label className="text-foreground font-semibold mb-2 block">Título</Label>
          <DebouncedInputV2
            value={forWhom?.title || ''}
            onDebouncedChange={(v) => updateField('forWhom', 'title', v)}
            className="input-admin"
            placeholder="Ex: Para quem é a LimpMe?"
          />
        </div>

        <div>
          <Label className="text-foreground font-semibold mb-2 block">Subtítulo</Label>
          <DebouncedInputV2
            value={forWhom?.subtitle || ''}
            onDebouncedChange={(v) => updateField('forWhom', 'subtitle', v)}
            className="input-admin"
            placeholder="Subtítulo da seção"
          />
        </div>
      </div>

      {/* Imagens */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Imagens</Label>
        <div className="flex flex-wrap gap-6 justify-center">
          <ImageUploadV2
            label="Imagem Desktop"
            recommendedSize="1920 × 1080"
            value={forWhom?.imageDesktop}
            onChange={(url) => updateField('forWhom', 'imageDesktop', url)}
          />
          <ImageUploadV2
            label="Imagem Mobile"
            recommendedSize="1080 × 1350"
            value={forWhom?.imageMobile}
            onChange={(url) => updateField('forWhom', 'imageMobile', url)}
          />
        </div>
      </div>

      {/* Itens */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold text-lg">
            Itens ({items.length})
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            Nenhum item cadastrado. Clique em &quot;Adicionar&quot; para criar.
          </p>
        )}

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
                <GripVertical className="h-4 w-4" />
                <span className="w-6 text-center">{index + 1}.</span>
              </div>
              <DebouncedInputV2
                value={item || ''}
                onDebouncedChange={(v) => updateItem(index, v)}
                className="input-admin flex-1"
                placeholder={`Item ${index + 1}`}
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
        sectionTitle="Para Quem"
        ctaData={forWhom?.footerCta}
        onUpdate={(updates) => {
          updateSection('forWhom', {
            ...forWhom,
            footerCta: {
              ...(forWhom?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }),
              ...updates,
            },
          });
        }}
      />
    </div>
  );
});

ForWhomEditorV2.displayName = 'ForWhomEditorV2';
