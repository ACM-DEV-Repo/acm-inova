import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { VideoCarouselSection } from '@/lib/cms-v2/cms-types';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { SectionCTAEditorV2 } from '@/components/admin/shared-v2/SectionCTAEditorV2';
import { V2SectionEditorProps } from './types';

export const VideoCarouselEditorV2 = memo(({ draft, updateField, updateSection }: V2SectionEditorProps) => {
  const section = draft.videoCarousel as VideoCarouselSection | undefined;
  const items = section?.items || [];

  const addItem = () => {
    const newItems = [...items, { title: '', url: '' }];
    updateSection('videoCarousel', { ...draft.videoCarousel, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateSection('videoCarousel', { ...draft.videoCarousel, items: newItems });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    updateSection('videoCarousel', { ...draft.videoCarousel, items: newItems });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSection('videoCarousel', { ...draft.videoCarousel, items: newItems });
  };

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header com toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Carrossel de Videos <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md ml-2">#videoCarousel</span></h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="videoCarousel-enabled" className="text-sm font-normal">Ativada</Label>
          <Switch
            id="videoCarousel-enabled"
            checked={section?.enabled !== false}
            onCheckedChange={(checked) => updateField('videoCarousel', 'enabled', checked)}
          />
        </div>
      </div>

      {/* Titulo */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Titulo</Label>
        <DebouncedInputV2
          value={section?.title || ''}
          onDebouncedChange={(val) => updateField('videoCarousel', 'title', val)}
          placeholder="Ex: Nossos Videos"
        />
      </div>

      {/* Lista de Videos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold">Videos ({items.length})</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            Nenhum video cadastrado. Clique em &quot;Adicionar&quot; para criar.
          </p>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-muted/20 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Video {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'up')}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 'down')}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Titulo</Label>
                <DebouncedInputV2
                  value={item.title || ''}
                  onDebouncedChange={(val) => updateItem(index, 'title', val)}
                  placeholder="Ex: Depoimento do cliente"
                />
              </div>

              <div className="space-y-2">
                <Label>URL do Video</Label>
                <DebouncedInputV2
                  value={item.url || ''}
                  onDebouncedChange={(val) => updateItem(index, 'url', val)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Carrossel de Videos"
        ctaData={section?.footerCta}
        onUpdate={(updates) => {
          updateSection('videoCarousel', {
            ...draft.videoCarousel,
            footerCta: { ...(draft.videoCarousel?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }), ...updates }
          });
        }}
      />
    </div>
  );
});

VideoCarouselEditorV2.displayName = 'VideoCarouselEditorV2';
