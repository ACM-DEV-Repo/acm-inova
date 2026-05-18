import { memo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Check, Paintbrush } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { V2SectionEditorProps } from "./types";
import { DesignSettings } from "@/lib/cms-v2/cms-types";
import { cn } from "@/lib/utils";

// ============================================================
// ColorField helper (reutilizado do original)
// ============================================================
function ColorField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-foreground text-xs">{label}</Label>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer p-0.5 bg-transparent"
        />
        <DebouncedInputV2
          value={value || ''}
          onDebouncedChange={onChange}
          placeholder={placeholder || '#000000'}
          className="input-admin font-mono flex-1"
        />
      </div>
    </div>
  );
}

// ============================================================
// Presets de Design
// ============================================================
interface DesignPreset {
  id: string;
  name: string;
  description: string;
  preview: string;
  values: Partial<DesignSettings>;
}

const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'premium',
    name: 'Dark Blue',
    description: 'Navy profundo + Verde vibrante — Glass Apple',
    preview: 'bg-gradient-to-br from-[#0e1724] to-[#162231]',
    values: {
      preset: 'premium',
      primaryColor: '#14b781',
      secondaryColor: '#3b82f6',
      backgroundColor: '#0e1724',
      buttonColor: '#14b781',
      titleColor: '#ffffff',
      borderColor: '#476084',
      iconColor: '#14b781',
      starColor: '#facc15',
      textPrimaryColor: '#ffffff',
      textSecondaryColor: '#bfbfbf',
      gradient: { from: '#0e1724', to: '#162231' },
      glassIntensity: 0.14,
      cardRoundness: 'medio' as const,
      verticalSpacing: 'medium' as const,
      fontFamily: 'Inter',
    }
  },
  {
    id: 'dark',
    name: 'Grafite Premium',
    description: 'Cinza vitrificado + Emerald vibrante',
    preview: 'bg-gradient-to-br from-[#18181B] to-[#27272A]',
    values: {
      preset: 'dark',
      primaryColor: '#10B981',
      secondaryColor: '#6366F1',
      backgroundColor: '#18181B',
      buttonColor: '#10B981',
      titleColor: '#FAFAFA',
      borderColor: '#3F3F46',
      iconColor: '#10B981',
      starColor: '#FBBF24',
      textPrimaryColor: '#FAFAFA',
      textSecondaryColor: '#A1A1AA',
      gradient: { from: '#18181B', to: '#27272A' },
      glassIntensity: 0.10,
      cardRoundness: 'medio' as const,
      verticalSpacing: 'medium' as const,
      fontFamily: 'Inter',
    }
  },
  {
    id: 'offwhite',
    name: 'Off White Clean',
    description: 'Branco puro + Azul corporate — Glass Apple',
    preview: 'bg-gradient-to-br from-[#FAFBFC] to-[#F1F5F9]',
    values: {
      preset: 'offwhite',
      primaryColor: '#2563EB',
      secondaryColor: '#0EA5E9',
      backgroundColor: '#FAFBFC',
      buttonColor: '#2563EB',
      titleColor: '#0F172A',
      borderColor: '#E2E8F0',
      iconColor: '#2563EB',
      starColor: '#F59E0B',
      textPrimaryColor: '#0F172A',
      textSecondaryColor: '#64748B',
      gradient: { from: '#FAFBFC', to: '#F1F5F9' },
      glassIntensity: 0.45,
      cardRoundness: 'medio' as const,
      verticalSpacing: 'medium' as const,
      fontFamily: 'Inter',
    }
  },
  {
    id: 'acm',
    name: 'ACM Institucional',
    description: 'Verde médico high-tech — Claro, Apple Glass',
    preview: 'bg-gradient-to-br from-[#F2FAF5] to-[#E8F5EC]',
    values: {
      preset: 'acm',
      primaryColor: '#009023',
      secondaryColor: '#0693E3',
      backgroundColor: '#F2FAF5',
      buttonColor: '#009023',
      titleColor: '#0A2E14',
      borderColor: '#C8E6D0',
      iconColor: '#009023',
      starColor: '#E6A817',
      textPrimaryColor: '#0A2E14',
      textSecondaryColor: '#4D7A5A',
      gradient: { from: '#F2FAF5', to: '#E8F5EC' },
      glassIntensity: 0.50,
      cardRoundness: 'medio' as const,
      verticalSpacing: 'medium' as const,
      fontFamily: 'Inter',
    }
  },
  {
    id: 'sand',
    name: 'Sand Hamptons',
    description: 'Areia premium + Bronze dourado — WCAG AA',
    preview: 'bg-gradient-to-br from-[#F5F0E8] to-[#E8DFD0]',
    values: {
      preset: 'sand',
      primaryColor: '#8B6914',
      secondaryColor: '#996515',
      backgroundColor: '#F5F0E8',
      buttonColor: '#8B6914',
      titleColor: '#1C1917',
      borderColor: '#B8A990',
      iconColor: '#8B6914',
      starColor: '#8B6914',
      textPrimaryColor: '#1C1917',
      textSecondaryColor: '#57534E',
      gradient: { from: '#F5F0E8', to: '#E8DFD0' },
      glassIntensity: 0.55,
      cardRoundness: 'medio' as const,
      verticalSpacing: 'medium' as const,
      fontFamily: 'Inter',
    }
  },
  {
    id: 'saude-rosa',
    name: 'Saúde Feminina',
    description: 'Rosa sofisticado + Terracotta — Wellness Claro',
    preview: 'bg-gradient-to-br from-[#FDF2F6] to-[#F9E8EF]',
    values: {
      preset: 'saude-rosa',
      primaryColor: '#C4507A',
      secondaryColor: '#B87A64',
      backgroundColor: '#FDF2F6',
      buttonColor: '#C4507A',
      titleColor: '#3D1428',
      borderColor: '#E8C8D6',
      iconColor: '#C4507A',
      starColor: '#D4956A',
      textPrimaryColor: '#3D1428',
      textSecondaryColor: '#8A5068',
      gradient: { from: '#FDF2F6', to: '#F9E8EF' },
      glassIntensity: 0.45,
      cardRoundness: 'medio' as const,
      verticalSpacing: 'medium' as const,
      fontFamily: 'Inter',
    }
  },
  {
    id: 'summit-saude',
    name: 'Summit Saúde',
    description: 'Cinza elegante + Cyan médico — Conferência Premium',
    preview: 'bg-gradient-to-br from-[#F0F1F3] to-[#E4E6EA]',
    values: {
      preset: 'summit-saude',
      primaryColor: '#00ACD4',
      secondaryColor: '#0088A8',
      backgroundColor: '#F0F1F3',
      buttonColor: '#00ACD4',
      titleColor: '#1A1D23',
      borderColor: '#D1D5DB',
      iconColor: '#00ACD4',
      starColor: '#F59E0B',
      textPrimaryColor: '#1A1D23',
      textSecondaryColor: '#5A5F6B',
      gradient: { from: '#F0F1F3', to: '#E4E6EA' },
      glassIntensity: 0.45,
      cardRoundness: 'medio' as const,
      verticalSpacing: 'medium' as const,
      fontFamily: 'Inter',
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Cyan',
    description: 'Indigo profundo + Cyan eletrico',
    preview: 'bg-gradient-to-br from-[#0C1222] to-[#162032]',
    values: {
      preset: 'midnight',
      primaryColor: '#22D3EE',
      secondaryColor: '#0EA5E9',
      backgroundColor: '#0C1222',
      buttonColor: '#22D3EE',
      titleColor: '#ECFEFF',
      borderColor: '#164E63',
      iconColor: '#22D3EE',
      starColor: '#FBBF24',
      textPrimaryColor: '#ECFEFF',
      textSecondaryColor: '#67E8F9',
      gradient: { from: '#0C1222', to: '#162032' },
      glassIntensity: 0.12,
      cardRoundness: 'medio' as const,
      verticalSpacing: 'medium' as const,
      fontFamily: 'Inter',
    }
  },
  {
    id: 'tech-conference',
    name: 'Conferência Tech',
    description: 'Preto profundo + Violet elétrico — Futurista e bold',
    preview: 'bg-gradient-to-br from-[#09090B] to-[#18181B]',
    values: {
      preset: 'tech-conference',
      primaryColor: '#8B5CF6',
      secondaryColor: '#A78BFA',
      backgroundColor: '#09090B',
      buttonColor: '#8B5CF6',
      titleColor: '#FAFAFA',
      borderColor: '#3F3F46',
      iconColor: '#A78BFA',
      starColor: '#FBBF24',
      textPrimaryColor: '#FAFAFA',
      textSecondaryColor: '#A1A1AA',
      gradient: { from: '#09090B', to: '#18181B' },
      glassIntensity: 0.14,
      cardRoundness: 'leve' as const,
      verticalSpacing: 'medium' as const,
      fontFamily: 'Montserrat',
    }
  },
  {
    id: 'health-trust',
    name: 'Saúde & Confiança',
    description: 'Branco clínico + Azul médico — Clean e confiável',
    preview: 'bg-gradient-to-br from-[#FFFFFF] to-[#F0F4F8]',
    values: {
      preset: 'health-trust',
      primaryColor: '#0369A1',
      secondaryColor: '#10B981',
      backgroundColor: '#FFFFFF',
      buttonColor: '#0369A1',
      titleColor: '#0C4A6E',
      borderColor: '#BAE6FD',
      iconColor: '#0369A1',
      starColor: '#F59E0B',
      textPrimaryColor: '#0C4A6E',
      textSecondaryColor: '#64748B',
      gradient: { from: '#FFFFFF', to: '#F0F4F8' },
      glassIntensity: 0.50,
      cardRoundness: 'full' as const,
      verticalSpacing: 'medium' as const,
      fontFamily: 'Nunito',
    }
  },
  {
    id: 'workshop-energy',
    name: 'Workshop Intensivo',
    description: 'Laranja vibrante + Dark — Energia e ação',
    preview: 'bg-gradient-to-br from-[#1C1917] to-[#292524]',
    values: {
      preset: 'workshop-energy',
      primaryColor: '#F97316',
      secondaryColor: '#FB923C',
      backgroundColor: '#1C1917',
      buttonColor: '#F97316',
      titleColor: '#FAFAF9',
      borderColor: '#44403C',
      iconColor: '#FB923C',
      starColor: '#FBBF24',
      textPrimaryColor: '#FAFAF9',
      textSecondaryColor: '#A8A29E',
      gradient: { from: '#1C1917', to: '#292524' },
      glassIntensity: 0.14,
      cardRoundness: 'leve' as const,
      verticalSpacing: 'small' as const,
      fontFamily: 'Poppins',
    }
  },
  {
    id: 'editorial-modern',
    name: 'Editorial Moderno',
    description: 'Creme editorial + Preto tipográfico — Sofisticado',
    preview: 'bg-gradient-to-br from-[#FAFAF8] to-[#F5F5F0]',
    values: {
      preset: 'editorial-modern',
      primaryColor: '#18181B',
      secondaryColor: '#71717A',
      backgroundColor: '#FAFAF8',
      buttonColor: '#18181B',
      titleColor: '#09090B',
      borderColor: '#D4D4D8',
      iconColor: '#18181B',
      starColor: '#D4A574',
      textPrimaryColor: '#09090B',
      textSecondaryColor: '#52525B',
      gradient: { from: '#FAFAF8', to: '#F5F5F0' },
      glassIntensity: 0.55,
      cardRoundness: 'leve' as const,
      verticalSpacing: 'large' as const,
      fontFamily: 'Raleway',
    }
  },
];

