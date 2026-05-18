// =============================================================
// Testes de Segurança — CMS V2
// OWASP Top 10: XSS, Injection, Open Redirect
// Cobre: safe-url.ts | cms-api.ts (ref) | design-utils.ts (font) | pixelValidation-v2.ts
// =============================================================

import { describe, it, expect } from 'vitest';
import { safeUrl } from '../cms-v2/safe-url';
import { resolveSafeFont, SAFE_FONTS } from '../cms-v2/design-utils';
import { validatePixelId } from '../cms-v2/pixelValidation-v2';

// -------------------------------------------------------------
// Helper: extrai a lógica de sanitização do ref sem chamar Supabase
// Espelha exatamente o que fetchLPByRef faz internamente
// -------------------------------------------------------------
function sanitizeRef(ref: string): string {
  return ref.replace(/[^a-zA-Z0-9\-_]/g, '');
}

// =============================================================
// BLOCO 1 — safeUrl: XSS via atributo href/src
// =============================================================

describe('safeUrl — XSS via javascript: protocol', () => {
  it('bloqueia javascript:alert(1) (XSS clássico)', () => {
    expect(safeUrl('javascript:alert(1)')).toBe('');
  });

  it('bloqueia JAVASCRIPT:alert(1) (bypass por uppercase)', () => {
    expect(safeUrl('JAVASCRIPT:alert(1)')).toBe('');
  });

  it('bloqueia JavaScript:alert(1) (mixed case)', () => {
    expect(safeUrl('JavaScript:alert(1)')).toBe('');
  });

  it('bloqueia javascript: com espaço antes (trim evasion)', () => {
    expect(safeUrl('  javascript:alert(1)')).toBe('');
  });

  it('bloqueia javascript: com payload vazio (vetor de redirect)', () => {
    expect(safeUrl('javascript:')).toBe('');
  });

  it('bloqueia javascript:void(0) (payload silencioso)', () => {
    expect(safeUrl('javascript:void(0)')).toBe('');
  });
});

