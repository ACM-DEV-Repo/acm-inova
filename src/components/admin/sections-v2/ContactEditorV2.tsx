import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ContactSection } from '@/lib/cms-v2/cms-types';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { V2SectionEditorProps } from './types';

export const ContactEditorV2 = memo(({ draft, updateField }: V2SectionEditorProps) => {
  const section = draft.contact as ContactSection | undefined;

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header com toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Contato <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md ml-2">#contact</span></h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="contact-enabled" className="text-sm font-normal">Ativada</Label>
          <Switch
            id="contact-enabled"
            checked={section?.enabled !== false}
            onCheckedChange={(checked) => updateField('contact', 'enabled', checked)}
          />
        </div>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Título</Label>
        <DebouncedInputV2
          value={section?.title || ''}
          onDebouncedChange={(val) => updateField('contact', 'title', val)}
          placeholder="Ex: Entre em Contato"
        />
      </div>

      {/* Subtítulo */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Subtítulo</Label>
        <DebouncedInputV2
          value={section?.subtitle || ''}
          onDebouncedChange={(val) => updateField('contact', 'subtitle', val)}
          placeholder="Ex: Estamos prontos para te ajudar"
        />
      </div>

      {/* WhatsApp Link */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Link do WhatsApp</Label>
        <DebouncedInputV2
          value={section?.whatsappLink || ''}
          onDebouncedChange={(val) => updateField('contact', 'whatsappLink', val)}
          placeholder="Ex: https://wa.me/5511999999999"
        />
      </div>
    </div>
  );
});

ContactEditorV2.displayName = 'ContactEditorV2';
