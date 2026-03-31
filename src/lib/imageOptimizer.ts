import * as Sentry from '@sentry/react';
import imageCompression from 'browser-image-compression';

/**
 * Comprime uma imagem para otimizar upload e armazenamento.
 * Configurações: max 1MB, max 1920px (HD), usando WebWorker para não travar UI.
 * Em caso de falha, retorna o arquivo original.
 */
export async function compressImage(file: File): Promise<File> {
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);
    
    // Preserva o nome original do arquivo
    return new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    Sentry.captureException(error, { extra: { context: 'compressImage', fileName: file.name } });
    console.warn('Compressão de imagem falhou, usando arquivo original:', error);
    return file;
  }
}
