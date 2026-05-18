import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock das dependencias externas ANTES do import
vi.mock('browser-image-compression', () => ({
  default: vi.fn(),
}));

vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
}));

import { compressImage } from '@/lib/imageOptimizer';
import imageCompression from 'browser-image-compression';
import * as Sentry from '@sentry/react';

function createFakeFile(name: string, type: string, sizeKB: number): File {
  const content = new Uint8Array(sizeKB * 1024);
  return new File([content], name, { type, lastModified: Date.now() });
}

describe('compressImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Happy path ──
  describe('compressao bem-sucedida', () => {
    it('retorna arquivo comprimido com extensao .webp', async () => {
      const original = createFakeFile('foto.jpg', 'image/jpeg', 500);
      const compressedBlob = new Blob([new Uint8Array(100 * 1024)], { type: 'image/webp' });

      vi.mocked(imageCompression).mockResolvedValue(
        new File([compressedBlob], 'foto.webp', { type: 'image/webp' })
      );

      const result = await compressImage(original);

      expect(result.name).toBe('foto.webp');
      expect(result.type).toBe('image/webp');
    });

    it('chama imageCompression com opcoes corretas', async () => {
      const original = createFakeFile('banner.png', 'image/png', 2000);
      const compressedBlob = new File([new Uint8Array(100)], 'banner.webp', { type: 'image/webp' });

      vi.mocked(imageCompression).mockResolvedValue(compressedBlob);

      await compressImage(original);

      expect(imageCompression).toHaveBeenCalledWith(original, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
      });
    });

    it('troca extensao de .png para .webp', async () => {
      const original = createFakeFile('imagem.png', 'image/png', 300);
      const compressed = new File([new Uint8Array(50)], 'imagem.webp', { type: 'image/webp' });

      vi.mocked(imageCompression).mockResolvedValue(compressed);

      const result = await compressImage(original);
      expect(result.name).toBe('imagem.webp');
    });

    it('troca extensao de .jpeg para .webp', async () => {
      const original = createFakeFile('foto.jpeg', 'image/jpeg', 300);
      const compressed = new File([new Uint8Array(50)], 'foto.webp', { type: 'image/webp' });

      vi.mocked(imageCompression).mockResolvedValue(compressed);

      const result = await compressImage(original);
      expect(result.name).toBe('foto.webp');
    });

    it('lida com nomes de arquivo com multiplos pontos', async () => {
      const original = createFakeFile('foto.final.v2.jpg', 'image/jpeg', 300);
      const compressed = new File([new Uint8Array(50)], 'compressed.webp', { type: 'image/webp' });

      vi.mocked(imageCompression).mockResolvedValue(compressed);

      const result = await compressImage(original);
      expect(result.name).toBe('foto.final.v2.webp');
    });
  });

  // ── Tratamento de erros ──
  describe('tratamento de erros', () => {
    it('retorna arquivo original quando compressao falha', async () => {
      const original = createFakeFile('foto.jpg', 'image/jpeg', 500);
      const error = new Error('Compression failed');

      vi.mocked(imageCompression).mockRejectedValue(error);

      const result = await compressImage(original);

      expect(result).toBe(original);
      expect(result.name).toBe('foto.jpg');
    });

    it('captura excecao no Sentry quando compressao falha', async () => {
      const original = createFakeFile('banner.png', 'image/png', 1000);
      const error = new Error('WebWorker crashed');

      vi.mocked(imageCompression).mockRejectedValue(error);

      await compressImage(original);

      expect(Sentry.captureException).toHaveBeenCalledWith(
        error,
        { extra: { context: 'compressImage', fileName: 'banner.png' } }
      );
    });

    it('envia fileName correto pro Sentry no contexto de erro', async () => {
      const original = createFakeFile('relatorio-medico-2026.jpg', 'image/jpeg', 800);
      const error = new Error('Out of memory');

      vi.mocked(imageCompression).mockRejectedValue(error);

      await compressImage(original);

      expect(Sentry.captureException).toHaveBeenCalledWith(
        error,
        expect.objectContaining({
          extra: expect.objectContaining({
            fileName: 'relatorio-medico-2026.jpg',
          }),
        })
      );
    });

    it('nao chama Sentry quando compressao e bem-sucedida', async () => {
      const original = createFakeFile('ok.jpg', 'image/jpeg', 100);
      const compressed = new File([new Uint8Array(50)], 'ok.webp', { type: 'image/webp' });

      vi.mocked(imageCompression).mockResolvedValue(compressed);

      await compressImage(original);

      expect(Sentry.captureException).not.toHaveBeenCalled();
    });
  });

  // ── Resultado e um File valido ──
  describe('integridade do resultado', () => {
    it('resultado e instancia de File', async () => {
      const original = createFakeFile('test.jpg', 'image/jpeg', 200);
      const compressed = new File([new Uint8Array(50)], 'test.webp', { type: 'image/webp' });

      vi.mocked(imageCompression).mockResolvedValue(compressed);

      const result = await compressImage(original);
      expect(result).toBeInstanceOf(File);
    });

    it('resultado tem lastModified recente', async () => {
      const before = Date.now();
      const original = createFakeFile('test.jpg', 'image/jpeg', 200);
      const compressed = new File([new Uint8Array(50)], 'test.webp', { type: 'image/webp' });

      vi.mocked(imageCompression).mockResolvedValue(compressed);

      const result = await compressImage(original);
      const after = Date.now();

      expect(result.lastModified).toBeGreaterThanOrEqual(before);
      expect(result.lastModified).toBeLessThanOrEqual(after);
    });
  });
});
