import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { VideoSection } from '@/lib/cms-v2/cms-types';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { SectionCTAEditorV2 } from '@/components/admin/shared-v2/SectionCTAEditorV2';
import { V2SectionEditorProps } from './types';

export const VideoEditorV2 = memo(({ draft, updateField, updateSection }: V2SectionEditorProps) => {
  const section = draft.video as VideoSection | undefined;

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header com toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Vídeo</h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="video-enabled" className="text-sm font-normal">Ativada</Label>
          <Switch
            id="video-enabled"
            checked={section?.enabled !== false}
            onCheckedChange={(checked) => updateField('video', 'enabled', checked)}
          />
        </div>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Título</Label>
        <DebouncedInputV2
          value={section?.title || ''}
          onDebouncedChange={(val) => updateField('video', 'title', val)}
          placeholder="Ex: Assista ao nosso video"
        />
      </div>

      {/* Subtítulo */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Subtítulo</Label>
        <DebouncedInputV2
          value={section?.subtitle || ''}
          onDebouncedChange={(val) => updateField('video', 'subtitle', val)}
          placeholder="Ex: Conheca nosso trabalho"
        />
      </div>

      {/* URL do Video */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">URL do Video (YouTube / Vimeo)</Label>
        <DebouncedInputV2
          value={section?.url || ''}
          onDebouncedChange={(val) => updateField('video', 'url', val)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Video"
        ctaData={section?.footerCta}
        onUpdate={(updates) => {
          updateSection('video', {
            ...draft.video,
            footerCta: { ...(draft.video?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }), ...updates }
          });
        }}
      />
    </div>
  );
});

VideoEditorV2.displayName = 'VideoEditorV2';
