import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { WhyChooseSection } from '@/lib/cms-v2/cms-types';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { ImageUploadV2 } from '@/components/admin/shared-v2/ImageUploadV2';
import { SectionCTAEditorV2 } from '@/components/admin/shared-v2/SectionCTAEditorV2';
import { IconPickerV2 } from '@/components/admin/shared-v2/IconPickerV2';
import { V2SectionEditorProps } from './types';

export const WhyChooseEditorV2 = memo(({ draft, updateField, updateSection }: V2SectionEditorProps) => {
  const section = draft.whyChoose as WhyChooseSection | undefined;
  const items = section?.items || [];

  const addItem = () => {
    const newItems = [...items, { title: '', description: '' }];
    updateSection('whyChoose', { ...draft.whyChoose, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateSection('whyChoose', { ...draft.whyChoose, items: newItems });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSection('whyChoose', { ...draft.whyChoose, items: newItems });
  };

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header com toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Por que Escolher <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md ml-2">#whyChoose</span></h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="whyChoose-enabled" className="text-sm font-normal">Ativada</Label>
          <Switch
            id="whyChoose-enabled"
            checked={section?.enabled !== false}
            onCheckedChange={(checked) => updateField('whyChoose', 'enabled', checked)}
          />
        </div>
      </div>

      {/* Titulo */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Titulo</Label>
        <DebouncedInputV2
          value={section?.title || ''}
          onDebouncedChange={(val) => updateField('whyChoose', 'title', val)}
          placeholder="Ex: Por que escolher a LimpMe?"
        />
      </div>

      {/* Subtitulo */}
      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Subtitulo</Label>
        <DebouncedInputV2
          value={section?.subtitle || ''}
          onDebouncedChange={(val) => updateField('whyChoose', 'subtitle', val)}
          placeholder="Ex: Descubra nossas vantagens"
        />
      </div>

      {/* Imagens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploadV2
          value={section?.imageDesktop || ''}
          onChange={(url) => updateField('whyChoose', 'imageDesktop', url)}
          label="Imagem Desktop"
        />
        <ImageUploadV2
          value={section?.imageMobile || ''}
          onChange={(url) => updateField('whyChoose', 'imageMobile', url)}
          label="Imagem Mobile"
        />
      </div>

      {/* Lista de Itens */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold">Itens ({items.length})</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            Nenhum item cadastrado. Clique em &quot;Adicionar&quot; para criar.
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
                  Item {index + 1}
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

              <div className="space-y-3">
                <Label>Titulo</Label>
                <DebouncedInputV2
                  value={item.title || ''}
                  onDebouncedChange={(val) => updateItem(index, 'title', val)}
                  placeholder="Ex: Profissionais qualificados"
                />
                <div className="flex items-center gap-2">
                  <Label className="text-foreground text-xs">Ícone:</Label>
                  <IconPickerV2
                    value={item.icon}
                    onChange={(icon) => updateItem(index, 'icon', icon)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descricao</Label>
                <DebouncedInputV2
                  value={item.description || ''}
                  onDebouncedChange={(val) => updateItem(index, 'description', val)}
                  placeholder="Ex: Nossa equipe e treinada..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Por que Escolher"
        ctaData={section?.footerCta}
        onUpdate={(updates) => {
          updateSection('whyChoose', {
            ...draft.whyChoose,
            footerCta: { ...(draft.whyChoose?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }), ...updates }
          });
        }}
      />
    </div>
  );
});

WhyChooseEditorV2.displayName = 'WhyChooseEditorV2';
