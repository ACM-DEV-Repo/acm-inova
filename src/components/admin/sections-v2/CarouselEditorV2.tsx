import { memo } from 'react';
import type { V2SectionEditorProps } from './types';
import type { CarouselSection } from '@/lib/cms-v2/cms-types';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { DebouncedTextareaV2 } from '@/components/admin/shared-v2/DebouncedTextareaV2';
import { ImageUploadV2 } from '@/components/admin/shared-v2/ImageUploadV2';
import { SectionCTAEditorV2 } from '@/components/admin/shared-v2/SectionCTAEditorV2';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  Images,
  Settings2,
} from 'lucide-react';

const DEFAULT_SETTINGS: CarouselSection['settings'] = {
  autoplay: true,
  interval: 5,
  transition: 'slide',
  showDots: true,
  showArrows: true,
  height: 'md',
  rounded: true,
  overlay: true,
  overlayOpacity: 40,
  pauseOnHover: true,
};

export const CarouselEditorV2 = memo(({ draft, updateSection }: V2SectionEditorProps) => {
  const section = (draft.carousel ?? {}) as CarouselSection;
  const slides = section.slides || [];
  const settings = { ...DEFAULT_SETTINGS, ...section.settings };

  const update = (changes: Partial<CarouselSection>) => {
    updateSection('carousel', { ...section, ...changes });
  };

  const updateSettings = (changes: Partial<CarouselSection['settings']>) => {
    update({ settings: { ...settings, ...changes } });
  };

  // ---- Slide helpers ----
  const addSlide = () => {
    update({
      slides: [
        ...slides,
        {
          image: '',
          title: '',
          description: '',
          cta: { text: '', link: '', enabled: false },
          overlayPosition: 'bottom',
        },
      ],
    });
  };

  const removeSlide = (index: number) => {
    update({ slides: slides.filter((_, i) => i !== index) });
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newSlides.length) return;
    [newSlides[index], newSlides[target]] = [newSlides[target], newSlides[index]];
    update({ slides: newSlides });
  };

  const updateSlide = (index: number, field: string, value: unknown) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    update({ slides: newSlides });
  };

  const updateSlideCta = (index: number, field: string, value: unknown) => {
    const newSlides = [...slides];
    const existingCta = newSlides[index].cta || { text: '', link: '', enabled: false };
    newSlides[index] = {
      ...newSlides[index],
      cta: { ...existingCta, [field]: value },
    };
    update({ slides: newSlides });
  };

  return (
    <div className="space-y-8">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Images className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-bold text-foreground">Carrossel de Imagens</h3>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="carousel-enabled" className="text-sm text-muted-foreground">
            Ativa
          </Label>
          <Switch
            id="carousel-enabled"
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
          placeholder="Ex: Galeria do Evento"
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

      {/* ====== Settings Panel ====== */}
      <div className="border border-border/40 rounded-xl bg-background/50 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border/30">
          <Settings2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Configurações</span>
        </div>

        <div className="p-4 space-y-5">
          {/* Row 1: Autoplay + Intervalo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.autoplay}
                onCheckedChange={(v) => updateSettings({ autoplay: v })}
              />
              <Label className="text-sm">Autoplay</Label>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Intervalo ({settings.interval}s)</Label>
              <Slider
                min={1}
                max={15}
                step={1}
                value={[settings.interval]}
                onValueChange={([v]) => updateSettings({ interval: v })}
              />
            </div>
          </div>

          {/* Row 2: Transição + Altura */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Transição</Label>
              <Select
                value={settings.transition}
                onValueChange={(v) => updateSettings({ transition: v as 'slide' | 'fade' })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slide">Deslizar</SelectItem>
                  <SelectItem value="fade">Fade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Altura</Label>
              <Select
                value={settings.height}
                onValueChange={(v) => updateSettings({ height: v as 'sm' | 'md' | 'lg' | 'xl' })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Pequeno (200px)</SelectItem>
                  <SelectItem value="md">Médio (350px)</SelectItem>
                  <SelectItem value="lg">Grande (500px)</SelectItem>
                  <SelectItem value="xl">Extra grande (650px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.showDots}
                onCheckedChange={(v) => updateSettings({ showDots: v })}
              />
              <Label className="text-sm">Indicadores (dots)</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.showArrows}
                onCheckedChange={(v) => updateSettings({ showArrows: v })}
              />
              <Label className="text-sm">Setas de navegação</Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.rounded}
                onCheckedChange={(v) => updateSettings({ rounded: v })}
              />
              <Label className="text-sm">Bordas arredondadas</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.pauseOnHover}
                onCheckedChange={(v) => updateSettings({ pauseOnHover: v })}
              />
              <Label className="text-sm">Pausar no hover</Label>
            </div>
          </div>

          {/* Overlay + Opacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.overlay}
                onCheckedChange={(v) => updateSettings({ overlay: v })}
              />
              <Label className="text-sm">Overlay escuro</Label>
            </div>
            {settings.overlay && (
              <div className="space-y-1">
                <Label className="text-xs">
                  Opacidade ({settings.overlayOpacity}%)
                </Label>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[settings.overlayOpacity]}
                  onValueChange={([v]) => updateSettings({ overlayOpacity: v })}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====== Slides List ====== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">
            Slides ({slides.length})
          </Label>
          <Button variant="outline" size="sm" onClick={addSlide}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Slide
          </Button>
        </div>

        {slides.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
            Nenhum slide cadastrado. Clique em &quot;Adicionar Slide&quot; para começar.
          </p>
        )}

        {slides.map((slide, index) => (
          <div
            key={index}
            className="p-5 border border-border/40 rounded-xl bg-background/50 space-y-4"
          >
            {/* Header do slide */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                #{index + 1} {slide.title || 'Slide'}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveSlide(index, 'up')}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveSlide(index, 'down')}
                  disabled={index === slides.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => removeSlide(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Imagem */}
            <ImageUploadV2
              value={slide.image}
              onChange={(url) => updateSlide(index, 'image', url)}
              label="Imagem do slide"
              recommendedSize="1920x800px (paisagem)"
              shape="landscape"
            />

            {/* Título do slide */}
            <div className="space-y-1">
              <Label className="text-xs">Título (opcional)</Label>
              <DebouncedInputV2
                value={slide.title || ''}
                onDebouncedChange={(v) => updateSlide(index, 'title', v)}
                placeholder="Título sobre a imagem"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-1">
              <Label className="text-xs">Descrição (opcional)</Label>
              <DebouncedTextareaV2
                value={slide.description || ''}
                onDebouncedChange={(v) => updateSlide(index, 'description', v)}
                placeholder="Texto descritivo do slide..."
                rows={2}
              />
            </div>

            {/* Posição do overlay */}
            <div className="space-y-1">
              <Label className="text-xs">Posição do texto (desktop)</Label>
              <Select
                value={slide.overlayPosition || 'bottom'}
                onValueChange={(v) => updateSlide(index, 'overlayPosition', v)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                  <SelectItem value="bottom">Inferior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* CTA do slide */}
            <div className="space-y-3 pt-3 border-t border-border/30">
              <div className="flex items-center gap-3">
                <Switch
                  checked={slide.cta?.enabled ?? false}
                  onCheckedChange={(v) => updateSlideCta(index, 'enabled', v)}
                />
                <Label className="text-sm">Botão de ação (CTA)</Label>
              </div>

              {slide.cta?.enabled && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Texto do botão</Label>
                    <DebouncedInputV2
                      value={slide.cta.text || ''}
                      onDebouncedChange={(v) => updateSlideCta(index, 'text', v)}
                      placeholder="Ex: Saiba mais"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Link</Label>
                    <DebouncedInputV2
                      value={slide.cta.link || ''}
                      onDebouncedChange={(v) => updateSlideCta(index, 'link', v)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Carrossel"
        ctaData={section.footerCta}
        onUpdate={(updates) =>
          update({ footerCta: { ...section.footerCta!, ...updates } })
        }
      />
    </div>
  );
});

CarouselEditorV2.displayName = 'CarouselEditorV2';
