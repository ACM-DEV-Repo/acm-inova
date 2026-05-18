import { useState, useRef } from "react";
import * as Sentry from "@sentry/react";
import { Upload, X, FolderOpen } from "lucide-react";
import { uploadImage } from "@/lib/uploadImage";
import { compressImage } from "@/lib/imageOptimizer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MediaLibraryV2 } from "./MediaLibraryV2";

type Shape = 'circle' | 'landscape' | 'square';

const SHAPE_CLASSES: Record<Shape, { container: string; img: string }> = {
  circle: {
    container: 'w-[120px] h-[120px] rounded-full',
    img: 'rounded-full',
  },
  landscape: {
    container: 'w-full max-w-[280px] h-[100px] rounded-lg',
    img: 'rounded-lg',
  },
  square: {
    container: 'w-[140px] h-[140px] rounded-lg',
    img: 'rounded-lg',
  },
};

interface ImageUploadV2Props {
  value?: string;
  onChange: (url: string) => void;
  label: string;
  recommendedSize?: string;
  shape?: Shape;
}

export const ImageUploadV2 = ({ value, onChange, label, recommendedSize, shape = 'circle' }: ImageUploadV2Props) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_FILE_SIZE_MB = 10;

  const shapeStyle = SHAPE_CLASSES[shape] || SHAPE_CLASSES.circle;

  const handleFile = async (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Formato não suportado. Use JPEG, PNG, WebP ou GIF.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`Arquivo muito grande. Máximo: ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    // Warn about very small images
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    let imgLoaded = false;
    await new Promise<void>((resolve) => {
      img.onload = () => { imgLoaded = true; resolve(); };
      img.onerror = () => resolve();
    });
    URL.revokeObjectURL(objectUrl);
    if (imgLoaded && img.naturalWidth < 200) {
      toast.warning('Imagem pequena. Recomendado: mínimo 200px de largura.');
    }

    setUploading(true);
    const compressToastId = toast.loading("Otimizando imagem...");

    try {
      const optimizedFile = await compressImage(file);

      if (optimizedFile.size < file.size) {
        toast.success("Otimização concluída.", { id: compressToastId });
      } else {
        toast.info("Iniciando upload.", { id: compressToastId });
      }

      const url = await uploadImage(optimizedFile);
      onChange(url);
      toast.success("Imagem enviada!");
    } catch (error: unknown) {
      Sentry.captureException(error, { extra: { context: 'ImageUploadV2.handleFile' } });
      console.error('[ImageUploadV2] Erro ao fazer upload:', error);

      let errorMessage = 'Erro ao fazer upload da imagem';
      if (error && typeof error === 'object' && 'message' in error) {
        const err = error as { message: string; statusCode?: number };
        if (err.statusCode === 403 || err.message?.includes('security policy')) {
          errorMessage = 'Sem permissão para upload. Verifique se você está logado como admin.';
        } else {
          errorMessage = `Upload falhou: ${err.message}`;
        }
      }
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {recommendedSize && (
        <span className="text-[10px] text-muted-foreground">{recommendedSize}</span>
      )}

      <div
        className={`
          relative ${shapeStyle.container}
          flex items-center justify-center
          border-2 border-dashed transition-all duration-300 cursor-pointer
          bg-black/[0.03] backdrop-blur-sm
          ${dragActive ? 'border-accent bg-accent/10' : 'border-black/[0.15] hover:border-black/[0.30] hover:bg-black/[0.06]'}
          ${uploading ? 'opacity-60 cursor-wait' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />

        {value && !uploading ? (
          <>
            <img
              src={value}
              alt="Preview"
              className={`w-full h-full object-cover ${shapeStyle.img}`}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-1 -right-1 w-7 h-7 rounded-full shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                toast('Remover imagem?', {
                  action: {
                    label: 'Confirmar',
                    onClick: () => onChange(''),
                  },
                  cancel: { label: 'Cancelar', onClick: () => {} },
                  duration: 5000,
                });
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-2">
            <Upload className="w-5 h-5 text-muted-foreground mb-1" />
            <p className="text-[10px] text-muted-foreground leading-tight">
              {uploading ? 'Enviando...' : 'Clique ou arraste'}
            </p>
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-xs gap-1.5 text-muted-foreground hover:text-foreground"
        onClick={(e) => { e.stopPropagation(); setLibraryOpen(true); }}
      >
        <FolderOpen className="h-3.5 w-3.5" />
        Biblioteca
      </Button>

      <MediaLibraryV2
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={(url) => { onChange(url); setLibraryOpen(false); }}
      />
    </div>
  );
};
