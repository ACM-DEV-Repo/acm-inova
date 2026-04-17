import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Plus } from "lucide-react";
import { V2SectionEditorProps } from "./types";
import { LPContent } from "@/lib/cms-v2/cms-types";
import { cn } from "@/lib/utils";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ============================================================
// Labels de cada secao
// ============================================================
const SECTION_LABELS: Record<string, string> = {
  hero: 'Destaque',
  benefits: 'Benefícios',
  howItWorks: 'Como Funciona',
  plans: 'Produtos',
  testimonials: 'Depoimentos',
  kpis: 'Números',
  speakers: 'Palestrantes',
  sponsors: 'Patrocinadores',
  carousel: 'Carrossel de Imagens',
  about: 'Sobre',
  contact: 'Contato',
  beforeAfter: 'Antes e Depois',
  process: 'Processo',
  services: 'Serviços',
  schedule: 'Programação',
  video: 'Vídeo',
  videoCarousel: 'Carrossel de Vídeos',
  whyChoose: 'Por que Escolher',
  ctaFinal: 'Chamada Final',
  faq: 'FAQ',
  form: 'Formulário',
  forWhom: 'Para Quem',
};

const ALL_SECTIONS = Object.keys(SECTION_LABELS);

// ============================================================
// SortableItem — cada secao arrastavel
// ============================================================
interface SortableItemProps {
  sectionId: string;
  isEnabled: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

const SortableItem = ({ sectionId, isEnabled, onToggle, onRemove }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl border transition-all duration-200',
        isDragging && 'opacity-80 shadow-lg z-50 scale-[1.02]',
        isEnabled
          ? 'bg-background/50 border-border/20'
          : 'bg-muted/30 border-border/10 opacity-60'
      )}
    >
      {/* Grip Handle — funcional com dnd-kit */}
      <button
        type="button"
        className={cn(
          'cursor-grab active:cursor-grabbing p-1 rounded',
          'text-muted-foreground hover:text-foreground transition-colors',
          'touch-none select-none'
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Label */}
      <span className={cn(
        'flex-1 text-sm font-medium text-foreground',
        !isEnabled && 'text-muted-foreground line-through'
      )}>
        {SECTION_LABELS[sectionId] || sectionId}
      </span>

      {/* Toggle Switch (ativar/desativar) */}
      <Switch
        checked={isEnabled}
        onCheckedChange={() => onToggle()}
        className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-muted"
      />

      {/* Remover */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-destructive hover:text-destructive text-xs h-7 px-2"
      >
        Remover
      </Button>
    </div>
  );
};

// ============================================================
// SectionOrderEditorV2 — principal
// ============================================================
export const SectionOrderEditorV2 = memo(({ draft, updateField, updateSection }: V2SectionEditorProps) => {
  const activeSections = draft.sectionOrder || [];
  const inactiveSections = ALL_SECTIONS.filter(s => !activeSections.includes(s));

  // Sensores: mouse, touch e teclado
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateOrder = (newOrder: string[]) => {
    updateSection('sectionOrder' as keyof LPContent, newOrder as LPContent['sectionOrder']);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = activeSections.findIndex((id) => id === active.id);
      const newIndex = activeSections.findIndex((id) => id === over.id);
      updateOrder(arrayMove(activeSections, oldIndex, newIndex));
    }
  };

  const addSection = (sectionId: string) => {
    // Adiciona ao order E liga o enabled automaticamente
    updateOrder([...activeSections, sectionId]);
    updateField(sectionId as keyof LPContent, 'enabled', true);
  };

  const removeSection = (sectionId: string) => {
    updateOrder(activeSections.filter(s => s !== sectionId));
  };

  const isSectionEnabled = (sectionId: string): boolean => {
    const section = draft[sectionId as keyof LPContent];
    if (typeof section === 'object' && section !== null && 'enabled' in section) {
      return (section as { enabled?: boolean }).enabled !== false;
    }
    return true;
  };

  const toggleSectionEnabled = (sectionId: string) => {
    const isEnabled = isSectionEnabled(sectionId);
    updateField(sectionId as keyof LPContent, 'enabled', !isEnabled);
  };

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">Ordem das Seções</h2>

      {/* Seções Ativas — drag-and-drop */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">
          Seções na Página ({activeSections.length})
        </Label>

        {activeSections.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border/30 rounded-xl">
            Nenhuma seção adicionada. Adicione seções abaixo.
          </p>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={activeSections}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {activeSections.map((sectionId) => (
                <SortableItem
                  key={sectionId}
                  sectionId={sectionId}
                  isEnabled={isSectionEnabled(sectionId)}
                  onToggle={() => toggleSectionEnabled(sectionId)}
                  onRemove={() => removeSection(sectionId)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Seções Disponíveis — pool para adicionar */}
      {inactiveSections.length > 0 && (
        <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
          <Label className="text-foreground font-semibold text-lg">
            Seções Disponíveis ({inactiveSections.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {inactiveSections.map((sectionId) => (
              <Button
                key={sectionId}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSection(sectionId)}
                className="text-foreground border-border hover:bg-accent/10 rounded-full text-xs gap-1.5"
              >
                <Plus className="h-3 w-3" />
                {SECTION_LABELS[sectionId] || sectionId}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

SectionOrderEditorV2.displayName = 'SectionOrderEditorV2';
