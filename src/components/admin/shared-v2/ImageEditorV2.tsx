import { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Check, RotateCcw, Sun, Contrast, Droplets, CircleDot, Eraser, Wand2, Save, FilePlus } from 'lucide-react';
import { uploadAndRegister, type MediaItem } from '@/lib/cms-v2/media-api';
import { toast } from 'sonner';
import * as Sentry from '@sentry/react';

interface ImageEditorV2Props {
  items: MediaItem[];
  onSaved: (url: string) => void;
  onRefresh: () => void;
}

type Stage = 'pick' | 'editing';

interface Filters {
  brightness: number;
  contrast: number;
  saturate: number;
  shadow: number;
  blur: number;
}

const DEFAULT_FILTERS: Filters = { brightness: 100, contrast: 100, saturate: 100, shadow: 0, blur: 0 };

const AI_PRESETS = [
  { label: 'Headshot Profissional', prompt: 'Transform this photo into a professional corporate headshot. Clean background, good lighting, professional look. Keep the person exactly the same.' },
  { label: 'Fundo Gradiente', prompt: 'Replace the background with a clean professional dark blue gradient. Keep the person exactly as they are, only change the background.' },
  { label: 'Melhorar Iluminação', prompt: 'Enhance the lighting of this photo. Make it brighter, clearer, with better contrast. Professional photography quality. Keep everything else the same.' },
  { label: 'Fundo Consultório', prompt: 'Replace the background with a modern medical office/clinic background, clean and professional. Keep the person exactly the same.' },
];

