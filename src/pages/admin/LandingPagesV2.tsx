import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllLPs, createLP, deleteLP, duplicateLP, updateLPStatus, updateLPSettings } from '@/lib/cms-v2/cms-api';
import { getNewLPContent, getEventoMedicoContent } from '@/lib/cms-v2/lp-template';
import { LPRecord, LPStatus } from '@/lib/cms-v2/cms-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogClose, DialogDescription,
} from '@/components/ui/dialog';
import {
  Plus, Edit, Eye, Copy, FileText, Settings, LayoutTemplate,
  Check, Pencil, Trash2, Loader2, Home, Rocket,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { AdminPageContainer } from '@/components/admin/layout/AdminPageContainer';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { PreviewDrawerV2 } from '@/components/admin/preview-v2/PreviewDrawerV2';
import { GlobalTrackingPanelV2 } from '@/components/admin/sections-v2/GlobalTrackingPanelV2';
import { fetchHomepageConfig, setHomepage, type HomepageConfig } from '@/lib/homepage-api';
import { InlineSlugEditor } from '@/components/admin/shared-v2/InlineSlugEditor';
import { formatRelativeDate } from '@/lib/dateUtils';
import { toast } from 'sonner';

// ============================================================
// Status config
// ============================================================
const statusColors: Record<LPStatus, string> = {
  active: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 shadow-sm shadow-emerald-500/5',
  draft: 'bg-amber-500/10 text-amber-700 border-amber-500/20 shadow-sm shadow-amber-500/5',
  archived: 'bg-black/[0.03] text-black/40 border-black/[0.06]',
};

const statusLabels: Record<LPStatus, string> = {
  active: 'Ativo',
  draft: 'Rascunho',
  archived: 'Arquivado',
};

// ============================================================
// Main Component
// ============================================================
export default function LandingPagesV2() {
  const [lps, setLps] = useState<LPRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newLp, setNewLp] = useState({ name: '', slug: '', lp_key: '' });
  const [selectedTemplate, setSelectedTemplate] = useState<'generico' | 'evento'>('generico');
  const [publishConfirmLp, setPublishConfirmLp] = useState<LPRecord | null>(null);

  /** Auto-gera slug e lp_key a partir do nome */
  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    setNewLp({ name, slug, lp_key: slug });
  };
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [duplicateSource, setDuplicateSource] = useState<LPRecord | null>(null);
  const [duplicateData, setDuplicateData] = useState({ name: '', slug: '', lp_key: '' });
  const [isDuplicating, setIsDuplicating] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<LPRecord | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [editLp, setEditLp] = useState<{ lp_key: string; name: string; slug: string } | null>(null);
  const [isEditingSetting, setIsEditingSetting] = useState(false);

  const [previewLp, setPreviewLp] = useState<LPRecord | null>(null);

  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig | null>(null);
  const [isSettingHomepage, setIsSettingHomepage] = useState(false);

  const loadLPs = async () => {
    setIsLoading(true);
    const [data, hpConfig] = await Promise.all([
      fetchAllLPs(),
      fetchHomepageConfig(),
    ]);
    setLps(data);
    setHomepageConfig(hpConfig);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLPs();
  }, []);

  const filteredLps = lps.filter(lp => lp.lp_key !== 'global-v2');

  const handleCreate = async () => {
    if (!newLp.name || !newLp.slug || !newLp.lp_key) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsCreating(true);
    const content = selectedTemplate === 'evento' ? getEventoMedicoContent() : getNewLPContent();

    const success = await createLP({
      lp_key: newLp.lp_key,
      name: newLp.name,
      slug: newLp.slug,
      status: 'draft',
      content,
    });

    if (success) {
      toast.success('LP criada com sucesso!');
      setNewLp({ name: '', slug: '', lp_key: '' });
      setCreateDialogOpen(false);
      loadLPs();
    } else {
      toast.error('Erro ao criar LP');
    }
    setIsCreating(false);
  };

  const handleStatusChange = async (lpKey: string, newStatus: LPStatus) => {
    const success = await updateLPStatus(lpKey, newStatus);
    if (success) {
      toast.success(`Status alterado para ${statusLabels[newStatus]}`);
      loadLPs();
    } else {
      toast.error('Erro ao alterar status');
    }
  };

  const handleSlugSave = async (lpKey: string, newSlug: string) => {
    const lp = lps.find(l => l.lp_key === lpKey);
    if (!lp) return;
    const success = await updateLPSettings(lpKey, { name: lp.name, slug: newSlug });
    if (success) {
      toast.success('Slug atualizado!');
      loadLPs();
    } else {
      toast.error('Erro ao atualizar slug');
    }
  };

  const handleUpdateSettings = async () => {
    if (!editLp || !editLp.name || !editLp.slug) return;

    setIsEditingSetting(true);
    const success = await updateLPSettings(editLp.lp_key, {
      name: editLp.name,
      slug: editLp.slug
    });

    if (success) {
      toast.success('Configurações atualizadas!');
      setEditLp(null);
      loadLPs();
    } else {
      toast.error('Erro ao atualizar configurações');
    }
    setIsEditingSetting(false);
  };

  const handleDuplicate = async () => {
    if (!duplicateSource || !duplicateData.name || !duplicateData.slug || !duplicateData.lp_key) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsDuplicating(true);
    const success = await duplicateLP(
      duplicateSource.lp_key,
      duplicateData.lp_key,
      duplicateData.name,
      duplicateData.slug
    );

    if (success) {
      toast.success(`LP duplicada com sucesso! Nova: ${duplicateData.lp_key}`);
      setDuplicateSource(null);
      setDuplicateData({ name: '', slug: '', lp_key: '' });
      loadLPs();
    } else {
      toast.error('Erro ao duplicar LP. Verifique se o lp_key/slug já existe.');
    }
    setIsDuplicating(false);
  };

  const handleSetHomepage = async (lpKey: string) => {
    setIsSettingHomepage(true);
    const success = await setHomepage(lpKey);
    if (success) {
      toast.success('Página principal atualizada!');
      const newConfig = await fetchHomepageConfig();
      setHomepageConfig(newConfig);
    } else {
      toast.error('Erro ao definir página principal.');
    }
    setIsSettingHomepage(false);
  };

  const isHomepage = (lp: LPRecord) =>
    homepageConfig?.version === 'v2' && homepageConfig?.lp_ref === lp.lp_key;

  const openDuplicateDialog = (lp: LPRecord) => {
    setDuplicateSource(lp);
    setDuplicateData({
      name: `${lp.name} (Copia)`,
      slug: `${lp.slug}-copy`,
      lp_key: `${lp.lp_key}-copy`,
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    if (isHomepage(deleteTarget)) {
      toast.error('Esta LP é a página principal. Defina outra LP como principal antes de excluir.');
      setIsDeleting(false);
      return;
    }

    setIsDeleting(true);
    const success = await deleteLP(deleteTarget.lp_key);

    if (success) {
      toast.success(`LP "${deleteTarget.name}" excluida com sucesso`);
      setDeleteTarget(null);
      setDeleteConfirmText('');
      loadLPs();
    } else {
      toast.error('Erro ao excluir LP');
    }
    setIsDeleting(false);
  };

  // ============================================================
  // Render
  // ============================================================
  return (
    <AdminPageContainer type="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <AdminPageHeader
          icon={LayoutTemplate}
          title="Landing Pages V2"
          description="Gerencie suas landing pages"
          actions={
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova LP
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    Criar Nova Landing Page
                  </DialogTitle>
                  <DialogDescription>
                    A LP será criada como rascunho com todas as seções prontas para editar.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Template selector */}
                  <div className="space-y-2">
                    <Label>Tipo de LP</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedTemplate('generico')}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          selectedTemplate === 'generico'
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-muted-foreground/30'
                        }`}
                      >
                        <FileText className="h-5 w-5 mb-2 text-primary" />
                        <span className="block text-sm font-semibold">Serviço / Produto</span>
                        <span className="block text-xs text-muted-foreground mt-1">Todas as seções disponíveis</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTemplate('evento')}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          selectedTemplate === 'evento'
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-muted-foreground/30'
                        }`}
                      >
                        <Rocket className="h-5 w-5 mb-2 text-primary" />
                        <span className="block text-sm font-semibold">Evento / Congresso</span>
                        <span className="block text-xs text-muted-foreground mt-1">Programação, palestrantes, inscrição</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da LP</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Summit Saude 2026"
                      value={newLp.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Endereço da página</Label>
                    <Input
                      id="slug"
                      placeholder="Gerado automaticamente"
                      value={newLp.slug}
                      onChange={(e) => setNewLp(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''), lp_key: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                    />
                    <p className="text-xs text-muted-foreground">URL: /l/{newLp.slug || 'slug'}</p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button onClick={handleCreate} disabled={isCreating}>
                    {isCreating ? 'Criando...' : 'Criar LP'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        {/* Global Tracking Panel */}
        <GlobalTrackingPanelV2 />

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredLps.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <LayoutTemplate className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Nenhuma landing page ainda</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Crie sua primeira landing page para começar. Ela virá com todas as seções prontas para editar.
                </p>
              </div>
              <Button className="gap-2 mt-2" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Criar primeira LP
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLps.map((lp) => (
              <Card key={lp.id} className="group hover:shadow-[0_8px_32px_hsl(220_20%_60%/0.12),inset_0_1px_0_hsl(0_0%_100%/0.9)] hover:border-black/[0.08] transition-all duration-300">
                <CardContent className="p-5 space-y-4">
                  {/* Top: Name + Status + Time */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-foreground truncate">{lp.name}</h3>
                      <span className="text-[11px] text-muted-foreground/60 font-mono">{lp.lp_key}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      {isHomepage(lp) && (
                        <Badge variant="outline" className="text-[11px] px-2 py-0.5 bg-emerald-500/10 text-emerald-700 border-emerald-500/20 shadow-sm shadow-emerald-500/5 gap-1">
                          <Home className="h-3 w-3" />
                          Principal
                        </Badge>
                      )}
                      <Badge variant="outline" className={`text-[11px] px-2 py-0.5 ${statusColors[lp.status]}`}>
                        {statusLabels[lp.status]}
                      </Badge>
                      {lp.updated_at && (
                        <span className="text-[10px] text-muted-foreground/50" title={new Date(lp.updated_at).toLocaleString('pt-BR')}>
                          {formatRelativeDate(lp.updated_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Slug + Link + Copy */}
                  <div className="bg-black/[0.02] rounded-xl px-3 py-2.5 border border-black/[0.04]">
                    <InlineSlugEditor
                      lp={lp}
                      onSave={(slug) => handleSlugSave(lp.lp_key, slug)}
                    />
                  </div>

                  {/* Publish button (when draft) — opens confirmation */}
                  {lp.status === 'draft' && (
                    <Button
                      size="sm"
                      className="w-full h-9 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => setPublishConfirmLp(lp)}
                    >
                      <Rocket className="h-3.5 w-3.5" />
                      Publicar
                    </Button>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => setPreviewLp(lp)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <Link to={`/admin/lps/${lp.lp_key}`}>
                        <Edit className="h-3.5 w-3.5" />
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => openDuplicateDialog(lp)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Duplicar
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0">
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditLp({ lp_key: lp.lp_key, name: lp.name, slug: lp.slug })}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Configurações
                        </DropdownMenuItem>
                        {!isHomepage(lp) && (
                          <DropdownMenuItem
                            onClick={() => handleSetHomepage(lp.lp_key)}
                            disabled={isSettingHomepage || lp.status !== 'active'}
                          >
                            <Home className="w-4 h-4 mr-2" />
                            Definir como Principal
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setPublishConfirmLp(lp)}>
                          <Check className="w-4 h-4 mr-2" />
                          Marcar Ativo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(lp.lp_key, 'draft')}>
                          Marcar Rascunho
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(lp.lp_key, 'archived')}>
                          Arquivar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(lp)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Settings Dialog */}
      <Dialog open={!!editLp} onOpenChange={(open) => !open && setEditLp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações da LP</DialogTitle>
          </DialogHeader>
          {editLp && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome da LP</Label>
                <Input
                  id="edit-name"
                  value={editLp.name}
                  onChange={(e) => setEditLp(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug (URL publicavel)</Label>
                <Input
                  id="edit-slug"
                  value={editLp.slug}
                  onChange={(e) => setEditLp(prev => prev ? ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }) : null)}
                />
                <p className="text-xs text-muted-foreground">URL: /l/{editLp.slug}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLp(null)}>Cancelar</Button>
            <Button onClick={handleUpdateSettings} disabled={isEditingSetting}>
              {isEditingSetting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Duplicação */}
      <Dialog open={!!duplicateSource} onOpenChange={(open) => { if (!open) setDuplicateSource(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicar Landing Page</DialogTitle>
            <DialogDescription>
              Todo o conteúdo de "{duplicateSource?.name}" será copiado para a nova LP.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Nova LP</Label>
              <Input
                value={duplicateData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                  setDuplicateData({ name, slug, lp_key: slug });
                }}
                placeholder="Ex: Summit Saude 2026 - Copia"
              />
            </div>
            <div className="space-y-2">
              <Label>Endereço da página</Label>
              <Input
                value={duplicateData.slug}
                onChange={(e) => {
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                  setDuplicateData(prev => ({ ...prev, slug, lp_key: slug }));
                }}
                placeholder="Gerado automaticamente"
              />
              <p className="text-xs text-muted-foreground">URL: /l/{duplicateData.slug || 'slug'}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDuplicateSource(null)}>Cancelar</Button>
            <Button onClick={handleDuplicate} disabled={isDuplicating}>
              {isDuplicating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Duplicando...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Exclusão */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteConfirmText(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Excluir Landing Page</DialogTitle>
            <DialogDescription>
              Esta ação é irreversível. Todos os dados da LP "{deleteTarget?.name}" ({deleteTarget?.lp_key}) serão permanentemente excluídos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Digite <span className="font-mono font-bold text-destructive">{deleteTarget?.lp_key}</span> para confirmar:
              </Label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={deleteTarget?.lp_key}
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteTarget(null); setDeleteConfirmText(''); }}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || deleteConfirmText !== deleteTarget?.lp_key}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Permanentemente
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Drawer */}
      <PreviewDrawerV2
        open={!!previewLp}
        onOpenChange={(open) => !open && setPreviewLp(null)}
        slug={previewLp?.slug ?? ''}
        lpName={previewLp?.name}
      />

      {/* Publish Confirmation Dialog */}
      <Dialog open={!!publishConfirmLp} onOpenChange={(open) => !open && setPublishConfirmLp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-emerald-600" />
              Publicar "{publishConfirmLp?.name}"?
            </DialogTitle>
            <DialogDescription>
              A LP ficará acessível publicamente em /l/{publishConfirmLp?.slug}
            </DialogDescription>
          </DialogHeader>
          {(() => {
            const ct = publishConfirmLp?.content;
            if (!ct) {
              return (
                <p className="text-sm text-amber-600 py-2">
                  Não foi possível verificar o conteúdo. Confirma que deseja publicar?
                </p>
              );
            }
            const checks = [
              { label: 'Título do hero', ok: !!ct.hero?.title?.trim() },
              { label: 'Imagem do hero', ok: !!ct.hero?.imageDesktop?.trim() },
              { label: 'CTA com link', ok: !!ct.hero?.ctaPrimary?.link?.trim() && ct.hero.ctaPrimary.link !== '#' },
              { label: 'SEO título', ok: !!ct.seo?.metaTitle?.trim() },
            ];
            const allOk = checks.every(ch => ch.ok);
            return (
              <div className="space-y-3 py-2">
                {checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${check.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className={check.ok ? 'text-foreground' : 'text-amber-600'}>{check.label}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{check.ok ? 'OK' : 'Faltando'}</span>
                  </div>
                ))}
                {!allOk && (
                  <p className="text-xs text-amber-600 mt-2">
                    Itens faltando podem afetar a experiência do visitante.
                  </p>
                )}
              </div>
            );
          })()}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={async () => {
                if (publishConfirmLp) {
                  await handleStatusChange(publishConfirmLp.lp_key, 'active');
                  setPublishConfirmLp(null);
                }
              }}
            >
              Publicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageContainer>
  );
}
