import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ImageUploadV2 } from "@/components/admin/shared-v2/ImageUploadV2";
import { DebouncedInputV2 } from "@/components/admin/shared-v2/DebouncedInputV2";
import { V2SectionEditorProps } from "./types";

export const FooterEditorV2 = memo(({ draft, updateField, updateNestedField, updateSection }: V2SectionEditorProps) => {
  const footer = draft.footer;

  const privacy = footer?.privacy || { text: 'Política de Privacidade', url: '', hasLink: false, enabled: true };
  const terms = footer?.terms || { text: 'Termos de Uso', url: '', hasLink: false, enabled: true };
  const cnpj = footer?.cnpj || { text: '', enabled: true };
  const socials = footer?.socials || {
    instagram: { url: '', enabled: false },
    facebook: { url: '', enabled: false },
    linkedin: { url: '', enabled: false },
    youtube: { url: '', enabled: false },
    tiktok: { url: '', enabled: false },
  };

  const socialLabels = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    tiktok: 'TikTok',
  };

  return (
    <div className="glass-primitive rounded-3xl p-10 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Rodape <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md ml-2">#footer</span></h2>
        <div className="flex items-center space-x-2">
          <Switch
            checked={footer?.enabled !== false}
            onCheckedChange={(checked) => updateField('footer', 'enabled', checked)}
          />
          <Label className="text-foreground text-sm font-semibold">Ativar seção</Label>
        </div>
      </div>

      {/* Logo */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Logo</Label>
        <div className="flex flex-wrap gap-6">
          <ImageUploadV2
            label="Logo (original)"
            value={footer?.logo}
            onChange={(url) => updateField('footer', 'logo', url)}
          />
          <ImageUploadV2
            label="Logo Desktop"
            value={footer?.logoDesktop}
            onChange={(url) => updateField('footer', 'logoDesktop', url)}
          />
          <ImageUploadV2
            label="Logo Mobile"
            value={footer?.logoMobile}
            onChange={(url) => updateField('footer', 'logoMobile', url)}
          />
        </div>
      </div>

      {/* Links de Navegação */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Links de Navegação</Label>
        {footer?.links?.map((link, index) => (
          <div key={index} className="flex items-center gap-3">
            <Switch
              checked={link.enabled !== false}
              onCheckedChange={(checked) => {
                const newLinks = [...(footer.links || [])];
                newLinks[index] = { ...newLinks[index], enabled: checked };
                updateField('footer', 'links', newLinks);
              }}
            />
            <DebouncedInputV2
              placeholder="Texto"
              value={link.text || ''}
              onDebouncedChange={(v) => {
                const newLinks = [...(footer.links || [])];
                newLinks[index] = { ...newLinks[index], text: v };
                updateField('footer', 'links', newLinks);
              }}
              className="input-admin flex-1"
            />
            <DebouncedInputV2
              placeholder="URL (ex: #planos)"
              value={link.url || ''}
              onDebouncedChange={(v) => {
                const newLinks = [...(footer.links || [])];
                newLinks[index] = { ...newLinks[index], url: v };
                updateField('footer', 'links', newLinks);
              }}
              className="input-admin flex-1"
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newLinks = [...(footer?.links || []), { text: '', url: '', enabled: true }];
            updateField('footer', 'links', newLinks);
          }}
          className="text-foreground border-border hover:bg-accent/10 rounded-full"
        >
          + Adicionar Link
        </Button>
      </div>

      {/* CNPJ */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold text-lg">CNPJ</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={cnpj.enabled !== false}
              onCheckedChange={(checked) => updateNestedField('footer.cnpj', { ...cnpj, enabled: checked })}
            />
            <Label className="text-foreground text-sm">Exibir</Label>
          </div>
        </div>
        <DebouncedInputV2
          placeholder="Ex: CNPJ: 00.000.000/0000-00"
          value={cnpj.text}
          onDebouncedChange={(v) => updateNestedField('footer.cnpj', { ...cnpj, text: v })}
          className="input-admin"
        />
      </div>

      {/* Política de Privacidade */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold text-lg">Política de Privacidade</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={privacy.enabled !== false}
              onCheckedChange={(checked) => updateNestedField('footer.privacy', { ...privacy, enabled: checked })}
            />
            <Label className="text-foreground text-sm">Exibir</Label>
          </div>
        </div>
        <DebouncedInputV2
          placeholder="Texto (ex: Política de Privacidade)"
          value={privacy.text}
          onDebouncedChange={(v) => updateNestedField('footer.privacy', { ...privacy, text: v })}
          className="input-admin"
        />
        <div className="flex items-center gap-3">
          <Switch
            checked={privacy.hasLink}
            onCheckedChange={(checked) => updateNestedField('footer.privacy', { ...privacy, hasLink: checked })}
          />
          <Label className="text-foreground text-sm">É um link clicável?</Label>
        </div>
        {privacy.hasLink && (
          <DebouncedInputV2
            placeholder="URL do link (ex: https://exemplo.com/privacidade)"
            value={privacy.url}
            onDebouncedChange={(v) => updateNestedField('footer.privacy', { ...privacy, url: v })}
            className="input-admin"
          />
        )}
      </div>

      {/* Termos de Uso */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-foreground font-semibold text-lg">Termos de Uso</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={terms.enabled !== false}
              onCheckedChange={(checked) => updateNestedField('footer.terms', { ...terms, enabled: checked })}
            />
            <Label className="text-foreground text-sm">Exibir</Label>
          </div>
        </div>
        <DebouncedInputV2
          placeholder="Texto (ex: Termos de Uso)"
          value={terms.text}
          onDebouncedChange={(v) => updateNestedField('footer.terms', { ...terms, text: v })}
          className="input-admin"
        />
        <div className="flex items-center gap-3">
          <Switch
            checked={terms.hasLink}
            onCheckedChange={(checked) => updateNestedField('footer.terms', { ...terms, hasLink: checked })}
          />
          <Label className="text-foreground text-sm">É um link clicável?</Label>
        </div>
        {terms.hasLink && (
          <DebouncedInputV2
            placeholder="URL do link (ex: https://exemplo.com/termos)"
            value={terms.url}
            onDebouncedChange={(v) => updateNestedField('footer.terms', { ...terms, url: v })}
            className="input-admin"
          />
        )}
      </div>

      {/* Redes Sociais */}
      <div className="bg-muted/20 rounded-2xl p-6 space-y-4">
        <Label className="text-foreground font-semibold text-lg">Redes Sociais</Label>
        {(Object.keys(socialLabels) as Array<keyof typeof socialLabels>).map((key) => (
          <div key={key} className="flex items-center gap-3">
            <Switch
              checked={socials[key]?.enabled || false}
              onCheckedChange={(checked) => {
                updateNestedField(`footer.socials.${key}`, { ...socials[key], enabled: checked });
              }}
            />
            <Label className="text-foreground text-sm w-24">{socialLabels[key]}</Label>
            <DebouncedInputV2
              placeholder={`URL do ${socialLabels[key]}`}
              value={socials[key]?.url || ''}
              onDebouncedChange={(v) => {
                updateNestedField(`footer.socials.${key}`, { ...socials[key], url: v });
              }}
              className="input-admin flex-1"
              disabled={!socials[key]?.enabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

FooterEditorV2.displayName = 'FooterEditorV2';
