import * as Sentry from '@sentry/react';
import { supabase } from '@/integrations/supabase/client';
import { uploadImage } from '@/lib/uploadImage';
import { compressImage } from '@/lib/imageOptimizer';

export interface MediaItem {
  id: string;
  file_name: string;
  public_url: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  created_at: string;
}

export async function listMedia(limit = 50, offset = 0): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from('bd_cms_media')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    Sentry.captureException(error, { extra: { context: 'listMedia' } });
    return [];
  }
  return (data ?? []) as MediaItem[];
}

export async function searchMedia(query: string): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from('bd_cms_media')
    .select('*')
    .ilike('file_name', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    Sentry.captureException(error, { extra: { context: 'searchMedia', query } });
    return [];
  }
  return (data ?? []) as MediaItem[];
}

export async function uploadAndRegister(file: File): Promise<MediaItem | null> {
  try {
    const optimized = await compressImage(file);
    const publicUrl = await uploadImage(optimized);

    // Get image dimensions
    let width: number | null = null;
    let height: number | null = null;
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(optimized);
      img.src = objectUrl;
      await new Promise<void>((resolve) => {
        img.onload = () => { width = img.naturalWidth; height = img.naturalHeight; resolve(); };
        img.onerror = () => resolve();
      });
      URL.revokeObjectURL(objectUrl);
    } catch { /* dimensions optional */ }

    const record = {
      file_name: file.name,
      public_url: publicUrl,
      storage_path: `cms-images/${publicUrl.split('/cms-images/')[1] || ''}`,
      mime_type: optimized.type,
      size_bytes: optimized.size,
      width,
      height,
    };

    const { data, error } = await supabase
      .from('bd_cms_media')
      .insert(record)
      .select()
      .single();

    if (error) {
      Sentry.captureException(error, { extra: { context: 'uploadAndRegister' } });
      return null;
    }
    return data as MediaItem;
  } catch (error) {
    Sentry.captureException(error, { extra: { context: 'uploadAndRegister' } });
    return null;
  }
}

export async function deleteMedia(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('bd_cms_media')
    .delete()
    .eq('id', id);

  if (error) {
    Sentry.captureException(error, { extra: { context: 'deleteMedia', id } });
    return false;
  }
  return true;
}
