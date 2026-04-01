import { memo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { ImageUploadV2 } from "@/components/admin/shared-v2/ImageUploadV2";
import { SectionCTAEditorV2 } from "@/components/admin/shared-v2/SectionCTAEditorV2";
import type { BeforeAfterSection } from "@/lib/cms-v2/cms-types";
import type { V2SectionEditorProps } from "./types";

export const BeforeAfterEditorV2 = memo(({
  draft,
  updateField,
  updateSection,
}: V2SectionEditorProps) => {
  const beforeAfter = draft.beforeAfter;
  const images = beforeAfter?.images || [];

  const addImage = useCallback(() => {
    const newImages = [...images, { before: '', after: '', caption: '' }];
    updateSection('beforeAfter', { ...beforeAfter, images: newImages });
  }, [images, beforeAfter, updateSection]);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    updateSection('beforeAfter', { ...beforeAfter, images: newImages });
  }, [images, beforeAfter, updateSection]);

  const updateImage = useCallback((index: number, field: string, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    updateSection('beforeAfter', { ...beforeAfter, images: newImages });
  }, [images, beforeAfter, updateSection]);

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header + Enabled Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Antes e Depois</h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={beforeAfter?.enabled !== false}
            onCheckedChange={(checked) => updateField('beforeAfter', 'enabled', checked)}
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
            value={beforeAfter?.title || ''}
            onDebouncedChange={(v) => updateField('beforeAfter', 'title', v)}
            className="input-admin"
            placeholder="Ex: Veja a diferença"
          />
        </div>

        <div>
          <Label className="text-foreground font-semibold mb-2 block">Subtítulo</Label>
          <DebouncedInputV2
            value={beforeAfter?.subtitle || ''}
            onDebouncedChange={(v) => updateField('beforeAfter', 'subtitle', v)}
            className="input-admin"
            placeholder="Subtítulo da seção"
          />
        </div>
      </div>

      {/* Imagens de Background */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Imagens de Background</Label>
        <div className="flex flex-wrap gap-6 justify-center">
          <ImageUploadV2
            label="Imagem Desktop"
            recommendedSize="1920 × 1080"
            value={beforeAfter?.imageDesktop}
            onChange={(url) => updateField('beforeAfter', 'imageDesktop', url)}
          />
          <ImageUploadV2
            label="Imagem Mobile"
            recommendedSize="1080 × 1350"
            value={beforeAfter?.imageMobile}
            onChange={(url) => updateField('beforeAfter', 'imageMobile', url)}
          />
        </div>
      </div>

      {/* Comparações */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold text-lg">
            Comparações ({images.length})
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addImage}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {images.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            Nenhuma comparação cadastrada. Clique em &quot;Adicionar&quot; para criar.
          </p>
        )}

        <div className="space-y-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="bg-muted/20 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span>Comparação {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 justify-center">
                <ImageUploadV2
                  label="Imagem Antes"
                  recommendedSize="800 × 600"
                  value={img.before || ''}
                  onChange={(url) => updateImage(index, 'before', url)}
                />
                <ImageUploadV2
                  label="Imagem Depois"
                  recommendedSize="800 × 600"
                  value={img.after || ''}
                  onChange={(url) => updateImage(index, 'after', url)}
                />
              </div>

              <div>
                <Label className="text-foreground font-semibold mb-2 block">Legenda</Label>
                <DebouncedInputV2
                  value={img.caption || ''}
                  onDebouncedChange={(v) => updateImage(index, 'caption', v)}
                  className="input-admin"
                  placeholder="Legenda da comparação"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Antes e Depois"
        ctaData={beforeAfter?.footerCta}
        onUpdate={(updates) => {
          updateSection('beforeAfter', {
            ...beforeAfter,
            footerCta: {
              ...(beforeAfter?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }),
              ...updates,
            },
          });
        }}
      />
    </div>
  );
});

BeforeAfterEditorV2.displayName = 'BeforeAfterEditorV2';