// ============================================================
// DesignEditorV2 — Presets + Personalização Avançada
// ============================================================
export const DesignEditorV2 = memo(({ draft, updateField, updateSection }: V2SectionEditorProps) => {
  const design = draft.design;
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const activePresetId = design?.preset || '';
  const isCustom = activePresetId === 'custom' || (!activePresetId && design?.primaryColor);

  const applyPreset = (preset: DesignPreset) => {
    updateSection('design', { ...design, ...preset.values });
  };

  const handleGradientChange = (field: 'from' | 'to', value: string) => {
    const currentGradient = design?.gradient || { from: '', to: '' };
    updateSection('design', {
      ...design,
      preset: 'custom',
      gradient: { ...currentGradient, [field]: value }
    });
  };

  // Wrapper para campos avancados — marca preset como 'custom'
  const updateDesignField = (field: string, value: unknown) => {
    updateField('design', field, value);
    // Marca como custom se mudou manualmente
    if (field !== 'preset') {
      updateField('design', 'preset', 'custom');
    }
  };

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">Design</h2>

      {/* ============================================================ */}
      {/* Presets de Tema */}
      {/* ============================================================ */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg flex items-center gap-2">
          <Paintbrush className="h-5 w-5 text-accent" />
          Temas Prontos
        </Label>
        <p className="text-sm text-muted-foreground">
          Escolha um tema como ponto de partida. Todas as cores serão aplicadas automaticamente.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DESIGN_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <div
                key={preset.id}
                className={cn(
                  'relative rounded-2xl border-2 overflow-hidden transition-all duration-200 cursor-pointer group',
                  isActive
                    ? 'border-accent shadow-lg shadow-accent/10'
                    : 'border-border/30 hover:border-border/60 hover:shadow-md'
                )}
                onClick={() => applyPreset(preset)}
              >
                {/* Gradient Preview */}
                <div className={cn('h-24 w-full', preset.preview)} />

                {/* Info */}
                <div className="p-4 bg-background/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground text-sm">{preset.name}</h3>
                    {isActive && (
                      <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Ativo
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>

                  {/* Color palette dots */}
                  <div className="flex gap-1.5 pt-1">
                    {[
                      preset.values.primaryColor,
                      preset.values.backgroundColor,
                      preset.values.titleColor,
                      preset.values.secondaryColor,
                    ].filter(Boolean).map((color, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant={isActive ? 'default' : 'outline'}
                    className={cn(
                      'w-full mt-2 text-xs',
                      isActive && 'bg-accent hover:bg-accent/90 text-accent-foreground'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      applyPreset(preset);
                    }}
                  >
                    {isActive ? 'Tema Ativo' : 'Aplicar Tema'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicador de customização */}
        {isCustom && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Paintbrush className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-600">
              Tema personalizado — cores ajustadas manualmente
            </span>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* Personalização Avançada (Collapsible) */}
      {/* ============================================================ */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <button
            className="flex items-center gap-2.5 w-full px-6 py-4 rounded-2xl bg-muted/20 text-foreground font-semibold text-base hover:bg-muted/30 transition-colors"
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform duration-200',
                advancedOpen && 'rotate-90'
              )}
            />
            Personalização Avançada
            <span className="text-xs font-normal text-muted-foreground ml-auto">
              Cores, gradiente, glass e layout
            </span>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-6 pt-4">
          {/* Cores Principais */}
          <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
            <Label className="text-foreground font-semibold text-lg">Cores Principais</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorField
                label="Cor Primaria *"
                value={design?.primaryColor || ''}
                onChange={(v) => updateDesignField('primaryColor', v)}
                placeholder="#22c55e"
              />
              <ColorField
                label="Cor Secundaria"
                value={design?.secondaryColor || ''}
                onChange={(v) => updateDesignField('secondaryColor', v)}
                placeholder="#3b82f6"
              />
              <ColorField
                label="Cor de Fundo *"
                value={design?.backgroundColor || ''}
                onChange={(v) => updateDesignField('backgroundColor', v)}
                placeholder="#0f172a"
              />
            </div>
          </div>

          {/* Cores de Elementos */}
          <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
            <Label className="text-foreground font-semibold text-lg">Cores de Elementos</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ColorField
                label="Botoes"
                value={design?.buttonColor || ''}
                onChange={(v) => updateDesignField('buttonColor', v)}
                placeholder="#22c55e"
              />
              <ColorField
                label="Títulos"
                value={design?.titleColor || ''}
                onChange={(v) => updateDesignField('titleColor', v)}
                placeholder="#ffffff"
              />
              <ColorField
                label="Bordas"
                value={design?.borderColor || ''}
                onChange={(v) => updateDesignField('borderColor', v)}
                placeholder="#334155"
              />
              <ColorField
                label="Ícones"
                value={design?.iconColor || ''}
                onChange={(v) => updateDesignField('iconColor', v)}
                placeholder="#22c55e"
              />
              <ColorField
                label="Estrelas"
                value={design?.starColor || ''}
                onChange={(v) => updateDesignField('starColor', v)}
                placeholder="#facc15"
              />
              <ColorField
                label="Texto Primario"
                value={design?.textPrimaryColor || ''}
                onChange={(v) => updateDesignField('textPrimaryColor', v)}
                placeholder="#ffffff"
              />
              <ColorField
                label="Texto Secundario"
                value={design?.textSecondaryColor || ''}
                onChange={(v) => updateDesignField('textSecondaryColor', v)}
                placeholder="#94a3b8"
              />
            </div>
          </div>

          {/* Gradiente */}
          <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
            <Label className="text-foreground font-semibold text-lg">Gradiente de Fundo</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorField
                label="De (inicio)"
                value={design?.gradient?.from || ''}
                onChange={(v) => handleGradientChange('from', v)}
                placeholder="#0f172a"
              />
              <ColorField
                label="Para (fim)"
                value={design?.gradient?.to || ''}
                onChange={(v) => handleGradientChange('to', v)}
                placeholder="#1e293b"
              />
            </div>
            {design?.gradient?.from && design?.gradient?.to && (
              <div
                className="h-8 rounded-xl"
                style={{
                  background: `linear-gradient(to right, ${design.gradient.from}, ${design.gradient.to})`
                }}
              />
            )}
          </div>

          {/* Glass Intensity */}
          <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
            <Label className="text-foreground font-semibold text-lg">Efeito Glass</Label>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-foreground text-sm">Intensidade</Label>
                <span className="text-sm text-muted-foreground">
                  {(design?.glassIntensity ?? 0.1).toFixed(2)}
                </span>
              </div>
              <Slider
                value={[design?.glassIntensity ?? 0.1]}
                onValueChange={([value]) => updateDesignField('glassIntensity', value)}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>
          </div>

          {/* Layout */}
          <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
            <Label className="text-foreground font-semibold text-lg">Layout</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground text-xs">Arredondamento dos Cards</Label>
                <Select
                  value={design?.cardRoundness || 'medio'}
                  onValueChange={(v) => updateDesignField('cardRoundness', v as DesignSettings['cardRoundness'])}
                >
                  <SelectTrigger className="input-admin">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leve">Leve (8px)</SelectItem>
                    <SelectItem value="medio">Medio (16px)</SelectItem>
                    <SelectItem value="full">Arredondado (24px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Espaçamento vertical fixo em 100px — controlado pelo CSS global */}

              <div className="space-y-2">
                <Label className="text-foreground text-xs">Fonte</Label>
                <Select
                  value={design?.fontFamily || 'Inter'}
                  onValueChange={(v) => updateDesignField('fontFamily', v)}
                >
                  <SelectTrigger className="input-admin">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Nunito">Nunito</SelectItem>
                    <SelectItem value="Raleway">Raleway</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
});

DesignEditorV2.displayName = 'DesignEditorV2';