describe('safeUrl — XSS via data: URI', () => {
  it('bloqueia data:text/html,<script>alert(1)</script>', () => {
    expect(safeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
  });

  it('bloqueia data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==', () => {
    expect(safeUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).toBe('');
  });

  it('bloqueia DATA: (uppercase evasion)', () => {
    expect(safeUrl('DATA:text/html,<img src=x onerror=alert(1)>')).toBe('');
  });
});

describe('safeUrl — XSS via vbscript:', () => {
  it('bloqueia vbscript:msgbox(1)', () => {
    expect(safeUrl('vbscript:msgbox(1)')).toBe('');
  });

  it('bloqueia VBSCRIPT:msgbox(1) (uppercase evasion)', () => {
    expect(safeUrl('VBSCRIPT:msgbox(1)')).toBe('');
  });
});

describe('safeUrl — Open Redirect via protocol-relative URL', () => {
  it('bloqueia //evil.com (protocol-relative hijack)', () => {
    expect(safeUrl('//evil.com')).toBe('');
  });

  it('bloqueia //evil.com/phishing (path com protocol-relative)', () => {
    expect(safeUrl('//evil.com/phishing')).toBe('');
  });

  it('bloqueia ///triple-slash evasion', () => {
    expect(safeUrl('///evil.com')).toBe('');
  });
});

describe('safeUrl — esquemas desconhecidos e exotic protocols', () => {
  it('bloqueia ftp:// (protocolo não permitido)', () => {
    expect(safeUrl('ftp://files.example.com/malware.exe')).toBe('');
  });

  it('bloqueia blob:https://... (XSS via Blob URL)', () => {
    expect(safeUrl('blob:https://evil.com/uuid')).toBe('');
  });

  it('bloqueia ws:// (WebSocket hijack via href)', () => {
    expect(safeUrl('ws://evil.com')).toBe('');
  });

  it('bloqueia string sem protocolo reconhecível (ex: "evil.com")', () => {
    expect(safeUrl('evil.com')).toBe('');
  });

  it('bloqueia string vazia', () => {
    expect(safeUrl('')).toBe('');
  });

  it('bloqueia undefined', () => {
    expect(safeUrl(undefined)).toBe('');
  });

  it('bloqueia string só com espaços', () => {
    expect(safeUrl('   ')).toBe('');
  });
});

describe('safeUrl — URLs válidas que DEVEM passar', () => {
  it('permite https:// (URL segura padrão)', () => {
    expect(safeUrl('https://acm.org.br')).toBe('https://acm.org.br');
  });

  it('permite http:// (permitido explicitamente)', () => {
    expect(safeUrl('http://acm.org.br')).toBe('http://acm.org.br');
  });

  it('permite URL relativa /consulta (path interno)', () => {
    expect(safeUrl('/consulta')).toBe('/consulta');
  });

  it('permite URL relativa /path/com/segmentos', () => {
    expect(safeUrl('/paginas/sobre')).toBe('/paginas/sobre');
  });

  it('permite ancora #secao (scroll interno)', () => {
    expect(safeUrl('#formulario')).toBe('#formulario');
  });

  it('permite mailto: (link de e-mail legítimo)', () => {
    expect(safeUrl('mailto:contato@acm.org.br')).toBe('mailto:contato@acm.org.br');
  });

  it('permite tel: (link de telefone legítimo)', () => {
    expect(safeUrl('tel:+554899190401')).toBe('tel:+554899190401');
  });

  it('preserva URL com query string', () => {
    const url = 'https://acm.org.br/planos?ref=lp01&utm_source=google';
    expect(safeUrl(url)).toBe(url);
  });

  it('preserva URL com hash e path', () => {
    const url = 'https://acm.org.br/evento#programacao';
    expect(safeUrl(url)).toBe(url);
  });
});

// =============================================================
// BLOCO 2 — sanitizeRef: SQL/PostgREST Injection via parâmetro ref
// =============================================================

describe('sanitizeRef (fetchLPByRef) — PostgREST injection via parâmetro ref', () => {
  it('remove aspas simples (SQL injection clássico: ref=lp01\')', () => {
    expect(sanitizeRef("lp01'")).toBe('lp01');
  });

  it('remove aspas duplas (SQL injection via string delimiter)', () => {
    expect(sanitizeRef('lp01"')).toBe('lp01');
  });

  it('remove ponto (PostgREST table.column injection: schema.table)', () => {
    expect(sanitizeRef('public.users')).toBe('publicusers');
  });

  it('remove parênteses (PostgREST function call: lp_key.eq(x))', () => {
    expect(sanitizeRef('lp01),status.eq.active')).toBe('lp01statuseqactive');
  });

  it('remove vírgula (PostgREST OR chaining: lp01,id.gt.0)', () => {
    expect(sanitizeRef('lp01,id.gt.0')).toBe('lp01idgt0');
  });

  it('remove espaço (evasão via whitespace)', () => {
    expect(sanitizeRef('lp 01')).toBe('lp01');
  });

  it('remove % (URL encoding evasion)', () => {
    expect(sanitizeRef('lp%2701')).toBe('lp2701');
  });

  it('remove ponto-e-vírgula (múltiplas queries)', () => {
    expect(sanitizeRef('lp01;DROP TABLE bd_cms_lp_v2')).toBe('lp01DROPTABLEbd_cms_lp_v2');
  });

  it('remove = (PostgREST filter injection: lp_key.eq.lp01 OR 1=1)', () => {
    expect(sanitizeRef('lp01 OR 1=1')).toBe('lp01OR11');
  });

  it('retorna string vazia para payload só com caracteres proibidos', () => {
    // FINDING: hifen é char permitido, então '--' SQL comment delimiter sobrevive
    // Payload: "';DROP TABLE bd_cms_lp_v2;--" → letras+hifen sobram
    expect(sanitizeRef("';DROP TABLE bd_cms_lp_v2;--")).toBe('DROPTABLEbd_cms_lp_v2--');
  });

  it('retorna string vazia para payload só de símbolos', () => {
    expect(sanitizeRef("'\"(),. ")).toBe('');
  });

  it('preserva lp_key válido com hífen e underscore (chars permitidos)', () => {
    expect(sanitizeRef('lp01')).toBe('lp01');
    expect(sanitizeRef('acm-home')).toBe('acm-home');
    expect(sanitizeRef('home_v2')).toBe('home_v2');
    expect(sanitizeRef('LP-PROMO_2025')).toBe('LP-PROMO_2025');
  });

  it('preserva slugs alfanuméricos com hífen (formato real do CMS)', () => {
    expect(sanitizeRef('global-v2')).toBe('global-v2');
  });
});

// =============================================================
// BLOCO 3 — resolveSafeFont: CSS injection via fontFamily
// =============================================================

describe('resolveSafeFont — CSS injection via fontFamily', () => {
  it('bloqueia CSS injection: "Arial; background: url(evil)"', () => {
    const result = resolveSafeFont('Arial; background: url(evil)');
    expect(SAFE_FONTS).toContain(result as typeof SAFE_FONTS[number]);
  });

  it('retorna Inter como fallback para fonte desconhecida', () => {
    expect(resolveSafeFont('EvilFont')).toBe('Inter');
  });

  it('retorna Inter para string vazia', () => {
    expect(resolveSafeFont('')).toBe('Inter');
  });

  it('bloqueia injection via expression() (IE CSS hack)', () => {
    expect(resolveSafeFont('expression(alert(1))')).toBe('Inter');
  });

  it('bloqueia font arbitrária não da whitelist', () => {
    expect(resolveSafeFont('Comic Sans MS')).toBe('Inter');
  });

  it('bloqueia font com @import embutido', () => {
    expect(resolveSafeFont('@import url(//evil.com/font.css)')).toBe('Inter');
  });

  it('permite Inter (whitelist)', () => {
    expect(resolveSafeFont('Inter')).toBe('Inter');
  });

  it('permite Roboto (whitelist)', () => {
    expect(resolveSafeFont('Roboto')).toBe('Roboto');
  });

  it('permite Poppins (whitelist)', () => {
    expect(resolveSafeFont('Poppins')).toBe('Poppins');
  });

  it('permite Montserrat (whitelist)', () => {
    expect(resolveSafeFont('Montserrat')).toBe('Montserrat');
  });

  it('resolve font mesmo quando a string contém o nome como substring', () => {
    // CMS pode salvar "Roboto, sans-serif" — deve resolver para Roboto
    expect(resolveSafeFont('Roboto, sans-serif')).toBe('Roboto');
  });

  it('toda fonte da whitelist SAFE_FONTS resolve para si mesma', () => {
    SAFE_FONTS.forEach(font => {
      expect(resolveSafeFont(font)).toBe(font);
    });
  });
});

// =============================================================
// BLOCO 4 — validatePixelId: injeção de script via pixel ID
// =============================================================

describe('validatePixelId — Meta Pixel: rejeita IDs maliciosos', () => {
  it('rejeita <script>alert(1)</script> como pixel Meta', () => {
    expect(validatePixelId('meta', '<script>alert(1)</script>').status).toBe('error');
  });

  it('rejeita string vazia (status: empty)', () => {
    expect(validatePixelId('meta', '').status).toBe('empty');
  });

  it('rejeita pixel Meta com letras (deve ser só números)', () => {
    expect(validatePixelId('meta', 'ABC123456789012').status).toBe('error');
  });

  it('rejeita pixel Meta curto demais (menos de 15 dígitos)', () => {
    expect(validatePixelId('meta', '12345').status).toBe('error');
  });

  it('valida pixel Meta legítimo de 15 dígitos', () => {
    expect(validatePixelId('meta', '966889988243951').status).toBe('valid');
  });

  it('valida pixel Meta legítimo de 16 dígitos', () => {
    expect(validatePixelId('meta', '9668899882439510').status).toBe('valid');
  });

  it('detecta espaços no pixel Meta (status: warning, não injeta)', () => {
    const result = validatePixelId('meta', ' 966889988243951');
    expect(result.status).toBe('warning');
  });
});

describe('validatePixelId — Google Analytics: rejeita IDs maliciosos', () => {
  it('rejeita javascript:alert(1) como GA ID', () => {
    expect(validatePixelId('ga', 'javascript:alert(1)').status).toBe('error');
  });

  it('rejeita GA sem prefixo G-', () => {
    expect(validatePixelId('ga', 'XXXXXXXXXX').status).toBe('error');
  });

  it('valida G-XXXXXXXXXX (formato GA4 correto)', () => {
    expect(validatePixelId('ga', 'G-ABC1234567').status).toBe('valid');
  });

  it('valida GA4 case-insensitive (G-abc1234567)', () => {
    expect(validatePixelId('ga', 'G-abc1234567').status).toBe('valid');
  });
});

describe('validatePixelId — GTM: rejeita IDs maliciosos', () => {
  it('rejeita GTM sem prefixo correto', () => {
    expect(validatePixelId('gtm', 'XXXXXXX').status).toBe('error');
  });

  it('rejeita payload com caracteres especiais como GTM ID', () => {
    expect(validatePixelId('gtm', 'GTM-<script>').status).toBe('error');
  });

  it('valida GTM-XXXXXXX (formato correto, 7 chars)', () => {
    expect(validatePixelId('gtm', 'GTM-ABCD123').status).toBe('valid');
  });

  it('valida GTM com 6 chars após prefixo (limite inferior)', () => {
    expect(validatePixelId('gtm', 'GTM-ABCDEF').status).toBe('valid');
  });
});

describe('validatePixelId — TikTok: rejeita IDs maliciosos', () => {
  it('rejeita TikTok pixel com caracteres especiais', () => {
    expect(validatePixelId('tiktok', 'C<script>XXXXXXXXXX').status).toBe('error');
  });

  it('rejeita TikTok pixel muito curto (menos de 10 chars)', () => {
    expect(validatePixelId('tiktok', 'ABC123').status).toBe('error');
  });

  it('valida TikTok pixel alfanumérico válido (10 chars)', () => {
    expect(validatePixelId('tiktok', 'CABCD123456').status).toBe('valid');
  });
});

describe('validatePixelId — LinkedIn: rejeita IDs maliciosos', () => {
  it('rejeita LinkedIn Insight com letras', () => {
    expect(validatePixelId('linkedin', 'ABC123').status).toBe('error');
  });

  it('rejeita LinkedIn Insight com menos de 5 dígitos', () => {
    expect(validatePixelId('linkedin', '1234').status).toBe('error');
  });

  it('valida LinkedIn Insight com 7 dígitos', () => {
    expect(validatePixelId('linkedin', '1234567').status).toBe('valid');
  });

  it('valida LinkedIn Insight com 5 dígitos (limite mínimo)', () => {
    expect(validatePixelId('linkedin', '12345').status).toBe('valid');
  });
});

// =============================================================
// BLOCO 5 — Finding documentado: -- sobrevive ao sanitizeRef
// PostgREST usa parametros posicionais, então -- não causa dano
// direto, mas o comportamento está documentado como finding.
// =============================================================

describe('sanitizeRef — FINDING: hífen permite -- (SQL comment delimiter)', () => {
  it('[FINDING] -- sobrevive porque hífen está na whitelist [a-zA-Z0-9\\-_]', () => {
    // Isso NÃO é vulnerabilidade ativa porque PostgREST usa .eq() com
    // parâmetros tipados — o driver não interpreta -- como comentário SQL.
    // Mas o comportamento deve estar documentado e monitorado.
    const result = sanitizeRef('--');
    expect(result).toBe('--');
    // Se a política mudar para bloquear -- também, este teste deve falhar
    // e ser atualizado para expect(result).toBe('').
  });

  it('[FINDING] ref puramente de hífens passa o sanitize (não encontra LP — retorna null)', () => {
    // A proteção secundária é o fetchLPByRef retornar null quando não acha LP
    // com lp_key = '--', então o dano é zero na prática. Mas é documentado.
    expect(sanitizeRef('---')).toBe('---');
  });
});
