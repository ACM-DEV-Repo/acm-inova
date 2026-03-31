import { useState } from 'react';
import * as Sentry from '@sentry/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Pencil } from 'lucide-react';
import { LPRecord } from '@/lib/cms-v2/cms-types';
import { toast } from 'sonner';

interface InlineSlugEditorProps {
  lp: LPRecord;
  onSave: (slug: string) => Promise<void>;
}

export function InlineSlugEditor({ lp, onSave }: InlineSlugEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(lp.slug);
  const [isSaving, setIsSaving] = useState(false);

  const fullUrl = `${window.location.origin}/l/${lp.slug}`;

  const handleSave = async () => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!cleaned || cleaned === lp.slug) {
      setValue(lp.slug);
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(cleaned);
    } catch (err) {
      Sentry.captureException(err, { extra: { context: 'InlineSlugEditor.handleSave' } });
      toast.error('Erro ao salvar slug');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success('Link copiado!');
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground font-mono">/l/</span>
        {isEditing ? (
          <div className="flex items-center gap-1 flex-1">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              onBlur={handleSave}
              disabled={isSaving}
              className="h-6 text-xs font-mono px-1.5 py-0"
              autoFocus
            />
          </div>
        ) : (
          <>
            <span className="text-xs text-foreground font-mono font-medium">{lp.slug}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground hover:text-foreground"
              onClick={() => { setValue(lp.slug); setIsEditing(true); }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-muted-foreground/70 font-mono truncate max-w-[200px]">
          {fullUrl}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-muted-foreground hover:text-accent shrink-0"
          onClick={handleCopy}
          title="Copiar link"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
