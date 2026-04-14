import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { DebouncedTextareaV2 } from "@/components/admin/shared-v2/DebouncedTextareaV2";
import { ImageUploadV2 } from "@/components/admin/shared-v2/ImageUploadV2";
import { SectionCTAEditorV2 } from "@/components/admin/shared-v2/SectionCTAEditorV2";
import { HERO_BACKGROUND_OPTIONS } from "@/components/landing-v2/HeroBackgrounds";
import type { V2SectionEditorProps } from "./types";

export const HeroEditorV2 = memo(({
  draft,
  updateField,
  updateNestedField,
  updateSection,
}: V2SectionEditorProps) => {
  const hero = draft.hero;
  const bgType = hero?.backgroundType || 'image';

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

      {/* Logo do Evento (opcional — substitui título) */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Logo do Evento</Label>
        <p className="text-xs text-muted-foreground">Quando preenchido, a logo aparece no lugar do título em texto. Ideal para eventos com identidade visual própria.</p>
        <ImageUploadV2
          label="Logo do Evento"
          recommendedSize="PNG transparente, mín. 400px"
          shape="landscape"
          value={hero?.heroLogo}
          onChange={(url) => updateField('hero', 'heroLogo', url)}
        />
        {hero?.heroLogo && (
          <div>
            <Label className="text-foreground font-semibold mb-2 block">Frase embaixo da logo</Label>
            <DebouncedInputV2
              value={hero?.tagline || ''}
              onDebouncedChange={(v) => updateField('hero', 'tagline', v)}
              className="input-admin"
              placeholder="Ex: Especialização em saúde, pesquisa e IA na prática"
            />
          </div>
        )}

        {/* Sombra e destaque da logo */}
        {hero?.heroLogo && (
          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground text-sm">Sombra no contorno da logo</Label>
              <Switch
                checked={hero?.logoShadow !== false}
                onCheckedChange={(checked) => updateField('hero', 'logoShadow', checked)}
              />
            </div>
            {hero?.logoShadow !== false && (
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Intensidade</Label>
                <input
                  type="range"
                  min="0.3" max="1.0" step="0.05"
                  value={hero?.logoShadowIntensity ?? 0.7}
                  onChange={(e) => updateField('hero', 'logoShadowIntensity', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8">{Math.round((hero?.logoShadowIntensity ?? 0.7) * 100)}%</span>
              </div>
            )}
          </div>
        )}

        {/* Barra de destaque atrás da logo */}
        {hero?.heroLogo && (
          <div className="bg-muted/10 rounded-xl p-4 space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-semibold text-sm">Barra de destaque atrás da logo</Label>
              <Switch
                checked={hero?.logoHighlight?.enabled ?? false}
                onCheckedChange={(checked) => updateSection('hero', {
                  ...hero,
                  logoHighlight: { ...hero?.logoHighlight, enabled: checked, color: hero?.logoHighlight?.color || '#000000', opacity: hero?.logoHighlight?.opacity ?? 0.4 },
                })}
              />
            </div>
            {hero?.logoHighlight?.enabled && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Cor</Label>
                  <input
                    type="color"
                    value={hero?.logoHighlight?.color || '#000000'}
                    onChange={(e) => updateSection('hero', {
                      ...hero,
                      logoHighlight: { ...hero.logoHighlight!, color: e.target.value },
                    })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Label className="text-xs text-muted-foreground">Opacidade</Label>
                  <input
                    type="range"
                    min="0.1" max="0.9" step="0.05"
                    value={hero?.logoHighlight?.opacity ?? 0.4}
                    onChange={(e) => updateSection('hero', {
                      ...hero,
                      logoHighlight: { ...hero.logoHighlight!, opacity: parseFloat(e.target.value) },
                    })}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8">{Math.round((hero?.logoHighlight?.opacity ?? 0.4) * 100)}%</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Textos Principais (quando sem logo) */}
      {!hero?.heroLogo && (
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
      )}

      {/* Background Type */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Fundo do Hero</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {HERO_BACKGROUND_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateField('hero', 'backgroundType', opt.value)}
              className={`p-3 rounded-xl text-left transition-all ${
                bgType === opt.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <span className="block text-sm font-semibold">{opt.label}</span>
              <span className="block text-[10px] opacity-70 mt-0.5">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Imagens de Background (só quando bgType = image) */}
      {bgType === 'image' && (
        <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
          <Label className="text-foreground font-semibold text-lg">Imagens de Background</Label>
          <div className="flex flex-wrap gap-6 justify-center">
            <ImageUploadV2
              label="Imagem Desktop"
              recommendedSize="1920 × 1080"
              shape="landscape"
              value={hero?.imageDesktop}
              onChange={(url) => updateField('hero', 'imageDesktop', url)}
            />
            <ImageUploadV2
              label="Imagem Mobile"
              recommendedSize="1080 × 1350"
              shape="square"
              value={hero?.imageMobile}
              onChange={(url) => updateField('hero', 'imageMobile', url)}
            />
          </div>
          <div>
            <Label className="text-foreground font-semibold mb-2 block">Posição da Imagem</Label>
            <p className="text-xs text-muted-foreground mb-3">Define qual parte da imagem fica visível</p>
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
      )}

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
