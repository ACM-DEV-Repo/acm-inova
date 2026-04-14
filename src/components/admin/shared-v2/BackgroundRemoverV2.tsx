import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Eraser, Check, RotateCcw } from 'lucide-react';
import { uploadAndRegister, type MediaItem } from '@/lib/cms-v2/media-api';
import { toast } from 'sonner';
import * as Sentry from '@sentry/react';

interface BackgroundRemoverV2Props {
  items: MediaItem[];
  onSaved: (url: string) => void;
  onRefresh: () => void;
}

type Stage = 'pick' | 'loading-model' | 'processing' | 'done';

export const BackgroundRemoverV2 = ({ items, onSaved, onRefresh }: BackgroundRemoverV2Props) => {
  const [stage, setStage] = useState<Stage>('pick');
  const [original, setOriginal] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const processImage = useCallback(async (source: string | File) => {
    const objectUrl = typeof source === 'string' ? source : URL.createObjectURL(source);
    setOriginal(objectUrl);
    setResult(null);
    setStage('loading-model');
    setProgress(0);

    try {
      const { removeBackground } = await import('@imgly/background-removal');
      setStage('processing');

      // If source is URL, fetch as blob first
      let input: File | Blob;
      if (typeof source === 'string') {
        const res = await fetch(source);
        input = await res.blob();
      } else {
        input = source;
      }

      const blob = await removeBackground(input, {
        model: 'medium',
        progress: (_key: string, current: number, total: number) => {
          if (total > 0) setProgress(Math.round((current / total) * 100));
        },
      });

      const resultUrl = URL.createObjectURL(blob);
      setResult(resultUrl);
      setStage('done');
    } catch (err) {
      Sentry.captureException(err);
      toast.error('Erro ao remover fundo');
      setStage('pick');
    }
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) processImage(file);
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const response = await fetch(result);
      const blob = await response.blob();
      const file = new File([blob], `sem-fundo-${Date.now()}.png`, { type: 'image/png' });
      const item = await uploadAndRegister(file);
      if (item) {
        toast.success('Imagem sem fundo salva na biblioteca');
        onRefresh();
        onSaved(item.public_url);
      } else {
        toast.error('Erro ao salvar');
      }
    } catch (err) {
      Sentry.captureException(err);
      toast.error('Erro ao salvar imagem');
    }
    setSaving(false);
  };

  const reset = () => {
    setOriginal(null);
    setResult(null);
    setStage('pick');
    setProgress(0);
  };

  // ---- Processing / Done states ----
  if (stage === 'loading-model' || stage === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {stage === 'loading-model' ? 'Carregando modelo de IA...' : 'Removendo fundo...'}
          </p>
          {progress > 0 && (
            <div className="mt-3 w-48 mx-auto">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{progress}%</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {stage === 'loading-model' ? 'Primeira vez pode demorar mais' : 'Processando localmente'}
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'done' && original && result) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground mb-2">Original</p>
            <div className="border border-border/40 rounded-xl overflow-hidden bg-black/5 p-2 min-h-[160px] flex items-center justify-center">
              <img src={original} alt="Original" className="max-h-[200px] w-auto object-contain rounded" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground mb-2">Sem Fundo</p>
            <div className="border border-border/40 rounded-xl overflow-hidden p-2 min-h-[160px] flex items-center justify-center"
              style={{ background: 'repeating-conic-gradient(#e5e5e5 0% 25%, white 0% 50%) 50% / 16px 16px' }}>
              <img src={result} alt="Sem fundo" className="max-h-[200px] w-auto object-contain rounded" />
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={reset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Outra Imagem
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {saving ? 'Salvando...' : 'Salvar na Biblioteca'}
          </Button>
        </div>
      </div>
    );
  }

  // ---- Pick state: show library grid + upload ----
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Selecione uma imagem da biblioteca ou envie uma nova
        </p>
        <label>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer" asChild>
            <span>
              <Upload className="h-4 w-4" />
              Upload
            </span>
          </Button>
        </label>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[350px]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Eraser className="h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">Nenhuma imagem na biblioteca</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => processImage(item.public_url)}
                className="relative rounded-lg overflow-hidden border-2 border-gray-200 hover:border-accent transition-all p-3 min-h-[100px] flex flex-col items-center justify-center bg-white group"
              >
                <img src={item.public_url} alt={item.file_name} className="max-h-[70px] w-auto max-w-full object-contain" loading="lazy" />
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors flex items-center justify-center">
                  <Eraser className="h-5 w-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[9px] text-gray-500 mt-2 text-center line-clamp-2 leading-tight">
                  {item.file_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
