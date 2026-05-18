/**
 * Video Utils V2 — Converte URLs de vídeo para embed (YouTube, Vimeo)
 * Cópia isolada da V1, zero dependências externas
 */
export function getEmbedUrlV2(url: string): string {
  if (!url || typeof url !== 'string') return '';

  const trimmedUrl = url.trim();

  // YouTube Shorts
  const shortsMatch = trimmedUrl.match(/(?:youtube\.com\/shorts\/|youtu\.be\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

  // YouTube watch
  const ytWatchMatch = trimmedUrl.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (ytWatchMatch) return `https://www.youtube.com/embed/${ytWatchMatch[1]}`;

  // YouTube short URL
  const ytShortMatch = trimmedUrl.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytShortMatch) return `https://www.youtube.com/embed/${ytShortMatch[1]}`;

  // YouTube embed already
  if (trimmedUrl.includes('youtube.com/embed/')) return trimmedUrl;

  // Vimeo
  const vimeoMatch = trimmedUrl.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  // Vimeo embed already
  if (trimmedUrl.includes('player.vimeo.com/video/')) return trimmedUrl;

  return '';
}

/**
 * Extrai thumbnail do YouTube a partir de URL embed ou original
 */
export function getYouTubeThumbnail(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:embed\/|watch\?v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : '';
}
