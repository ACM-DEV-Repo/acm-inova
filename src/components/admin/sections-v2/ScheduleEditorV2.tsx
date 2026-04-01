import { memo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, CalendarDays } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { DebouncedTextareaV2 } from "@/components/admin/shared-v2/DebouncedTextareaV2";
import { SectionCTAEditorV2 } from "@/components/admin/shared-v2/SectionCTAEditorV2";
import type { ScheduleSection } from "@/lib/cms-v2/cms-types";
import type { V2SectionEditorProps } from "./types";

export const ScheduleEditorV2 = memo(({
  draft,
  updateField,
  updateSection,
}: V2SectionEditorProps) => {
  const schedule = draft.schedule;
  const days = schedule?.days || [];

  const updateSchedule = useCallback((partial: Partial<ScheduleSection>) => {
    updateSection('schedule', { ...schedule, ...partial } as ScheduleSection);
  }, [schedule, updateSection]);

  const addDay = useCallback(() => {
    const newDay = {
      id: `dia-${Date.now()}`,
      date: '',
      label: `Dia ${days.length + 1}`,
      items: [{ time: '09:00', title: '', speaker: '', location: '' }],
    };
    updateSchedule({ days: [...days, newDay] });
  }, [days, updateSchedule]);

  const removeDay = useCallback((dayIdx: number) => {
    updateSchedule({ days: days.filter((_, i) => i !== dayIdx) });
  }, [days, updateSchedule]);

  const updateDay = useCallback((dayIdx: number, field: string, value: string) => {
    const newDays = [...days];
    newDays[dayIdx] = { ...newDays[dayIdx], [field]: value };
    updateSchedule({ days: newDays });
  }, [days, updateSchedule]);

  const addItem = useCallback((dayIdx: number) => {
    const newDays = [...days];
    newDays[dayIdx] = {
      ...newDays[dayIdx],
      items: [...newDays[dayIdx].items, { time: '', title: '', speaker: '', location: '' }],
    };
    updateSchedule({ days: newDays });
  }, [days, updateSchedule]);

  const removeItem = useCallback((dayIdx: number, itemIdx: number) => {
    const newDays = [...days];
    newDays[dayIdx] = {
      ...newDays[dayIdx],
      items: newDays[dayIdx].items.filter((_, i) => i !== itemIdx),
    };
    updateSchedule({ days: newDays });
  }, [days, updateSchedule]);

  const updateItem = useCallback((dayIdx: number, itemIdx: number, field: string, value: string) => {
    const newDays = [...days];
    const newItems = [...newDays[dayIdx].items];
    newItems[itemIdx] = { ...newItems[itemIdx], [field]: value };
    newDays[dayIdx] = { ...newDays[dayIdx], items: newItems };
    updateSchedule({ days: newDays });
  }, [days, updateSchedule]);

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header + Enabled Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Programação <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md ml-2">#schedule</span></h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={schedule?.enabled !== false}
            onCheckedChange={(checked) => updateField('schedule', 'enabled', checked)}
          />
          <Label className="text-foreground text-sm font-semibold">Ativar seção</Label>
        </div>
      </div>

      {/* Título */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Textos</Label>
        <div>
          <Label className="text-foreground font-semibold mb-2 block">Título</Label>
          <DebouncedInputV2
            value={schedule?.title || ''}
            onDebouncedChange={(v) => updateField('schedule', 'title', v)}
            className="input-admin"
            placeholder="Ex: Programação do Evento"
          />
        </div>
        <div>
          <Label className="text-foreground font-semibold mb-2 block">Subtítulo</Label>
          <DebouncedTextareaV2
            value={schedule?.subtitle || ''}
            onDebouncedChange={(v) => updateField('schedule', 'subtitle', v)}
            className="input-admin"
            placeholder="Ex: Confira a agenda completa"
          />
        </div>
      </div>

      {/* Dias */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold text-lg">
            Dias ({days.length})
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addDay}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Dia
          </Button>
        </div>

        {days.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            Nenhum dia cadastrado. Clique em &quot;Adicionar Dia&quot; para criar.
          </p>
        )}

        {days.map((day, dayIdx) => (
          <div key={day.id} className="bg-muted/20 rounded-2xl p-6 space-y-4">
            {/* Header do dia */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[hsl(var(--ds-color-accent))]" />
                <span className="text-foreground font-semibold text-lg">{day.label || `Dia ${dayIdx + 1}`}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeDay(dayIdx)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Nome e data do dia */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground font-semibold mb-2 block">Nome do Dia</Label>
                <DebouncedInputV2
                  value={day.label || ''}
                  onDebouncedChange={(v) => updateDay(dayIdx, 'label', v)}
                  className="input-admin"
                  placeholder="Ex: Dia 1 — Abertura"
                />
              </div>
              <div>
                <Label className="text-foreground font-semibold mb-2 block">Data</Label>
                <DebouncedInputV2
                  value={day.date || ''}
                  onDebouncedChange={(v) => updateDay(dayIdx, 'date', v)}
                  className="input-admin"
                  placeholder="Ex: 15/03/2026"
                />
              </div>
            </div>

            {/* Atividades do dia */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-semibold">
                  Atividades ({day.items.length})
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem(dayIdx)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Atividade
                </Button>
              </div>

              {day.items.map((item, itemIdx) => (
                <div key={itemIdx} className="bg-background/40 rounded-xl p-4 space-y-3 border border-border/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      Atividade {itemIdx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(dayIdx, itemIdx)}
                      className="text-destructive hover:text-destructive h-7 px-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-foreground text-xs mb-1 block">Horário</Label>
                      <DebouncedInputV2
                        value={item.time || ''}
                        onDebouncedChange={(v) => updateItem(dayIdx, itemIdx, 'time', v)}
                        className="input-admin"
                        placeholder="09:00"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Label className="text-foreground text-xs mb-1 block">Título</Label>
                      <DebouncedInputV2
                        value={item.title || ''}
                        onDebouncedChange={(v) => updateItem(dayIdx, itemIdx, 'title', v)}
                        className="input-admin"
                        placeholder="Nome da atividade"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-foreground text-xs mb-1 block">Palestrante</Label>
                      <DebouncedInputV2
                        value={item.speaker || ''}
                        onDebouncedChange={(v) => updateItem(dayIdx, itemIdx, 'speaker', v)}
                        className="input-admin"
                        placeholder="Nome do palestrante (opcional)"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground text-xs mb-1 block">Local</Label>
                      <DebouncedInputV2
                        value={item.location || ''}
                        onDebouncedChange={(v) => updateItem(dayIdx, itemIdx, 'location', v)}
                        className="input-admin"
                        placeholder="Sala, auditório (opcional)"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Programação"
        ctaData={schedule?.footerCta}
        onUpdate={(updates) => {
          updateSchedule({
            footerCta: {
              ...(schedule?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }),
              ...updates,
            },
          });
        }}
      />
    </div>
  );
});

ScheduleEditorV2.displayName = 'ScheduleEditorV2';
