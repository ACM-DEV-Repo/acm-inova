import { memo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { ImageUploadV2 } from "@/components/admin/shared-v2/ImageUploadV2";
import { SectionCTAEditorV2 } from "@/components/admin/shared-v2/SectionCTAEditorV2";
import { IconPickerV2 } from "@/components/admin/shared-v2/IconPickerV2";
import type { HowItWorksSection } from "@/lib/cms-v2/cms-types";
import type { V2SectionEditorProps } from "./types";

/** Helper: extrai texto do step (string legado ou objeto novo) */
const getStepText = (step: string | { text: string; icon?: string }): string =>
  typeof step === 'string' ? step : step.text;
const getStepIcon = (step: string | { text: string; icon?: string }): string | undefined =>
  typeof step === 'string' ? undefined : step.icon;

export const HowItWorksEditorV2 = memo(({
  draft,
  updateField,
  updateSection,
}: V2SectionEditorProps) => {
  const howItWorks = draft.howItWorks;
  const steps = howItWorks?.steps || [];

  const addStep = useCallback(() => {
    const newSteps = [...steps, { text: '', icon: undefined }];
    updateSection('howItWorks', { ...howItWorks, steps: newSteps as HowItWorksSection['steps'] });
  }, [steps, howItWorks, updateSection]);

  const removeStep = useCallback((index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    updateSection('howItWorks', { ...howItWorks, steps: newSteps });
  }, [steps, howItWorks, updateSection]);

  const updateStep = useCallback((index: number, field: 'text' | 'icon', value: string) => {
    const newSteps = [...steps];
    const current = newSteps[index];
    // Converter string legado pra objeto
    const obj = typeof current === 'string'
      ? { text: current, icon: undefined }
      : { ...current };
    (obj as Record<string, unknown>)[field] = value;
    newSteps[index] = obj as { text: string; icon?: string };
    updateSection('howItWorks', { ...howItWorks, steps: newSteps as HowItWorksSection['steps'] });
  }, [steps, howItWorks, updateSection]);

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header + Enabled Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Como Funciona</h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={howItWorks?.enabled !== false}
            onCheckedChange={(checked) => updateField('howItWorks', 'enabled', checked)}
          />
          <Label className="text-foreground text-sm font-semibold">Ativar seção</Label>
        </div>
      </div>

      {/* Título da Seção */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Título da Seção</Label>
        <DebouncedInputV2
          value={howItWorks?.title || ''}
          onDebouncedChange={(v) => updateField('howItWorks', 'title', v)}
          className="input-admin"
          placeholder="Ex: Como funciona?"
        />
      </div>

      {/* Imagens */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Imagens</Label>
        <div className="flex flex-wrap gap-6 justify-center">
          <ImageUploadV2
            label="Imagem Desktop"
            recommendedSize="1920 × 1080"
            value={howItWorks?.imageDesktop}
            onChange={(url) => updateField('howItWorks', 'imageDesktop', url)}
          />
          <ImageUploadV2
            label="Imagem Mobile"
            recommendedSize="1080 × 1350"
            value={howItWorks?.imageMobile}
            onChange={(url) => updateField('howItWorks', 'imageMobile', url)}
          />
        </div>
      </div>

      {/* Passos */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold text-lg">
            Passos ({steps.length})
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {steps.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            Nenhum passo cadastrado. Clique em &quot;Adicionar&quot; para criar.
          </p>
        )}

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
                <GripVertical className="h-4 w-4" />
                <span className="w-6 text-center">{index + 1}.</span>
              </div>
              <IconPickerV2
                value={getStepIcon(step)}
                onChange={(icon) => updateStep(index, 'icon', icon)}
              />
              <DebouncedInputV2
                value={getStepText(step) || ''}
                onDebouncedChange={(v) => updateStep(index, 'text', v)}
                className="input-admin flex-1"
                placeholder={`Passo ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeStep(index)}
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
        sectionTitle="Como Funciona"
        ctaData={howItWorks?.footerCta}
        onUpdate={(updates) => {
          updateSection('howItWorks', {
            ...howItWorks,
            footerCta: {
              ...(howItWorks?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }),
              ...updates,
            },
          });
        }}
      />
    </div>
  );
});

HowItWorksEditorV2.displayName = 'HowItWorksEditorV2';
