import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Check, RotateCcw, Sparkles, Film, Briefcase } from 'lucide-react';
import { uploadAndRegister, type MediaItem } from '@/lib/cms-v2/media-api';
import { PORTRAIT_PRESETS } from '@/lib/cms-v2/speaker-prompts';
import { toast } from 'sonner';
import * as Sentry from '@sentry/react';

interface SpeakerPortraitV2Props {
  items: MediaItem[];
  onSaved: (url: string) => void;
  onRefresh: () => void;
}

type Stage = 'pick' | 'generating' | 'done';

const PRESET_ICONS = { professional: Briefcase, cinematic: Film } as const;

export const SpeakerPortraitV2 = ({ items, onSaved, onRefresh }: SpeakerPortraitV2Props) => {
  const [stage, setStage] = useState<Stage>('pick');
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalItem, setOriginalItem] = useState<MediaItem | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (resultUrl?.startsWith('blob:')) URL.revokeObjectURL(resultUrl);
      if (originalUrl?.startsWith('blob:')) URL.revokeObjectURL(originalUrl);
    };
  }, [resultUrl, originalUrl]);

  const selectImage = (item: MediaItem) => {
    if (originalUrl?.startsWith('blob:')) URL.revokeObjectURL(originalUrl);
    setOriginalUrl(item.public_url);
    setOriginalItem(item);
    setResultUrl(null);
    setActivePreset(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (originalUrl?.startsWith('blob:')) URL.revokeObjectURL(originalUrl);
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      setOriginalItem(null);
      setResultUrl(null);
      setActivePreset(null);
    }
  };

  const generate = async (presetKey: string) => {
    if (!originalUrl) return;

    // SEMPRE usa a foto ORIGINAL, nunca o resultado anterior
    const sourceUrl = originalItem?.public_url || originalUrl;

    setStage('generating');
    setActivePreset(presetKey);
    if (resultUrl?.startsWith('blob:')) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    try {
      const preset = PORTRAIT_PRESETS.find(p => p.key === presetKey);
      if (!preset) throw new Error('Preset not found');

      // Fetch original image as base64
      const res = await fetch(sourceUrl);
      const blob = await res.blob();
      const b64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(blob);
      });

      // Call edge function (key stays server-side)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

      const apiRes = await fetch(`${supabaseUrl}/functions/v1/generate-portrait`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnon}`,
        },
        body: JSON.stringify({
          image: b64,
          mimeType: blob.type || 'image/png',
          preset: presetKey,
        }),
      });

      if (!apiRes.ok) {
        const errData = await apiRes.json().catch(() => ({}));
        throw new Error(errData.error || `Edge function error: ${apiRes.status}`);
      }

      const data = await apiRes.json();
      if (!data.image) throw new Error('No image in response');

      const imgBytes = atob(data.image);
      const arr = new Uint8Array(imgBytes.length);
      for (let i = 0; i < imgBytes.length; i++) arr[i] = imgBytes.charCodeAt(i);
      const resultBlob = new Blob([arr], { type: data.mimeType || 'image/png' });
      setResultUrl(URL.createObjectURL(resultBlob));
      setStage('done');
    } catch (err) {
      Sentry.captureException(err);
      toast.error('Erro ao gerar retrato. Verifique a API key.');
      setStage('pick');
    }
  };

  const handleSave = async () => {
    if (!resultUrl) return;
    setSaving(true);
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const file = new File([blob], `retrato-${activePreset}-${Date.now()}.png`, { type: 'image/png' });
      const item = await uploadAndRegister(file);
      if (item) {
        toast.success('Retrato salvo na biblioteca');
        onRefresh();
        onSaved(item.public_url);
      }
    } catch (err) {
      Sentry.captureException(err);
      toast.error('Erro ao salvar');
    }
    setSaving(false);
  };

  const reset = () => {
    if (resultUrl?.startsWith('blob:')) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setStage('pick');
    setActivePreset(null);
    setOriginalUrl(null);
    setOriginalItem(null);
  };

  // ---- Generating state ----
  if (stage === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[350px]">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <div className="text-center">
          <p className="text-sm font-medium">Gerando retrato {activePreset === 'cinematic' ? 'cinematográfico' : 'profissional'}...</p>
          <p className="text-xs text-muted-foreground mt-1">Nano Banana Pro processando (~10-15s)</p>
        </div>
      </div>
    );
  }

  // ---- Done state — before/after ----
  if (stage === 'done' && originalUrl && resultUrl) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground mb-2">Original</p>
            <div className="border border-border/40 rounded-xl overflow-hidden bg-black/5 p-2 min-h-[200px] flex items-center justify-center">
              <img src={originalItem?.public_url || originalUrl} alt="Original" className="max-h-[250px] w-auto object-contain rounded" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Retrato {activePreset === 'cinematic' ? 'Cinematográfico' : 'Profissional'}
            </p>
            <div className="border border-border/40 rounded-xl overflow-hidden bg-black p-2 min-h-[200px] flex items-center justify-center">
              <img src={resultUrl} alt="Retrato" className="max-h-[250px] w-auto object-contain rounded" />
            </div>
          </div>
        </div>

        {/* Try the other preset or save */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5 text-xs">
              <RotateCcw className="h-3.5 w-3.5" /> Outra Foto
            </Button>
            {PORTRAIT_PRESETS.filter(p => p.key !== activePreset).map(p => {
              const Icon = PRESET_ICONS[p.key as keyof typeof PRESET_ICONS];
              return (
                <Button key={p.key} variant="outline" size="sm" className="gap-1.5 text-xs"
                  onClick={() => generate(p.key)}>
                  <Icon className="h-3.5 w-3.5" /> Tentar {p.label}
                </Button>
              );
            })}
          </div>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 text-xs">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            {saving ? 'Salvando...' : 'Salvar na Biblioteca'}
          </Button>
        </div>
      </div>
    );
  }

  // ---- Pick state ----
  return (
    <div className="space-y-4">
      {/* No image selected yet */}
      {!originalUrl && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Selecione a foto original do palestrante</p>
            <label>
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer" asChild>
                <span><Upload className="h-4 w-4" /> Upload</span>
              </Button>
            </label>
          </div>
          <div className="overflow-y-auto max-h-[350px]">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Sparkles className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm">Nenhuma imagem</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {items.map((item) => (
                  <button key={item.id} onClick={() => selectImage(item)}
                    className="rounded-lg overflow-hidden border-2 border-gray-200 hover:border-accent transition-all p-2 min-h-[80px] flex flex-col items-center justify-center bg-white group">
                    <img src={item.public_url} alt={item.file_name} className="max-h-[55px] w-auto max-w-full object-contain" loading="lazy" />
                    <span className="text-[8px] text-gray-400 mt-1 text-center line-clamp-1">{item.file_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Image selected — choose preset */}
      {originalUrl && (
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="border border-border/40 rounded-xl overflow-hidden bg-black/5 p-3">
            <img src={originalUrl} alt="Selecionada" className="max-h-[200px] w-auto object-contain rounded" />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium">Escolha o estilo do retrato</p>
            <p className="text-xs text-muted-foreground mt-1">A IA transforma mantendo o rosto original</p>
          </div>

          <div className="flex gap-4">
            {PORTRAIT_PRESETS.map(p => {
              const Icon = PRESET_ICONS[p.key as keyof typeof PRESET_ICONS];
              return (
                <button key={p.key} onClick={() => generate(p.key)}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-border/40 hover:border-accent hover:bg-accent/5 transition-all w-48">
                  <Icon className="h-8 w-8 text-accent" />
                  <div className="text-center">
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{p.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <Button variant="ghost" size="sm" onClick={() => { setOriginalUrl(null); setOriginalItem(null); }} className="text-xs gap-1">
            <RotateCcw className="h-3 w-3" /> Trocar foto
          </Button>
        </div>
      )}
    </div>
  );
};
