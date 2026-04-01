import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CtaFinalSection } from '@/lib/cms-v2/cms-types';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { DebouncedTextareaV2 } from '@/components/admin/shared-v2/DebouncedTextareaV2';
import { ImageUploadV2 } from '@/components/admin/shared-v2/ImageUploadV2';
import { V2SectionEditorProps } from './types';

export const CTAFinalEditorV2 = memo(({ draft, updateField }: V2SectionEditorProps) => {
  const section = draft.ctaFinal as CtaFinalSection | undefined;

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header com toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Chamada Final <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md ml-2">#ctaFinal</span></h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="ctaFinal-enabled" className="text-sm font-normal">Ativada</Label>
          <Switch
            id="ctaFinal-enabled"
            checked={section?.enabled !== false}
            onCheckedChange={(checked) => updateField('ctaFinal', 'enabled', checked)}
          />
        </div>
      </div>

      {/* Titulo */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Titulo</Label>
        <DebouncedInputV2
          value={section?.title || ''}
          onDebouncedChange={(val) => updateField('ctaFinal', 'title', val)}
          placeholder="Ex: Pronto para comecar?"
        />
        <p className="text-xs text-muted-foreground">
          Use **texto** para negrito e {'{{texto}}'} para destaque colorido.
        </p>
      </div>

      {/* Subtitulo */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Subtitulo</Label>
        <DebouncedTextareaV2
          value={section?.subtitle || ''}
          onDebouncedChange={(val) => updateField('ctaFinal', 'subtitle', val)}
          placeholder="Ex: Agende agora mesmo"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Use **texto** para negrito e {'{{texto}}'} para destaque colorido.
        </p>
      </div>

      {/* Botao */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground font-semibold">Texto do Botao</Label>
          <DebouncedInputV2
            value={section?.buttonText || ''}
            onDebouncedChange={(val) => updateField('ctaFinal', 'buttonText', val)}
            placeholder="Ex: Quero Contratar"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground font-semibold">Link do Botao</Label>
          <DebouncedInputV2
            value={section?.buttonLink || ''}
            onDebouncedChange={(val) => updateField('ctaFinal', 'buttonLink', val)}
            placeholder="Ex: /checkout"
          />
        </div>
      </div>

      {/* Trust Text */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Texto de confianca (opcional)</Label>
        <DebouncedInputV2
          value={section?.trustText || ''}
          onDebouncedChange={(val) => updateField('ctaFinal', 'trustText', val)}
          placeholder="Ex: Sem contrato. Cancele quando quiser."
        />
        <p className="text-xs text-muted-foreground">
          Micro-copy exibido abaixo do botao para reduzir fricao.
        </p>
      </div>

      {/* Imagens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploadV2
          value={section?.imageDesktop || ''}
          onChange={(url) => updateField('ctaFinal', 'imageDesktop', url)}
          label="Imagem Desktop"
        />
        <ImageUploadV2
          value={section?.imageMobile || ''}
          onChange={(url) => updateField('ctaFinal', 'imageMobile', url)}
          label="Imagem Mobile"
        />
      </div>
    </div>
  );
});

CTAFinalEditorV2.displayName = 'CTAFinalEditorV2';
