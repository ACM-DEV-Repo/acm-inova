import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowUp, ArrowDown, Star } from 'lucide-react';
import { TestimonialsSection } from '@/lib/cms-v2/cms-types';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { DebouncedTextareaV2 } from '@/components/admin/shared-v2/DebouncedTextareaV2';
import { ImageUploadV2 } from '@/components/admin/shared-v2/ImageUploadV2';
import { SectionCTAEditorV2 } from '@/components/admin/shared-v2/SectionCTAEditorV2';
import { V2SectionEditorProps } from './types';

export const TestimonialsEditorV2 = memo(({ draft, updateField, updateSection }: V2SectionEditorProps) => {
  const section = draft.testimonials as TestimonialsSection | undefined;
  const items = section?.items || [];

  const addItem = () => {
    const newItems = [...items, { image: '', text: '', name: '', city: '', rating: 5 }];
    updateSection('testimonials', { ...draft.testimonials, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateSection('testimonials', { ...draft.testimonials, items: newItems });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    updateSection('testimonials', { ...draft.testimonials, items: newItems });
  };

  const updateItem = (index: number, field: string, value: unknown) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSection('testimonials', { ...draft.testimonials, items: newItems });
  };

  const renderStars = (index: number, currentRating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => updateItem(index, 'rating', star)}
          className="focus:outline-none"
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              star <= currentRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header com toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Depoimentos <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md ml-2">#testimonials</span></h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="testimonials-enabled" className="text-sm font-normal">Ativada</Label>
          <Switch
            id="testimonials-enabled"
            checked={section?.enabled !== false}
            onCheckedChange={(checked) => updateField('testimonials', 'enabled', checked)}
          />
        </div>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Título</Label>
        <DebouncedInputV2
          value={section?.title || ''}
          onDebouncedChange={(val) => updateField('testimonials', 'title', val)}
          placeholder="Ex: O que nossos clientes dizem"
        />
      </div>

      {/* Lista de Depoimentos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold">Depoimentos ({items.length})</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            Nenhum depoimento cadastrado. Clique em &quot;Adicionar&quot; para criar.
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
                  {item.name || `Depoimento ${index + 1}`}
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

              {/* Foto */}
              <ImageUploadV2
                value={item.image || ''}
                onChange={(url) => updateItem(index, 'image', url)}
                label="Foto"
              />

              {/* Nome e Cidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <DebouncedInputV2
                    value={item.name || ''}
                    onDebouncedChange={(val) => updateItem(index, 'name', val)}
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <DebouncedInputV2
                    value={item.city || ''}
                    onDebouncedChange={(val) => updateItem(index, 'city', val)}
                    placeholder="Ex: Sao Paulo, SP"
                  />
                </div>
              </div>

              {/* Texto do Depoimento */}
              <div className="space-y-2">
                <Label>Depoimento</Label>
                <DebouncedTextareaV2
                  value={item.text || ''}
                  onDebouncedChange={(val) => updateItem(index, 'text', val)}
                  placeholder="O que o cliente disse..."
                  rows={3}
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>Avaliação</Label>
                {renderStars(index, item.rating || 5)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Depoimentos"
        ctaData={section?.footerCta}
        onUpdate={(updates) => {
          updateSection('testimonials', {
            ...draft.testimonials,
            footerCta: { ...(draft.testimonials?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }), ...updates }
          });
        }}
      />
    </div>
  );
});

TestimonialsEditorV2.displayName = 'TestimonialsEditorV2';
