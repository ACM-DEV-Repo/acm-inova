import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAdminEditorV2Production } from '@/hooks/cms/useAdminEditorV2Production';
import { fetchLPByRef, updateLPStatus } from '@/lib/cms-v2/cms-api';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Save,
  Eye,
  RefreshCw,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ChevronRight,
  ListOrdered,
  MessageSquare,
  Palette,
  Search,
  Target,
  Zap,
  Sparkles,
  Award,
  Compass,
  CreditCard,
  MessageCircle,
  BarChart3,
  Info,
  Mail,
  ImageIcon,
  Route,
  ShoppingBag,
  Video,
  PlayCircle,
  CheckCircle2,
  Megaphone,
  HelpCircle,
  ClipboardList,
  Users,
  LayoutGrid,
  History,
  Menu,
  Mic2,
  Trophy,
  CalendarDays,
  Rocket,
} from 'lucide-react';
import type { LPStatus } from '@/lib/cms-v2/cms-types';
import { toast } from 'sonner';
import { SaveStatusHUDV2 } from '@/components/admin/shared-v2/SaveStatusHUDV2';
import type { LucideIcon } from 'lucide-react';
import { CMSHistoryPanel } from '@/components/admin/CMSHistoryPanel';
import { PreviewDrawerV2 } from '@/components/admin/preview-v2/PreviewDrawerV2';

import {
  HeroEditorV2,
  BenefitsEditorV2,
  HowItWorksEditorV2,
  BeforeAfterEditorV2,
  ProcessEditorV2,
  ForWhomEditorV2,
  ServicesEditorV2,
  PlansEditorV2,
  VideoEditorV2,
  VideoCarouselEditorV2,
  WhyChooseEditorV2,
  TestimonialsEditorV2,
  AboutEditorV2,
  FAQEditorV2,
  CTAFinalEditorV2,
  ContactEditorV2,
  KPIsEditorV2,
  FooterEditorV2,
  FormEditorV2,
  TrackingEditorV2,
  SEOEditorV2,
  DesignEditorV2,
  SectionOrderEditorV2,
  FloatingWhatsappEditorV2,
  ConversionEditorV2,
  GlobalMenuEditorV2,
  SpeakersEditorV2,
  SponsorsEditorV2,
  ScheduleEditorV2,
} from '@/components/admin/sections-v2';

// ============================================================
// Definicao das secoes do sidebar interno
// ============================================================
interface SectionItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface SectionGroup {
  group: string;
  icon: LucideIcon;
  defaultOpen: boolean;
  items: SectionItem[];
}

const SECTIONS: SectionGroup[] = [
  {
    group: 'Configuracoes',
    icon: Palette,
    defaultOpen: true,
    items: [
      { key: 'sectionOrder', label: 'Ordem das Seções', icon: ListOrdered },
      { key: 'conversion', label: 'Conversão', icon: Zap },
      { key: 'globalMenu', label: 'Menu Global', icon: Menu },
      { key: 'floatingWhatsapp', label: 'CTAs Flutuantes', icon: MessageSquare },
      { key: 'design', label: 'Design', icon: Palette },
      { key: 'seo', label: 'SEO', icon: Search },
      { key: 'tracking', label: 'Rastreamento', icon: Target },
      { key: 'history', label: 'Histórico', icon: History },
    ],
  },
  {
    group: 'Secoes',
    icon: LayoutGrid,
    defaultOpen: true,
    items: [
      { key: 'hero', label: 'Destaque', icon: Sparkles },
      { key: 'benefits', label: 'Benefícios', icon: Award },
      { key: 'howItWorks', label: 'Como Funciona', icon: Compass },
      { key: 'plans', label: 'Produtos', icon: CreditCard },
      { key: 'testimonials', label: 'Depoimentos', icon: MessageCircle },
      { key: 'kpis', label: 'Números', icon: BarChart3 },
      { key: 'speakers', label: 'Palestrantes', icon: Mic2 },
      { key: 'sponsors', label: 'Patrocinadores', icon: Trophy },
      { key: 'about', label: 'Sobre', icon: Info },
      { key: 'contact', label: 'Contato', icon: Mail },
      { key: 'beforeAfter', label: 'Antes e Depois', icon: ImageIcon },
      { key: 'process', label: 'Processo', icon: Route },
      { key: 'services', label: 'Serviços', icon: ShoppingBag },
      { key: 'schedule', label: 'Programação', icon: CalendarDays },
      { key: 'video', label: 'Vídeo', icon: Video },
      { key: 'videoCarousel', label: 'Carrossel de Vídeos', icon: PlayCircle },
      { key: 'whyChoose', label: 'Por que Escolher', icon: CheckCircle2 },
      { key: 'ctaFinal', label: 'Chamada Final', icon: Megaphone },
      { key: 'faq', label: 'FAQ', icon: HelpCircle },
      { key: 'form', label: 'Formulário', icon: ClipboardList },
      { key: 'forWhom', label: 'Para Quem', icon: Users },
      { key: 'footer', label: 'Rodapé', icon: LayoutGrid },
    ],
  },
];

