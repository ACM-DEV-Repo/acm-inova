const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:'];

export function safeUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const lower = trimmed.toLowerCase();
  if (BLOCKED_PROTOCOLS.some(p => lower.startsWith(p))) return '';

  // Relative URLs and anchors are safe
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  if (trimmed.startsWith('#')) return trimmed;

  // Only allow http/https for absolute URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return trimmed;

  // Reject everything else (protocol-relative, unknown schemes)
  return '';
}
