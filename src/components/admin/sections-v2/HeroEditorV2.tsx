import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { DebouncedTextareaV2 } from "@/components/admin/shared-v2/DebouncedTextareaV2";
import { ImageUploadV2 } from "@/components/admin/shared-v2/ImageUploadV2";
import { SectionCTAEditorV2 } from "@/components/admin/shared-v2/SectionCTAEditorV2";
import type { HeroSection } from "@/lib/cms-v2/cms-types";
import type { V2SectionEditorProps } from "./types";

export const HeroEditorV2 = memo(({
  draft,
  updateField,
  updateNestedField,
  updateSection,
}: V2SectionEditorProps) => {
  const hero = draft.hero;

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header + Enabled Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Destaque</h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={hero?.enabled !== false}
            onCheckedChange={(checked) => updateField('hero', 'enabled', checked)}
          />
          <Label className="text-foreground text-sm font-semibold">Ativar seção</Label>
        </div>
      </div>

      {/* Textos Principais */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Textos Principais</Label>

        <div>
          <Label className="text-foreground font-semibold mb-2 block">Título</Label>
          <DebouncedInputV2
            value={hero?.title || ''}
            onDebouncedChange={(v) => updateField('hero', 'title', v)}
            className="input-admin"
            placeholder="Título principal do Hero"
          />
        </div>

        <div>
          <Label className="text-foreground font-semibold mb-2 block">Subtítulo</Label>
          <DebouncedTextareaV2
            value={hero?.subtitle || ''}
            onDebouncedChange={(v) => updateField('hero', 'subtitle', v)}
            className="input-admin"
            placeholder="Subtítulo do Hero"
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
            value={hero?.imageDesktop}
            onChange={(url) => updateField('hero', 'imageDesktop', url)}
          />
          <ImageUploadV2
            label="Imagem Mobile"
            recommendedSize="1080 × 1350"
            value={hero?.imageMobile}
            onChange={(url) => updateField('hero', 'imageMobile', url)}
          />
        </div>

        {/* Posição da Imagem */}
        <div>
          <Label className="text-foreground font-semibold mb-2 block">Posição da Imagem</Label>
          <p className="text-xs text-muted-foreground mb-3">Define qual parte da imagem fica visível quando ela é maior que a área do banner</p>
          <div className="flex gap-2">
            {([
              { value: 'top', label: 'Topo' },
              { value: 'center', label: 'Centro' },
              { value: 'bottom', label: 'Base' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField('hero', 'imagePosition', opt.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  (hero?.imagePosition || 'center') === opt.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTAs de Ação */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">CTAs de Ação</Label>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground font-semibold mb-2 block">CTA Primário - Texto</Label>
            <DebouncedInputV2
              value={hero?.ctaPrimary?.text || ''}
              onDebouncedChange={(v) => updateNestedField('hero.ctaPrimary.text', v)}
              className="input-admin"
              placeholder="Ex: Quero Assinar"
            />
          </div>
          <div>
            <Label className="text-foreground font-semibold mb-2 block">CTA Primário - Link</Label>
            <DebouncedInputV2
              value={hero?.ctaPrimary?.link || ''}
              onDebouncedChange={(v) => updateNestedField('hero.ctaPrimary.link', v)}
              className="input-admin"
              placeholder="Ex: /checkout"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground font-semibold mb-2 block">CTA Secundário - Texto</Label>
            <DebouncedInputV2
              value={hero?.ctaSecondary?.text || ''}
              onDebouncedChange={(v) => updateNestedField('hero.ctaSecondary.text', v)}
              className="input-admin"
              placeholder="Ex: Saiba Mais"
            />
          </div>
          <div>
            <Label className="text-foreground font-semibold mb-2 block">CTA Secundário - Link</Label>
            <DebouncedInputV2
              value={hero?.ctaSecondary?.link || ''}
              onDebouncedChange={(v) => updateNestedField('hero.ctaSecondary.link', v)}
              className="input-admin"
              placeholder="Ex: #beneficios"
            />
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Hero"
        ctaData={hero?.footerCta}
        onUpdate={(updates) => {
          updateSection('hero', {
            ...hero,
            footerCta: {
              ...(hero?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }),
              ...updates,
            },
          });
        }}
      />
    </div>
  );
});

HeroEditorV2.displayName = 'HeroEditorV2';
