import { describe, it, expect } from 'vitest';
import { ICON_MAP, ICON_CATEGORIES, resolveIcon } from '@/lib/cms-v2/iconResolver';
import { Sparkles, Heart, Shield } from 'lucide-react';

describe('iconResolver', () => {
  // ── resolveIcon: comportamento basico ──
  describe('resolveIcon - comportamento basico', () => {
    it('resolve icone existente no mapa', () => {
      const icon = resolveIcon('heart');
      expect(icon).toBe(Heart);
    });

    it('resolve icone com hifen (composted name)', () => {
      const icon = resolveIcon('heart-pulse');
      expect(icon).toBeDefined();
      expect(typeof icon).toBe('object'); // LucideIcon e um ForwardRefExoticComponent
    });

    it('resolve "shield" para Shield', () => {
      expect(resolveIcon('shield')).toBe(Shield);
    });
  });

  // ── resolveIcon: fallback ──
  describe('resolveIcon - fallback', () => {
    it('retorna Sparkles quando iconName e undefined sem fallback', () => {
      expect(resolveIcon(undefined)).toBe(Sparkles);
    });

    it('retorna Sparkles quando iconName e string vazia sem fallback', () => {
      expect(resolveIcon('')).toBe(Sparkles);
    });

    it('retorna Sparkles quando iconName nao existe no mapa sem fallback', () => {
      expect(resolveIcon('icone-inexistente-xyz')).toBe(Sparkles);
    });

    it('retorna fallback customizado quando iconName e undefined', () => {
      expect(resolveIcon(undefined, Heart)).toBe(Heart);
    });

    it('retorna fallback customizado quando iconName nao existe', () => {
      expect(resolveIcon('nao-existe', Shield)).toBe(Shield);
    });

    it('ignora fallback quando iconName existe no mapa', () => {
      expect(resolveIcon('heart', Shield)).toBe(Heart);
    });
  });

  // ── ICON_MAP: integridade total ──
  describe('ICON_MAP - integridade', () => {
    it('tem pelo menos 100 entradas', () => {
      const count = Object.keys(ICON_MAP).length;
      expect(count).toBeGreaterThanOrEqual(100);
    });

    it('todas as entradas sao componentes Lucide validos (funcao ou ForwardRef)', () => {
      const entries = Object.entries(ICON_MAP);
      for (const [name, component] of entries) {
        expect(
          component,
          `ICON_MAP["${name}"] deveria ser um componente valido`
        ).toBeDefined();
        // LucideIcon e ForwardRefExoticComponent, que e um objeto com $$typeof
        expect(
          typeof component === 'function' || typeof component === 'object',
          `ICON_MAP["${name}"] deveria ser function ou object, recebeu ${typeof component}`
        ).toBe(true);
      }
    });

    it('nao tem valores undefined ou null no mapa', () => {
      for (const [name, component] of Object.entries(ICON_MAP)) {
        expect(component, `ICON_MAP["${name}"] esta undefined/null`).not.toBeNull();
        expect(component, `ICON_MAP["${name}"] esta undefined/null`).not.toBeUndefined();
      }
    });

    it('todas as chaves sao lowercase com hifens', () => {
      for (const name of Object.keys(ICON_MAP)) {
        expect(
          name,
          `Chave "${name}" deveria ser lowercase`
        ).toBe(name.toLowerCase());
        expect(
          /^[a-z0-9-]+$/.test(name),
          `Chave "${name}" deveria conter apenas a-z, 0-9 e hifens`
        ).toBe(true);
      }
    });

    it('resolveIcon resolve todos os icones do ICON_MAP', () => {
      for (const name of Object.keys(ICON_MAP)) {
        const resolved = resolveIcon(name);
        expect(
          resolved,
          `resolveIcon("${name}") retornou undefined`
        ).toBeDefined();
        expect(
          resolved,
          `resolveIcon("${name}") retornou o fallback Sparkles em vez do icone correto`
        ).toBe(ICON_MAP[name]);
      }
    });
  });

  // ── ICON_CATEGORIES: integridade ──
  describe('ICON_CATEGORIES - integridade', () => {
    it('tem pelo menos 8 categorias', () => {
      expect(Object.keys(ICON_CATEGORIES).length).toBeGreaterThanOrEqual(8);
    });

    it('todas as categorias tem pelo menos 1 icone', () => {
      for (const [cat, icons] of Object.entries(ICON_CATEGORIES)) {
        expect(
          icons.length,
          `Categoria "${cat}" esta vazia`
        ).toBeGreaterThan(0);
      }
    });

    it('todos os icones das categorias existem no ICON_MAP', () => {
      for (const [cat, icons] of Object.entries(ICON_CATEGORIES)) {
        for (const iconName of icons) {
          expect(
            ICON_MAP[iconName],
            `Icone "${iconName}" da categoria "${cat}" nao existe no ICON_MAP`
          ).toBeDefined();
        }
      }
    });

    it('nao tem icones duplicados dentro da mesma categoria', () => {
      for (const [cat, icons] of Object.entries(ICON_CATEGORIES)) {
        const unique = new Set(icons);
        expect(
          unique.size,
          `Categoria "${cat}" tem icones duplicados`
        ).toBe(icons.length);
      }
    });

    it('todo icone do ICON_MAP aparece em pelo menos uma categoria', () => {
      const allCategorized = new Set(
        Object.values(ICON_CATEGORIES).flat()
      );
      for (const name of Object.keys(ICON_MAP)) {
        expect(
          allCategorized.has(name),
          `Icone "${name}" do ICON_MAP nao esta em nenhuma categoria`
        ).toBe(true);
      }
    });
  });

  // ── Icones especificos do dominio medico ──
  describe('icones do dominio medico', () => {
    const medicalIcons = [
      'stethoscope', 'brain', 'heart-pulse', 'pill', 'syringe',
      'thermometer', 'hospital', 'ambulance', 'microscope', 'dna',
    ];

    it.each(medicalIcons)('icone medico "%s" existe e resolve corretamente', (name) => {
      expect(ICON_MAP[name]).toBeDefined();
      expect(resolveIcon(name)).toBe(ICON_MAP[name]);
    });
  });
});
