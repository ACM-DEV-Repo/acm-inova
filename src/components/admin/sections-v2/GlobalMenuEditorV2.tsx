import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Menu } from 'lucide-react';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { ImageUploadV2 } from '@/components/admin/shared-v2/ImageUploadV2';
import { V2SectionEditorProps } from './types';
import type { GlobalMenuSettings } from '@/lib/cms-v2/cms-types';

const DEFAULT_MENU: GlobalMenuSettings = {
  enabled: false,
  logoUrl: '',
  links: [],
};

export const GlobalMenuEditorV2 = memo(({ draft, updateSection }: V2SectionEditorProps) => {
  const menu = draft.globalMenu || DEFAULT_MENU;

  const updateMenu = (field: string, value: unknown) => {
    updateSection('globalMenu', { ...menu, [field]: value });
  };

  const addLink = () => {
    updateMenu('links', [...(menu.links || []), { text: '', url: '' }]);
  };

  const removeLink = (index: number) => {
    updateMenu('links', (menu.links || []).filter((_: unknown, i: number) => i !== index));
  };

  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...(menu.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateMenu('links', newLinks);
  };

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      {/* Header com toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Menu className="h-5 w-5" />
          Menu Global
        </h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="globalMenu-enabled" className="text-sm font-normal">Ativado</Label>
          <Switch
            id="globalMenu-enabled"
            checked={menu.enabled}
            onCheckedChange={(v) => updateMenu('enabled', v)}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Header fixo translúcido com logo e links de navegação. Aparece no topo da LP.
      </p>

      {menu.enabled && (
        <div className="space-y-6 pt-2">
          {/* Logo */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">Logo do Menu</Label>
            <p className="text-xs text-muted-foreground">
              Se vazio, usa o logo do Footer automaticamente.
            </p>
            <ImageUploadV2
              label="Logo"
              recommendedSize="200 x 40"
              value={menu.logoUrl || ''}
              onChange={(url) => updateMenu('logoUrl', url)}
            />
          </div>

          {/* Links */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">
              Links de Navegação ({(menu.links || []).length})
            </Label>
            <p className="text-xs text-muted-foreground">
              Visiveis apenas em desktop. Use anchors como #plans, #faq, etc.
            </p>

            {(menu.links || []).map((link, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                <div className="space-y-1">
                  {index === 0 && <Label className="text-foreground text-xs">Texto</Label>}
                  <DebouncedInputV2
                    value={link.text}
                    onDebouncedChange={(v) => updateLink(index, 'text', v)}
                    placeholder="Ex: Planos"
                    className="input-admin text-sm"
                  />
                </div>
                <div className="space-y-1">
                  {index === 0 && <Label className="text-foreground text-xs">Link</Label>}
                  <DebouncedInputV2
                    value={link.url}
                    onDebouncedChange={(v) => updateLink(index, 'url', v)}
                    placeholder="Ex: #plans"
                    className="input-admin text-sm font-mono"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(index)}
                  className="h-9 w-9 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLink}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Adicionar link
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

GlobalMenuEditorV2.displayName = 'GlobalMenuEditorV2';
