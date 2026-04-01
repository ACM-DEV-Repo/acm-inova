import { memo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, Star, X } from "lucide-react";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { IconPickerV2 } from "@/components/admin/shared-v2/IconPickerV2";
import { SectionCTAEditorV2 } from "@/components/admin/shared-v2/SectionCTAEditorV2";
import type { PlansSection } from "@/lib/cms-v2/cms-types";
import type { V2SectionEditorProps } from "./types";

type PlanItem = PlansSection['items'][number];

export const PlansEditorV2 = memo(({
  draft,
  updateField,
  updateSection,
}: V2SectionEditorProps) => {
  const plans = draft.plans;
  const items = plans?.items || [];

  const addItem = useCallback(() => {
    const newId = `plan-${Date.now()}`;
    const newItems: PlanItem[] = [
      ...items,
      {
        id: newId,
        name: '',
        frequency: 'mensal',
        price: '',
        originalPrice: '',
        showStrikethrough: false,
        discount: '',
        supportText: '',
        features: [],
        link: '',
        recommended: false,
      },
    ];
    updateSection('plans', { ...plans, items: newItems });
  }, [items, plans, updateSection]);

  const removeItem = useCallback((index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateSection('plans', { ...plans, items: newItems });
  }, [items, plans, updateSection]);

  const updateItem = useCallback(<K extends keyof PlanItem>(index: number, field: K, value: PlanItem[K]) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSection('plans', { ...plans, items: newItems });
  }, [items, plans, updateSection]);

  const addFeature = useCallback((itemIndex: number) => {
    const newItems = [...items];
    const features = [...(newItems[itemIndex].features || []), ''];
    newItems[itemIndex] = { ...newItems[itemIndex], features };
    updateSection('plans', { ...plans, items: newItems });
  }, [items, plans, updateSection]);

  const removeFeature = useCallback((itemIndex: number, featureIndex: number) => {
    const newItems = [...items];
    const features = (newItems[itemIndex].features || []).filter((_, i) => i !== featureIndex);
    newItems[itemIndex] = { ...newItems[itemIndex], features };
    updateSection('plans', { ...plans, items: newItems });
  }, [items, plans, updateSection]);

  const updateFeature = useCallback((itemIndex: number, featureIndex: number, value: string) => {
    const newItems = [...items];
    const features = [...(newItems[itemIndex].features || [])];
    features[featureIndex] = value;
    newItems[itemIndex] = { ...newItems[itemIndex], features };
    updateSection('plans', { ...plans, items: newItems });
  }, [items, plans, updateSection]);

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header + Enabled Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Produtos</h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={plans?.enabled !== false}
            onCheckedChange={(checked) => updateField('plans', 'enabled', checked)}
          />
          <Label className="text-foreground text-sm font-semibold">Ativar seção</Label>
        </div>
      </div>

      {/* Título da Seção */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Título da Seção</Label>
        <DebouncedInputV2
          value={plans?.title || ''}
          onDebouncedChange={(v) => updateField('plans', 'title', v)}
          className="input-admin"
          placeholder="Ex: Nossos Produtos"
        />
      </div>

      {/* Lista de Planos */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold text-lg">
            Produtos ({items.length})
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Produto
          </Button>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
            Nenhum produto cadastrado. Clique em &quot;Adicionar Produto&quot; para criar.
          </p>
        )}

        <div className="space-y-6">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className={`bg-muted/20 rounded-2xl border p-6 space-y-4 ${
                item.recommended ? 'border-primary bg-primary/5' : 'border-border/30'
              }`}
            >
              {/* Plan Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {item.name || `Produto ${index + 1}`}
                  </span>
                  {item.recommended && (
                    <Badge variant="default" className="gap-1">
                      <Star className="h-3 w-3" />
                      Recomendado
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={item.recommended ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateItem(index, 'recommended', !item.recommended)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Ícone + Dados Básicos */}
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-foreground font-semibold mb-2 block">Ícone</Label>
                  <IconPickerV2
                    value={item.icon || ''}
                    onChange={(v) => updateItem(index, 'icon', v)}
                  />
                </div>
                <div>
                  <Label className="text-foreground font-semibold mb-2 block">Nome do Produto</Label>
                  <DebouncedInputV2
                    value={item.name || ''}
                    onDebouncedChange={(v) => updateItem(index, 'name', v)}
                    className="input-admin"
                    placeholder="Ex: Mensal"
                  />
                </div>
                <div>
                  <Label className="text-foreground font-semibold mb-2 block">Frequência</Label>
                  <DebouncedInputV2
                    value={item.frequency || ''}
                    onDebouncedChange={(v) => updateItem(index, 'frequency', v)}
                    className="input-admin"
                    placeholder="Ex: /mês"
                  />
                </div>
                <div>
                  <Label className="text-foreground font-semibold mb-2 block">Preço</Label>
                  <DebouncedInputV2
                    value={item.price || ''}
                    onDebouncedChange={(v) => updateItem(index, 'price', v)}
                    className="input-admin"
                    placeholder="Ex: R$ 79,90"
                  />
                </div>
              </div>

              {/* Preço Original e Desconto */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-foreground font-semibold mb-2 block">Preço Original</Label>
                  <DebouncedInputV2
                    value={item.originalPrice || ''}
                    onDebouncedChange={(v) => updateItem(index, 'originalPrice', v)}
                    className="input-admin"
                    placeholder="Ex: R$ 99,90"
                  />
                </div>
                <div>
                  <Label className="text-foreground font-semibold mb-2 block">Desconto</Label>
                  <DebouncedInputV2
                    value={item.discount || ''}
                    onDebouncedChange={(v) => updateItem(index, 'discount', v)}
                    className="input-admin"
                    placeholder="Ex: 20% OFF"
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex items-center gap-2 h-10">
                    <Switch
                      checked={item.showStrikethrough || false}
                      onCheckedChange={(checked) => updateItem(index, 'showStrikethrough', checked)}
                    />
                    <Label className="text-foreground text-sm">Mostrar riscado</Label>
                  </div>
                </div>
              </div>

              {/* CTA Text, Texto de Suporte e Link */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-foreground font-semibold mb-2 block">Texto do Botão</Label>
                  <DebouncedInputV2
                    value={item.ctaText || ''}
                    onDebouncedChange={(v) => updateItem(index, 'ctaText', v)}
                    className="input-admin"
                    placeholder="Ex: Comprar"
                  />
                </div>
                <div>
                  <Label className="text-foreground font-semibold mb-2 block">Texto de Suporte</Label>
                  <DebouncedInputV2
                    value={item.supportText || ''}
                    onDebouncedChange={(v) => updateItem(index, 'supportText', v)}
                    className="input-admin"
                    placeholder="Ex: Sem fidelidade"
                  />
                </div>
                <div>
                  <Label className="text-foreground font-semibold mb-2 block">Link do Botão</Label>
                  <DebouncedInputV2
                    value={item.link || ''}
                    onDebouncedChange={(v) => updateItem(index, 'link', v)}
                    className="input-admin"
                    placeholder="Ex: /checkout?plan=mensal"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground font-semibold">
                    Características ({item.features?.length || 0})
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addFeature(index)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                {(item.features || []).map((feature, fIndex) => (
                  <div key={fIndex} className="flex gap-2">
                    <DebouncedInputV2
                      value={feature}
                      onDebouncedChange={(v) => updateFeature(index, fIndex, v)}
                      className="input-admin flex-1"
                      placeholder="Ex: Lavagem completa"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index, fIndex)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <SectionCTAEditorV2
        sectionTitle="Produtos"
        ctaData={plans?.footerCta}
        onUpdate={(updates) => {
          updateSection('plans', {
            ...plans,
            footerCta: {
              ...(plans?.footerCta || { enabled: false, text: '', link: '', mobileHidden: false }),
              ...updates,
            },
          });
        }}
      />
    </div>
  );
});

PlansEditorV2.displayName = 'PlansEditorV2';
