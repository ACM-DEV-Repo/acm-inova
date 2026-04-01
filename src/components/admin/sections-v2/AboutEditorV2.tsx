import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AboutSection } from '@/lib/cms-v2/cms-types';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { DebouncedTextareaV2 } from '@/components/admin/shared-v2/DebouncedTextareaV2';
import { ImageUploadV2 } from '@/components/admin/shared-v2/ImageUploadV2';
import { SectionCTAEditorV2 } from '@/components/admin/shared-v2/SectionCTAEditorV2';
import { V2SectionEditorProps } from './types';

export const AboutEditorV2 = memo(({ draft, updateField, updateSection }: V2SectionEditorProps) => {
  const section = draft.about as AboutSection | undefined;

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header com toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Sobre</h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="about-enabled" className="text-sm font-normal">Ativada</Label>
          <Switch
            id="about-enabled"
            checked={section?.enabled !== false}
            onCheckedChange={(checked) => updateField('about', 'enabled', checked)}
          />
        </div>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Título</Label>
        <DebouncedInputV2
          value={section?.title || ''}
          onDebouncedChange={(val) => updateField('about', 'title', val)}
          placeholder="Ex: Sobre a LimpMe"
        />
      </div>

      {/* Texto */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Texto</Label>
        <DebouncedTextareaV2
          value={section?.text || ''}
          onDebouncedChange={(val) => updateField('about', 'text', val)}
          placeholder="Conte a historia da sua empresa..."
          rows={5}
        />
      </div>

      {/* Imagens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploadV2
          value={section?.imageDesktop || ''}
          onChange={(url) => updateField('about', 'imageDesktop', url)}
          label="Imagem Desktop"
        />
        <ImageUploadV2
          value={section?.imageMobile || ''}
          onChange={(url) => updateField('about', 'imageMobile', url)}
          label="Imagem Mobile"
        />
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Sobre"
        ctaData={section?.footerCta}
        onUpdate={(updates) => {
          updateSection('about', {
            ...draft.about,
            footerCta: { ...(draft.about?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }), ...updates }
          });
        }}
      />
    </div>
  );
});

AboutEditorV2.displayName = 'AboutEditorV2';
