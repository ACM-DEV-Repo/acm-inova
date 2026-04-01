import { memo } from 'react';
import type { V2SectionEditorProps } from './types';
import type { SponsorsSection } from '@/lib/cms-v2/cms-types';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { ImageUploadV2 } from '@/components/admin/shared-v2/ImageUploadV2';
import { SectionCTAEditorV2 } from '@/components/admin/shared-v2/SectionCTAEditorV2';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Trophy,
  Palette,
} from 'lucide-react';

export const SponsorsEditorV2 = memo(({ draft, updateSection }: V2SectionEditorProps) => {
  const section = (draft.sponsors ?? {}) as SponsorsSection;
  const tiers = section.tiers || [];

  const update = (changes: Partial<SponsorsSection>) => {
    updateSection('sponsors', { ...section, ...changes });
  };

  // ---- Tier helpers ----
  const addTier = () => {
    update({
      tiers: [
        ...tiers,
        { name: 'Novo Tier', enabled: true, color: '', logoHeight: 'md', items: [] },
      ],
    });
  };

  const removeTier = (index: number) => {
    update({ tiers: tiers.filter((_, i) => i !== index) });
  };

  const moveTier = (index: number, direction: 'up' | 'down') => {
    const newTiers = [...tiers];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newTiers.length) return;
    [newTiers[index], newTiers[target]] = [newTiers[target], newTiers[index]];
    update({ tiers: newTiers });
  };

  const updateTier = (index: number, field: string, value: unknown) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    update({ tiers: newTiers });
  };

  // ---- Item helpers (dentro de um tier) ----
  const addSponsor = (tierIndex: number) => {
    const newTiers = [...tiers];
    newTiers[tierIndex] = {
      ...newTiers[tierIndex],
      items: [...newTiers[tierIndex].items, { name: '', logo: '', url: '' }],
    };
    update({ tiers: newTiers });
  };

  const removeSponsor = (tierIndex: number, itemIndex: number) => {
    const newTiers = [...tiers];
    newTiers[tierIndex] = {
      ...newTiers[tierIndex],
      items: newTiers[tierIndex].items.filter((_, i) => i !== itemIndex),
    };
    update({ tiers: newTiers });
  };

  const updateSponsor = (tierIndex: number, itemIndex: number, field: string, value: string) => {
    const newTiers = [...tiers];
    const newItems = [...newTiers[tierIndex].items];
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
    newTiers[tierIndex] = { ...newTiers[tierIndex], items: newItems };
    update({ tiers: newTiers });
  };

  return (
    <div className="space-y-8">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-bold text-foreground">Patrocinadores</h3>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="sponsors-enabled" className="text-sm text-muted-foreground">
            Ativa
          </Label>
          <Switch
            id="sponsors-enabled"
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
          placeholder="Ex: Nossos Patrocinadores"
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

      {/* Tiers */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">
            Categorias ({tiers.length})
          </Label>
          <Button variant="outline" size="sm" onClick={addTier}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Categoria
          </Button>
        </div>

        {tiers.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
            Nenhuma categoria. Clique em "Adicionar Categoria" para começar.
          </p>
        )}

        {tiers.map((tier, tierIndex) => (
          <div
            key={tierIndex}
            className="border border-border/40 rounded-xl bg-background/50 overflow-hidden"
          >
            {/* Tier header */}
            <div
              className="flex items-center justify-between p-4 border-b border-border/30"
              style={
                tier.color
                  ? { borderLeftWidth: 4, borderLeftColor: tier.color }
                  : undefined
              }
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Switch
                  checked={tier.enabled}
                  onCheckedChange={(v) => updateTier(tierIndex, 'enabled', v)}
                />
                <DebouncedInputV2
                  value={tier.name || ''}
                  onDebouncedChange={(v) => updateTier(tierIndex, 'name', v)}
                  placeholder="Nome da categoria"
                  className="max-w-[200px] h-8 text-sm font-semibold"
                />
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveTier(tierIndex, 'up')}
                  disabled={tierIndex === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveTier(tierIndex, 'down')}
                  disabled={tierIndex === tiers.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => removeTier(tierIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tier config */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Cor */}
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5" />
                    Cor do tier
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={tier.color || '#888888'}
                      onChange={(e) => updateTier(tierIndex, 'color', e.target.value)}
                      className="w-10 h-8 p-1 cursor-pointer"
                    />
                    <DebouncedInputV2
                      value={tier.color || ''}
                      onDebouncedChange={(v) => updateTier(tierIndex, 'color', v)}
                      placeholder="#FFFFFF"
                      className="flex-1 h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Tamanho */}
                <div className="space-y-1">
                  <Label className="text-xs">Tamanho dos logos</Label>
                  <Select
                    value={tier.logoHeight || 'md'}
                    onValueChange={(v) => updateTier(tierIndex, 'logoHeight', v)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Pequeno (48px)</SelectItem>
                      <SelectItem value="md">Medio (80px)</SelectItem>
                      <SelectItem value="lg">Grande (120px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sponsors do tier */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    Patrocinadores ({tier.items.length})
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => addSponsor(tierIndex)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Adicionar
                  </Button>
                </div>

                {tier.items.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4 border border-dashed border-border/50 rounded-lg">
                    Nenhum patrocinador neste tier.
                  </p>
                )}

                {tier.items.map((sponsor, sponsorIndex) => (
                  <div
                    key={sponsorIndex}
                    className="flex items-start gap-3 p-3 border border-border/30 rounded-lg bg-background/30"
                  >
                    {/* Logo upload */}
                    <div className="shrink-0 w-36">
                      <ImageUploadV2
                        value={sponsor.logo}
                        onChange={(url) => updateSponsor(tierIndex, sponsorIndex, 'logo', url)}
                        label="Logo"
                        recommendedSize="200x100px"
                      />
                    </div>

                    {/* Campos */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <DebouncedInputV2
                        value={sponsor.name || ''}
                        onDebouncedChange={(v) =>
                          updateSponsor(tierIndex, sponsorIndex, 'name', v)
                        }
                        placeholder="Nome do patrocinador"
                        className="h-8 text-sm"
                      />
                      <DebouncedInputV2
                        value={sponsor.url || ''}
                        onDebouncedChange={(v) =>
                          updateSponsor(tierIndex, sponsorIndex, 'url', v)
                        }
                        placeholder="Link (opcional)"
                        className="h-8 text-xs"
                      />
                    </div>

                    {/* Remove */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                      onClick={() => removeSponsor(tierIndex, sponsorIndex)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Patrocinadores"
        ctaData={section.footerCta}
        onUpdate={(updates) =>
          update({ footerCta: { ...section.footerCta!, ...updates } })
        }
      />
    </div>
  );
});

SponsorsEditorV2.displayName = 'SponsorsEditorV2';
