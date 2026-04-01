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
import type { ProcessSection } from "@/lib/cms-v2/cms-types";
import type { V2SectionEditorProps } from "./types";

export const ProcessEditorV2 = memo(({
  draft,
  updateField,
  updateSection,
}: V2SectionEditorProps) => {
  const process = draft.process;
  const steps = process?.steps || [];

  const addStep = useCallback(() => {
    const newSteps = [...steps, { title: '', description: '' }];
    updateSection('process', { ...process, steps: newSteps });
  }, [steps, process, updateSection]);

  const removeStep = useCallback((index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    updateSection('process', { ...process, steps: newSteps });
  }, [steps, process, updateSection]);

  const updateStep = useCallback((index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    updateSection('process', { ...process, steps: newSteps });
  }, [steps, process, updateSection]);

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header + Enabled Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Processo</h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={process?.enabled !== false}
            onCheckedChange={(checked) => updateField('process', 'enabled', checked)}
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
            value={process?.title || ''}
            onDebouncedChange={(v) => updateField('process', 'title', v)}
            className="input-admin"
            placeholder="Ex: Nosso Processo"
          />
        </div>

        <div>
          <Label className="text-foreground font-semibold mb-2 block">Subtítulo</Label>
          <DebouncedInputV2
            value={process?.subtitle || ''}
            onDebouncedChange={(v) => updateField('process', 'subtitle', v)}
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
            value={process?.imageDesktop}
            onChange={(url) => updateField('process', 'imageDesktop', url)}
          />
          <ImageUploadV2
            label="Imagem Mobile"
            recommendedSize="1080 × 1350"
            value={process?.imageMobile}
            onChange={(url) => updateField('process', 'imageMobile', url)}
          />
        </div>
      </div>

      {/* Etapas */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold text-lg">
            Etapas ({steps.length})
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {steps.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            Nenhuma etapa cadastrada. Clique em &quot;Adicionar&quot; para criar.
          </p>
        )}

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-muted/20 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span>Etapa {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <Label className="text-foreground font-semibold mb-2 block">Título</Label>
                <DebouncedInputV2
                  value={step.title || ''}
                  onDebouncedChange={(v) => updateStep(index, 'title', v)}
                  className="input-admin"
                  placeholder="Título da etapa"
                />
                <div className="flex items-center gap-2">
                  <Label className="text-foreground text-xs">Ícone:</Label>
                  <IconPickerV2
                    value={step.icon}
                    onChange={(icon) => updateStep(index, 'icon', icon)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-foreground font-semibold mb-2 block">Descrição</Label>
                <DebouncedTextareaV2
                  value={step.description || ''}
                  onDebouncedChange={(v) => updateStep(index, 'description', v)}
                  className="input-admin"
                  placeholder="Descrição da etapa..."
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Processo"
        ctaData={process?.footerCta}
        onUpdate={(updates) => {
          updateSection('process', {
            ...process,
            footerCta: {
              ...(process?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }),
              ...updates,
            },
          });
        }}
      />
    </div>
  );
});

ProcessEditorV2.displayName = 'ProcessEditorV2';
