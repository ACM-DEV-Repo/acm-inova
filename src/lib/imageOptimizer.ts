import * as Sentry from '@sentry/react';
import imageCompression from 'browser-image-compression';

/**
 * Comprime uma imagem para otimizar upload e armazenamento.
 * Converte para WebP, max 1MB, max 1920px (HD), usando WebWorker.
 * Em caso de falha, retorna o arquivo original.
 */
export async function compressImage(file: File): Promise<File> {
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp' as const,
    };

    const compressedFile = await imageCompression(file, options);

    // Fix extension to match actual output format
    const outputExt = 'webp';
    const outputName = file.name.replace(/\.[^.]+$/, `.${outputExt}`);

    return new File([compressedFile], outputName, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    Sentry.captureException(error, { extra: { context: 'compressImage', fileName: file.name } });
    return file;
  }
}
