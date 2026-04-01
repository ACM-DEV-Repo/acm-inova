import { memo } from 'react';
import type { V2SectionEditorProps } from './types';
import type { SpeakersSection } from '@/lib/cms-v2/cms-types';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { DebouncedTextareaV2 } from '@/components/admin/shared-v2/DebouncedTextareaV2';
import { ImageUploadV2 } from '@/components/admin/shared-v2/ImageUploadV2';
import { SectionCTAEditorV2 } from '@/components/admin/shared-v2/SectionCTAEditorV2';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Instagram,
  Linkedin,
  Globe,
  Mic2,
} from 'lucide-react';

export const SpeakersEditorV2 = memo(({ draft, updateSection }: V2SectionEditorProps) => {
  const section = (draft.speakers ?? {}) as SpeakersSection;
  const items = section.items || [];

  const update = (changes: Partial<SpeakersSection>) => {
    updateSection('speakers', { ...section, ...changes });
  };

  const addItem = () => {
    update({
      items: [
        ...items,
        { name: '', role: '', bio: '', image: '', socials: { instagram: '', linkedin: '', website: '' } },
      ],
    });
  };

  const removeItem = (index: number) => {
    update({ items: items.filter((_, i) => i !== index) });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    update({ items: newItems });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    update({ items: newItems });
  };

  const updateSocial = (index: number, platform: string, value: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      socials: { ...newItems[index].socials, [platform]: value },
    };
    update({ items: newItems });
  };

  return (
    <div className="space-y-8">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mic2 className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-bold text-foreground">Palestrantes</h3>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="speakers-enabled" className="text-sm text-muted-foreground">
            Ativa
          </Label>
          <Switch
            id="speakers-enabled"
            checked={section?.enabled !== false}
            onCheckedChange={(v) => update({ enabled: v })}
          />
        </div>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <Label>Título</Label>
        <DebouncedInputV2
          value={section.title || ''}
          onDebouncedChange={(v) => update({ title: v })}
          placeholder="Ex: Nossos Palestrantes"
        />
      </div>

      {/* Subtítulo */}
      <div className="space-y-2">
        <Label>Subtítulo</Label>
        <DebouncedInputV2
          value={section.subtitle || ''}
          onDebouncedChange={(v) => update({ subtitle: v })}
          placeholder="Opcional"
        />
      </div>

      {/* Layout */}
      <div className="space-y-2">
        <Label>Layout</Label>
        <Select
          value={section.layout || 'grid'}
          onValueChange={(v) => update({ layout: v as 'grid' | 'featured' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid (todos iguais)</SelectItem>
            <SelectItem value="featured">Featured (primeiro maior)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Palestrantes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">
            Palestrantes ({items.length})
          </Label>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
            Nenhum palestrante. Clique em "Adicionar" para começar.
          </p>
        )}

        {items.map((item, index) => (
          <div
            key={index}
            className="p-5 border border-border/40 rounded-xl bg-background/50 space-y-4"
          >
            {/* Header do card */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                #{index + 1} {item.name || 'Palestrante'}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Foto */}
            <ImageUploadV2
              value={item.image}
              onChange={(url) => updateItem(index, 'image', url)}
              label="Foto do palestrante"
              recommendedSize="400x400px (quadrado)"
            />

            {/* Nome */}
            <div className="space-y-1">
              <Label className="text-xs">Nome</Label>
              <DebouncedInputV2
                value={item.name || ''}
                onDebouncedChange={(v) => updateItem(index, 'name', v)}
                placeholder="Nome completo"
              />
            </div>

            {/* Cargo */}
            <div className="space-y-1">
              <Label className="text-xs">Cargo / Papel</Label>
              <DebouncedInputV2
                value={item.role || ''}
                onDebouncedChange={(v) => updateItem(index, 'role', v)}
                placeholder="Ex: CEO, Palestrante, Especialista"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <Label className="text-xs">Bio</Label>
              <DebouncedTextareaV2
                value={item.bio || ''}
                onDebouncedChange={(v) => updateItem(index, 'bio', v)}
                placeholder="Breve descricao do palestrante..."
                rows={3}
              />
              <p className="text-[11px] text-muted-foreground">
                Use **texto** para negrito e {'{{texto}}'} para destaque colorido
              </p>
            </div>

            {/* Redes sociais */}
            <div className="space-y-3 pt-2 border-t border-border/30">
              <Label className="text-xs font-semibold">Redes Sociais (opcional)</Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-muted-foreground shrink-0" />
                  <DebouncedInputV2
                    value={item.socials?.instagram || ''}
                    onDebouncedChange={(v) => updateSocial(index, 'instagram', v)}
                    placeholder="https://instagram.com/..."
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <DebouncedInputV2
                    value={item.socials?.linkedin || ''}
                    onDebouncedChange={(v) => updateSocial(index, 'linkedin', v)}
                    placeholder="https://linkedin.com/in/..."
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <DebouncedInputV2
                    value={item.socials?.website || ''}
                    onDebouncedChange={(v) => updateSocial(index, 'website', v)}
                    placeholder="https://..."
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Palestrantes"
        ctaData={section.footerCta}
        onUpdate={(updates) =>
          update({ footerCta: { ...section.footerCta!, ...updates } })
        }
      />
    </div>
  );
});

SpeakersEditorV2.displayName = 'SpeakersEditorV2';
