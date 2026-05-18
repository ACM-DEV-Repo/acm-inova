import { memo, useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Activity, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DebouncedInputV2 } from '@/components/admin/shared-v2/DebouncedInputV2';
import { fetchGlobalTrackingV2, saveGlobalTrackingV2, fetchAllLPs } from '@/lib/cms-v2/cms-api';
import { TrackingSettings } from '@/lib/cms-v2/cms-types';
import {
  validatePixelId,
  getStatusDotColor,
  PIXEL_PLATFORMS,
  type PixelPlatform,
} from '@/lib/cms-v2/pixelValidation-v2';
import { toast } from 'sonner';

// ============================================================
// GlobalTrackingPanelV2 — Painel de pixels globais
// ============================================================

const DEFAULT_TRACKING: TrackingSettings = {
  enabled: true,
  meta: '',
  ga: '',
  gtm: '',
  tiktok: '',
  linkedin: '',
};

export const GlobalTrackingPanelV2 = memo(() => {
  const [tracking, setTracking] = useState<TrackingSettings>(DEFAULT_TRACKING);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lpsWithOverride, setLpsWithOverride] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Carrega dados iniciais
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const [globalData, allLps] = await Promise.all([
        fetchGlobalTrackingV2(),
        fetchAllLPs(),
      ]);

      if (globalData) {
        setTracking(globalData);
      }

      // Identifica LPs com tracking individual ativo
      const overrides = allLps
        .filter(lp => lp.lp_key !== 'global-v2')
        .filter(lp => {
          const t = lp.content?.tracking;
          if (!t || !t.enabled) return false;
          // Tem pelo menos 1 pixel preenchido E useGlobal não está ativo
          // (ou seja, está usando pixels próprios)
          const hasLocal = !!(t.meta?.trim() || t.ga?.trim() || t.gtm?.trim() || t.tiktok?.trim() || t.linkedin?.trim());
          return hasLocal;
        })
        .map(lp => lp.name || lp.lp_key);

      setLpsWithOverride(overrides);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleFieldChange = useCallback((platform: PixelPlatform, value: string) => {
    setTracking(prev => ({ ...prev, [platform]: value }));
    setIsDirty(true);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveGlobalTrackingV2(tracking);
    if (success) {
      toast.success('Pixels globais salvos!');
      setIsDirty(false);
    } else {
      toast.error('Erro ao salvar pixels globais');
    }
    setIsSaving(false);
  };

  const [open, setOpen] = useState(false);

  // Verifica se algum pixel global está configurado
  const hasAnyGlobal = PIXEL_PLATFORMS.some(p => tracking[p.key]?.trim());

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Carregando pixels globais...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 md:p-6">
      {/* Header — clicável pra expandir */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-foreground">Pixels Globais</h3>
            <p className="text-xs text-muted-foreground">
              {hasAnyGlobal ? 'Configurado' : 'Nenhum pixel configurado'} · Clique para {open ? 'fechar' : 'abrir'}
            </p>
          </div>
        </div>
        <svg className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {!open ? null : (<div className="space-y-5 mt-5">
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="gap-1.5"
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      {/* Banner de status */}
      {lpsWithOverride.length > 0 ? (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
          <p className="text-xs text-blue-600">
            <span className="font-medium">LPs com tracking individual:</span>{' '}
            {lpsWithOverride.join(', ')}
          </p>
        </div>
      ) : hasAnyGlobal ? (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <p className="text-xs text-green-600">Pixels globais ativos em todas as LPs</p>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <p className="text-xs text-amber-600">Nenhum pixel global configurado</p>
        </div>
      )}

      {/* Campos de pixel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PIXEL_PLATFORMS.map(({ key, label, placeholder }) => {
          const value = tracking[key] || '';
          const validation = validatePixelId(key, value);

          return (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs text-foreground">{label}</Label>
              <div className="flex items-center gap-2">
                <DebouncedInputV2
                  value={value}
                  onDebouncedChange={(v) => handleFieldChange(key, v)}
                  placeholder={placeholder}
                  className="input-admin font-mono flex-1 text-sm"
                />
                <div
                  className={`w-3 h-3 rounded-full shrink-0 ${getStatusDotColor(validation.status)}`}
                  title={validation.message}
                />
              </div>
              <p className={`text-[11px] ${
                validation.status === 'valid' ? 'text-green-600' :
                validation.status === 'warning' ? 'text-amber-600' :
                validation.status === 'error' ? 'text-red-600' :
                'text-muted-foreground/50'
              }`}>
                {validation.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
    )}
    </div>
  );
});

GlobalTrackingPanelV2.displayName = 'GlobalTrackingPanelV2';