export const ImageEditorV2 = ({ items, onSaved, onRefresh }: ImageEditorV2Props) => {
  const [stage, setStage] = useState<Stage>('pick');
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [originalItem, setOriginalItem] = useState<MediaItem | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [saving, setSaving] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);
  const [bgProgress, setBgProgress] = useState(0);
  const [aiProcessing, setAiProcessing] = useState(false);

  // Cleanup blob URLs on change and unmount
  useEffect(() => {
    return () => { if (sourceUrl?.startsWith('blob:')) URL.revokeObjectURL(sourceUrl); };
  }, [sourceUrl]);

  const selectImage = (item: MediaItem) => {
    if (sourceUrl?.startsWith('blob:')) URL.revokeObjectURL(sourceUrl);
    setSourceUrl(item.public_url);
    setOriginalItem(item);
    setFilters(DEFAULT_FILTERS);
    setStage('editing');
  };

  const selectFile = (file: File) => {
    if (sourceUrl?.startsWith('blob:')) URL.revokeObjectURL(sourceUrl);
    setSourceUrl(URL.createObjectURL(file));
    setOriginalItem(null);
    setFilters(DEFAULT_FILTERS);
    setStage('editing');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) selectFile(file);
  };

  const filterString = useMemo(() =>
    `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px) drop-shadow(0 0 ${filters.shadow}px rgba(0,0,0,0.5))`,
    [filters]);
  const hasChanges = useMemo(() =>
    JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS),
    [filters]);

  // ---- Export with filters applied ----
  const exportImage = useCallback(async (): Promise<Blob | null> => {
    if (!sourceUrl) return null;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sourceUrl;
    await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.filter = filterString;
    ctx.drawImage(img, 0, 0);
    return new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png', 1));
  }, [sourceUrl, filterString]);

  // ---- Save as new ----
  const handleSaveNew = async () => {
    setSaving(true);
    try {
      const blob = hasChanges ? await exportImage() : await fetch(sourceUrl!).then(r => r.blob());
      if (!blob) { toast.error('Erro ao processar'); setSaving(false); return; }
      const file = new File([blob], `editado-${Date.now()}.png`, { type: 'image/png' });
      const item = await uploadAndRegister(file);
      if (item) {
        toast.success('Nova imagem salva na biblioteca');
        onRefresh();
        onSaved(item.public_url);
      }
    } catch (err) { Sentry.captureException(err); toast.error('Erro ao salvar'); }
    setSaving(false);
  };

  // ---- Overwrite original ----
  const handleOverwrite = async () => {
    if (!originalItem) { handleSaveNew(); return; }
    setSaving(true);
    try {
      const blob = hasChanges ? await exportImage() : await fetch(sourceUrl!).then(r => r.blob());
      if (!blob) { toast.error('Erro ao processar'); setSaving(false); return; }
      const file = new File([blob], originalItem.file_name, { type: 'image/png' });
      const item = await uploadAndRegister(file);
      if (item) {
        toast.success('Imagem substituída');
        onRefresh();
        onSaved(item.public_url);
      }
    } catch (err) { Sentry.captureException(err); toast.error('Erro ao salvar'); }
    setSaving(false);
  };

  // ---- Remove background ----
  const handleRemoveBg = async () => {
    if (!sourceUrl) return;
    setRemovingBg(true);
    setBgProgress(0);
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const res = await fetch(sourceUrl);
      const input = await res.blob();
      const blob = await removeBackground(input, {
        model: 'medium',
        progress: (_key: string, current: number, total: number) => {
          if (total > 0) setBgProgress(Math.round((current / total) * 100));
        },
      });
      const resultUrl = URL.createObjectURL(blob);
      setSourceUrl(resultUrl);
      toast.success('Fundo removido');
    } catch (err) {
      Sentry.captureException(err);
      toast.error('Erro ao remover fundo');
    }
    setRemovingBg(false);
  };

  // ---- AI edit ----
  const handleAI = async (prompt: string) => {
    toast.info('IA será configurada na próxima sessão');
  };

  const SliderRow = ({ label, icon: Icon, value, min, max, step, onChange }: {
    label: string; icon: typeof Sun; value: number; min: number; max: number; step?: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="text-[11px] text-muted-foreground w-16 shrink-0">{label}</span>
      <input type="range" min={min} max={max} step={step || 1} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 accent-primary" />
      <span className="text-[11px] text-muted-foreground w-10 text-right tabular-nums">
        {value}{label === 'Desfoque' || label === 'Sombra' ? 'px' : '%'}
      </span>
    </div>
  );

  // ---- Pick state ----
  if (stage === 'pick') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Selecione uma imagem para editar</p>
          <label>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
            <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer" asChild>
              <span><Upload className="h-4 w-4" />Upload</span>
            </Button>
          </label>
        </div>
        <div className="overflow-y-auto max-h-[400px]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Eraser className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">Nenhuma imagem</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {items.map((item) => (
                <button key={item.id} onClick={() => selectImage(item)}
                  className="rounded-lg overflow-hidden border-2 border-gray-200 hover:border-accent transition-all p-2 min-h-[80px] flex flex-col items-center justify-center bg-white group">
                  <img src={item.public_url} alt={item.file_name} className="max-h-[55px] w-auto max-w-full object-contain" loading="lazy" />
                  <span className="text-[8px] text-gray-400 mt-1 text-center line-clamp-1 leading-tight">{item.file_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- Editing state ----
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_240px] gap-4 min-h-[350px]">
        {/* Preview */}
        <div className="relative border border-border/40 rounded-xl overflow-hidden flex items-center justify-center"
          style={{ background: 'repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% / 14px 14px' }}>
          {sourceUrl && (
            <img src={sourceUrl} alt="Preview" className="max-h-[340px] max-w-full object-contain"
              style={{ filter: filterString }} crossOrigin="anonymous" />
          )}
          {(removingBg || aiProcessing) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
              <div className="flex flex-col items-center gap-2 text-white">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm font-medium">{removingBg ? 'Removendo fundo...' : 'IA processando...'}</span>
                {removingBg && bgProgress > 0 && (
                  <div className="w-32">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full transition-all" style={{ width: `${bgProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls panel */}
        <div className="overflow-y-auto space-y-4 pr-1">
          {/* Remove background */}
          <div>
            <Button variant="outline" size="sm" className="w-full gap-2 text-xs h-8" onClick={handleRemoveBg}
              disabled={removingBg || !sourceUrl}>
              <Eraser className="h-3.5 w-3.5" />
              {removingBg ? 'Removendo...' : 'Remover Fundo'}
            </Button>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ajustes</p>
            <SliderRow label="Brilho" icon={Sun} value={filters.brightness} min={30} max={200} onChange={(v) => setFilters(f => ({ ...f, brightness: v }))} />
            <SliderRow label="Contraste" icon={Contrast} value={filters.contrast} min={30} max={200} onChange={(v) => setFilters(f => ({ ...f, contrast: v }))} />
            <SliderRow label="Saturação" icon={Droplets} value={filters.saturate} min={0} max={200} onChange={(v) => setFilters(f => ({ ...f, saturate: v }))} />
            <SliderRow label="Sombra" icon={CircleDot} value={filters.shadow} min={0} max={20} onChange={(v) => setFilters(f => ({ ...f, shadow: v }))} />
            <SliderRow label="Desfoque" icon={CircleDot} value={filters.blur} min={0} max={10} step={0.5} onChange={(v) => setFilters(f => ({ ...f, blur: v }))} />
            {hasChanges && (
              <button onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 mt-1">
                <RotateCcw className="h-3 w-3" /> Resetar
              </button>
            )}
          </div>

          {/* AI presets */}
          <div className="space-y-1.5 border-t border-border/30 pt-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Wand2 className="h-3 w-3" /> IA
            </p>
            {AI_PRESETS.map((preset, i) => (
              <Button key={i} variant="ghost" size="sm"
                className="w-full text-[11px] justify-start gap-1.5 h-6 px-2 text-muted-foreground hover:text-foreground"
                disabled={aiProcessing} onClick={() => handleAI(preset.prompt)}>
                <Wand2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{preset.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <Button variant="ghost" size="sm" onClick={() => { setStage('pick'); setSourceUrl(null); }} className="gap-1.5 text-xs">
          <RotateCcw className="h-3.5 w-3.5" /> Outra Imagem
        </Button>
        <div className="flex gap-2">
          {originalItem && (
            <Button variant="outline" size="sm" onClick={handleOverwrite} disabled={saving} className="gap-1.5 text-xs">
              <Save className="h-3.5 w-3.5" />
              Substituir Original
            </Button>
          )}
          <Button size="sm" onClick={handleSaveNew} disabled={saving} className="gap-1.5 text-xs">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FilePlus className="h-3.5 w-3.5" />}
            Salvar Nova
          </Button>
        </div>
      </div>
    </div>
  );
};