// ============================================================
// EDITOR V2 — Sidebar + Area principal
// ============================================================
export default function LPEditorV2() {
  const { lpKey } = useParams<{ lpKey: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [lpStatus, setLpStatus] = useState<LPStatus>('draft');

  useEffect(() => {
    if (lpKey) {
      fetchLPByRef(lpKey).then(lp => { if (lp) setLpStatus(lp.status); });
    }
  }, [lpKey]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    SECTIONS.forEach((g) => {
      initial[g.group] = g.defaultOpen;
    });
    return initial;
  });

  const {
    draft,
    isDirty,
    isLoading,
    saveStatus,
    lastSavedAt,
    updateField,
    updateNestedField,
    updateSection,
    saveNow,
  } = useAdminEditorV2Production(lpKey ?? '');

  if (!lpKey) {
    return <Navigate to="/admin/lps" replace />;
  }

  const handleManualSave = async () => {
    const success = await saveNow();
    if (success) {
      toast.success('Salvo com sucesso!');
    } else {
      toast.error('Erro ao salvar');
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground">LP nao encontrada: {lpKey}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  const editorProps = { draft, lpKey, updateField, updateNestedField, updateSection };

  const renderEditor = () => {
    switch (activeSection) {
      case 'hero': return <HeroEditorV2 {...editorProps} />;
      case 'benefits': return <BenefitsEditorV2 {...editorProps} />;
      case 'howItWorks': return <HowItWorksEditorV2 {...editorProps} />;
      case 'beforeAfter': return <BeforeAfterEditorV2 {...editorProps} />;
      case 'process': return <ProcessEditorV2 {...editorProps} />;
      case 'forWhom': return <ForWhomEditorV2 {...editorProps} />;
      case 'services': return <ServicesEditorV2 {...editorProps} />;
      case 'plans': return <PlansEditorV2 {...editorProps} />;
      case 'video': return <VideoEditorV2 {...editorProps} />;
      case 'videoCarousel': return <VideoCarouselEditorV2 {...editorProps} />;
      case 'whyChoose': return <WhyChooseEditorV2 {...editorProps} />;
      case 'testimonials': return <TestimonialsEditorV2 {...editorProps} />;
      case 'about': return <AboutEditorV2 {...editorProps} />;
      case 'faq': return <FAQEditorV2 {...editorProps} />;
      case 'ctaFinal': return <CTAFinalEditorV2 {...editorProps} />;
      case 'contact': return <ContactEditorV2 {...editorProps} />;
      case 'kpis': return <KPIsEditorV2 {...editorProps} />;
      case 'footer': return <FooterEditorV2 {...editorProps} />;
      case 'form': return <FormEditorV2 {...editorProps} />;
      case 'speakers': return <SpeakersEditorV2 {...editorProps} />;
      case 'sponsors': return <SponsorsEditorV2 {...editorProps} />;
      case 'schedule': return <ScheduleEditorV2 {...editorProps} />;
      case 'tracking': return <TrackingEditorV2 {...editorProps} />;
      case 'seo': return <SEOEditorV2 {...editorProps} />;
      case 'design': return <DesignEditorV2 {...editorProps} />;
      case 'sectionOrder': return <SectionOrderEditorV2 {...editorProps} />;
      case 'conversion': return <ConversionEditorV2 {...editorProps} />;
      case 'globalMenu': return <GlobalMenuEditorV2 {...editorProps} />;
      case 'floatingWhatsapp': return <FloatingWhatsappEditorV2 {...editorProps} />;
      case 'history': return (
        <CMSHistoryPanel
          tableName="bd_cms_lp_v2"
          recordKey={lpKey}
          title="Historico de Versoes"
          description="Todas as alteracoes salvas desta LP"
        />
      );
      default: return <HeroEditorV2 {...editorProps} />;
    }
  };

  return (
    <div className="flex gap-0 min-h-screen">
      {/* ========== Sidebar interno — Apple glass ========== */}
      <aside className="w-64 shrink-0 admin-glass-sidebar sticky top-0 self-start max-h-screen overflow-y-auto">
        <div className="p-4 border-b border-black/[0.06]">
          <button
            onClick={() => navigate('/admin/lps')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group w-full"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Voltar ao Dashboard</span>
          </button>
          <div className="mt-3">
            <h2 className="text-sm font-bold text-foreground truncate">{lpKey}</h2>
            <SaveStatusHUDV2
              status={saveStatus}
              lastSaved={lastSavedAt}
            />
          </div>
        </div>

        <div className="p-3 space-y-1">
          {SECTIONS.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroups[group.group] ?? true;
            const hasActiveItem = group.items.some((item) => item.key === activeSection);

            return (
              <Collapsible
                key={group.group}
                open={isOpen}
                onOpenChange={() => toggleGroup(group.group)}
              >
                <CollapsibleTrigger asChild>
                  <button
                    className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      hasActiveItem && !isOpen
                        ? 'bg-primary/8 text-primary shadow-sm shadow-primary/5'
                        : 'text-foreground/70 hover:bg-black/[0.03] hover:text-foreground'
                    }`}
                  >
                    <GroupIcon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{group.group}</span>
                    <ChevronRight
                      className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <nav className="mt-1 ml-2 space-y-0.5 border-l border-black/[0.06] pl-2">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = activeSection === item.key;

                      return (
                        <button
                          key={item.key}
                          onClick={() => setActiveSection(item.key)}
                          className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[13px] transition-all duration-200 ${
                            isActive
                              ? 'bg-primary/8 text-primary font-semibold shadow-sm shadow-primary/5 border border-primary/10'
                              : 'text-foreground/60 hover:bg-black/[0.03] hover:text-foreground'
                          }`}
                        >
                          <ItemIcon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </aside>

      {/* ========== Area principal ========== */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between sticky top-0 z-10 admin-glass-toolbar py-3 px-6">
          <h1 className="text-lg font-bold text-foreground">
            {SECTIONS.flatMap((g) => g.items).find((i) => i.key === activeSection)?.label ?? 'Editor'}
          </h1>

          <div className="flex items-center gap-3">
            {lpStatus === 'draft' && (
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                onClick={async () => {
                  if (isDirty) { toast.error('Salve as alteracoes antes de publicar'); return; }
                  const ok = await updateLPStatus(lpKey, 'active');
                  if (ok) { setLpStatus('active'); toast.success('LP publicada!'); }
                  else toast.error('Erro ao publicar');
                }}
              >
                <Rocket className="h-4 w-4" />
                Publicar
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={handleManualSave}
              disabled={!isDirty || saveStatus === 'saving'}
              className={isDirty ? 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-md shadow-accent/25' : ''}
            >
              {saveStatus === 'saving' ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              {saveStatus === 'saving' ? 'Salvando...' : isDirty ? 'Salvar (⌘S)' : 'Salvar'}
            </Button>
          </div>
        </div>

        <div className="p-6">
          {renderEditor()}
        </div>
      </div>

      <PreviewDrawerV2
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        slug={lpKey}
      />
    </div>
  );
}
