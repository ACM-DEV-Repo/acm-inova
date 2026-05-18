import * as Sentry from '@sentry/react';
import { supabase } from "@/integrations/supabase/client";

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `cms-images/${fileName}`;

  const { data, error } = await supabase.storage
    .from('cms-assets')
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: false
    });

  if (error) {
    Sentry.captureException(error, { extra: { context: 'uploadImage', filePath } });
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('cms-assets')
    .getPublicUrl(filePath);

  return publicUrl;
}
