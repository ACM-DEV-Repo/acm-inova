import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { FaqSection } from '@/lib/cms-v2/cms-types';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { DebouncedTextareaV2 } from '@/components/admin/shared-v2/DebouncedTextareaV2';
import { SectionCTAEditorV2 } from '@/components/admin/shared-v2/SectionCTAEditorV2';
import { V2SectionEditorProps } from './types';

export const FAQEditorV2 = memo(({ draft, updateField, updateSection }: V2SectionEditorProps) => {
  const section = draft.faq as FaqSection | undefined;
  const items = section?.items || [];

  const addItem = () => {
    const newItems = [...items, { question: '', answer: '' }];
    updateSection('faq', { ...draft.faq, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateSection('faq', { ...draft.faq, items: newItems });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSection('faq', { ...draft.faq, items: newItems });
  };

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header com toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Perguntas Frequentes <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md ml-2">#faq</span></h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="faq-enabled" className="text-sm font-normal">Ativada</Label>
          <Switch
            id="faq-enabled"
            checked={section?.enabled !== false}
            onCheckedChange={(checked) => updateField('faq', 'enabled', checked)}
          />
        </div>
      </div>

      {/* Titulo */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Titulo</Label>
        <DebouncedInputV2
          value={section?.title || ''}
          onDebouncedChange={(val) => updateField('faq', 'title', val)}
          placeholder="Ex: Perguntas Frequentes"
        />
      </div>

      {/* Lista de Perguntas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold">Perguntas ({items.length})</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {items.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <HelpCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhuma pergunta cadastrada. Clique em &quot;Adicionar&quot; para criar.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-muted/20 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Pergunta {index + 1}
                </span>
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

              <div className="space-y-2">
                <Label>Pergunta</Label>
                <DebouncedInputV2
                  value={item.question || ''}
                  onDebouncedChange={(val) => updateItem(index, 'question', val)}
                  placeholder="Ex: Como funciona o servico?"
                />
              </div>

              <div className="space-y-2">
                <Label>Resposta</Label>
                <DebouncedTextareaV2
                  value={item.answer || ''}
                  onDebouncedChange={(val) => updateItem(index, 'answer', val)}
                  placeholder="Escreva a resposta completa..."
                  rows={4}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="FAQ"
        ctaData={section?.footerCta}
        onUpdate={(updates) => {
          updateSection('faq', {
            ...draft.faq,
            footerCta: { ...(draft.faq?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }), ...updates }
          });
        }}
      />
    </div>
  );
});

FAQEditorV2.displayName = 'FAQEditorV2';
