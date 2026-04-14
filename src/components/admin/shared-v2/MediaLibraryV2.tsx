import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Upload, Check, Loader2, Image as ImageIcon, Sliders, Sparkles } from 'lucide-react';
import { listMedia, searchMedia, uploadAndRegister, type MediaItem } from '@/lib/cms-v2/media-api';
import { toast } from 'sonner';
import { ImageEditorV2 } from './ImageEditorV2';
import { SpeakerPortraitV2 } from './SpeakerPortraitV2';

interface MediaLibraryV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

type Tab = 'library' | 'editor' | 'portrait';

export const MediaLibraryV2 = ({ open, onOpenChange, onSelect }: MediaLibraryV2Props) => {
  const [tab, setTab] = useState<Tab>('library');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = search.trim() ? await searchMedia(search.trim()) : await listMedia();
    setItems(data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    if (open) {
      load();
      setSelected(null);
      setTab('library');
    }
  }, [open, load]);

  // ---- Multi-file upload ----
  const uploadFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    setUploading(true);
    const results: MediaItem[] = [];
    for (const file of imageFiles) {
      const item = await uploadAndRegister(file);
      if (item) results.push(item);
    }
    if (results.length > 0) {
      toast.success(`${results.length} ${results.length === 1 ? 'imagem salva' : 'imagens salvas'}`);
      setItems(prev => [...results, ...prev]);
    }
    if (results.length < imageFiles.length) {
      toast.error(`${imageFiles.length - results.length} falharam`);
    }
    setUploading(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
  };

  // ---- Drag & drop ----
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => {
    if (dropRef.current && !dropRef.current.contains(e.relatedTarget as Node)) setDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  };

  const handleConfirm = () => {
    if (selected) { onSelect(selected); onOpenChange(false); }
  };

  const handleSaved = (url: string) => {
    onSelect(url);
    onOpenChange(false);
  };

  const TABS: { key: Tab; label: string; icon: typeof ImageIcon }[] = [
    { key: 'library', label: 'Biblioteca', icon: ImageIcon },
    { key: 'editor', label: 'Editor', icon: Sliders },
    { key: 'portrait', label: 'Retrato IA', icon: Sparkles },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Biblioteca de Imagens
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-border/40 pb-3">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                tab === key ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* ===== Tab: Retrato IA ===== */}
        {tab === 'portrait' && (
          <SpeakerPortraitV2 items={items} onSaved={handleSaved} onRefresh={load} />
        )}

        {/* ===== Tab: Editor (remover fundo + ajustes + IA) ===== */}
        {tab === 'editor' && (
          <ImageEditorV2 items={items} onSaved={handleSaved} onRefresh={load} />
        )}

        {/* ===== Tab: Biblioteca ===== */}
        {tab === 'library' && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome..." className="pl-9" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && load()} />
              </div>
              <label>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} disabled={uploading} />
                <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer" asChild>
                  <span>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Upload
                  </span>
                </Button>
              </label>
            </div>

            {/* Drop zone + grid */}
            <div ref={dropRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              className={`flex-1 overflow-y-auto min-h-[300px] rounded-xl transition-colors ${
                dragging ? 'bg-accent/5 ring-2 ring-accent/30 ring-dashed' : ''
              }`}>

              {/* Drag overlay */}
              {dragging && (
                <div className="flex flex-col items-center justify-center h-full text-accent py-12">
                  <Upload className="h-10 w-10 mb-3 animate-bounce" />
                  <p className="text-sm font-medium">Solte as imagens aqui</p>
                </div>
              )}

              {!dragging && loading && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {!dragging && !loading && items.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                  <Upload className="h-10 w-10 mb-2 opacity-30" />
                  <p className="text-sm">Arraste imagens aqui ou clique em Upload</p>
                </div>
              )}

              {!dragging && !loading && items.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {items.map((item) => (
                    <button key={item.id} onClick={() => setSelected(item.public_url)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all p-3 min-h-[100px] flex flex-col items-center justify-center bg-white ${
                        selected === item.public_url
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}>
                      <img src={item.public_url} alt={item.file_name} className="max-h-[70px] w-auto max-w-full object-contain" loading="lazy" />
                      {selected === item.public_url && (
                        <div className="absolute top-1 right-1">
                          <Check className="h-5 w-5 text-primary-foreground bg-primary rounded-full p-0.5" />
                        </div>
                      )}
                      <span className="text-[9px] text-gray-500 mt-2 text-center line-clamp-2 leading-tight">{item.file_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button onClick={handleConfirm} disabled={!selected}>Usar imagem selecionada</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
