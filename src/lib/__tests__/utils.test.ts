import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn (classnames merge)', () => {
  // ── Uso basico ──
  describe('uso basico', () => {
    it('combina duas classes simples', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('retorna string vazia sem argumentos', () => {
      expect(cn()).toBe('');
    });

    it('retorna classe unica quando so uma e passada', () => {
      expect(cn('text-red-500')).toBe('text-red-500');
    });
  });

  // ── Valores falsy ──
  describe('valores falsy', () => {
    it('ignora undefined', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar');
    });

    it('ignora null', () => {
      expect(cn('foo', null, 'bar')).toBe('foo bar');
    });

    it('ignora false', () => {
      expect(cn('foo', false, 'bar')).toBe('foo bar');
    });

    it('ignora string vazia', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar');
    });

    it('ignora 0 (zero)', () => {
      expect(cn('foo', 0, 'bar')).toBe('foo bar');
    });
  });

  // ── Tailwind merge: conflitos ──
  describe('tailwind merge - resolucao de conflitos', () => {
    it('ultima classe de padding vence', () => {
      expect(cn('p-4', 'p-8')).toBe('p-8');
    });

    it('ultima classe de margin vence', () => {
      expect(cn('m-2', 'm-6')).toBe('m-6');
    });

    it('ultima classe de text-color vence', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('ultima classe de bg-color vence', () => {
      expect(cn('bg-white', 'bg-black')).toBe('bg-black');
    });

    it('ultima classe de font-weight vence', () => {
      expect(cn('font-bold', 'font-normal')).toBe('font-normal');
    });

    it('nao conflita padding-x com padding-y', () => {
      const result = cn('px-4', 'py-2');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
    });

    it('nao conflita text-color com text-size', () => {
      const result = cn('text-red-500', 'text-lg');
      expect(result).toContain('text-red-500');
      expect(result).toContain('text-lg');
    });
  });

  // ── Condicional com objeto ──
  describe('condicional com objeto', () => {
    it('inclui classe quando condicao e true', () => {
      expect(cn('base', { 'is-active': true })).toBe('base is-active');
    });

    it('exclui classe quando condicao e false', () => {
      expect(cn('base', { 'is-active': false })).toBe('base');
    });

    it('lida com multiplas condicoes', () => {
      const result = cn('base', {
        'text-red-500': true,
        'font-bold': false,
        'p-4': true,
      });
      expect(result).toContain('base');
      expect(result).toContain('text-red-500');
      expect(result).not.toContain('font-bold');
      expect(result).toContain('p-4');
    });
  });

  // ── Array de classes ──
  describe('array de classes', () => {
    it('aceita array como argumento', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('aceita mix de string e array', () => {
      expect(cn('base', ['extra1', 'extra2'])).toBe('base extra1 extra2');
    });
  });

  // ── Caso real de uso no projeto ──
  describe('casos de uso reais', () => {
    it('merge de classes de componente com override de variant', () => {
      const baseClasses = 'rounded-lg px-4 py-2 bg-primary text-white';
      const variantOverride = 'bg-secondary text-black';
      const result = cn(baseClasses, variantOverride);

      expect(result).toContain('rounded-lg');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('bg-secondary');
      expect(result).toContain('text-black');
      expect(result).not.toContain('bg-primary');
      expect(result).not.toContain('text-white');
    });

    it('override condicional de estado hover/focus', () => {
      const result = cn(
        'hover:bg-gray-100',
        { 'hover:bg-blue-100': true }
      );
      expect(result).toContain('hover:bg-blue-100');
    });
  });
});
