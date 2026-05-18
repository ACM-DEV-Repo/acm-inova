import { describe, it, expect } from 'vitest';
import {
  HERO_BACKGROUND_OPTIONS,
  HeroAnimatedBackground,
} from '@/components/landing-v2/HeroBackgrounds';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Map de backgrounds exportado indiretamente — validamos via HERO_BACKGROUND_OPTIONS
// O BACKGROUNDS map nao e exportado, entao validamos que o componente retorna null pra type desconhecido

describe('HERO_BACKGROUND_OPTIONS', () => {
  // ---- Quantidade exata de opcoes ----
  it('deve ter exatamente 10 opcoes de background', () => {
    expect(HERO_BACKGROUND_OPTIONS).toHaveLength(10);
  });

  // ---- Cada opcao tem campos obrigatorios nao-vazios ----
  it.each(HERO_BACKGROUND_OPTIONS.map((o) => [o.value, o]))(
    'opcao "%s" deve ter value, label e description nao-vazios',
    (_value, option) => {
      expect(option.value).toBeTruthy();
      expect(option.value.length).toBeGreaterThan(0);

      expect(option.label).toBeTruthy();
      expect(option.label.length).toBeGreaterThan(0);

      expect(option.description).toBeTruthy();
      expect(option.description.length).toBeGreaterThan(0);
    }
  );

  // ---- Values sao unicos ----
  it('nao deve ter values duplicados', () => {
    const values = HERO_BACKGROUND_OPTIONS.map((o) => o.value);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });

  // ---- Opcao "image" deve existir ----
  it('deve incluir a opcao "image" (upload de foto)', () => {
    const imageOption = HERO_BACKGROUND_OPTIONS.find((o) => o.value === 'image');
    expect(imageOption).toBeDefined();
    expect(imageOption!.label).toBe('Foto');
  });

  // ---- Todos os values animados (exceto image) devem ter componente correspondente ----
  it('todos os values exceto "image" devem renderizar um componente (nao retornar null)', () => {
    const animatedOptions = HERO_BACKGROUND_OPTIONS.filter(
      (o) => o.value !== 'image'
    );

    for (const option of animatedOptions) {
      const html = renderToStaticMarkup(
        createElement(HeroAnimatedBackground, { type: option.value })
      );
      // Se o componente existe no BACKGROUNDS map, ele renderiza HTML (nao retorna null/vazio)
      expect(html.length).toBeGreaterThan(0);
    }
  });
});

describe('HeroAnimatedBackground', () => {
  // ---- Type desconhecido retorna null ----
  it('deve retornar null para type desconhecido', () => {
    const html = renderToStaticMarkup(
      createElement(HeroAnimatedBackground, { type: 'tipo-inexistente' })
    );
    expect(html).toBe('');
  });

  it('deve retornar null para string vazia', () => {
    const html = renderToStaticMarkup(
      createElement(HeroAnimatedBackground, { type: '' })
    );
    expect(html).toBe('');
  });

  // ---- Types validos renderizam conteudo ----
  it('deve renderizar conteudo para type "aurora"', () => {
    const html = renderToStaticMarkup(
      createElement(HeroAnimatedBackground, { type: 'aurora' })
    );
    expect(html.length).toBeGreaterThan(0);
  });

  it('deve renderizar conteudo para type "heartbeat"', () => {
    const html = renderToStaticMarkup(
      createElement(HeroAnimatedBackground, { type: 'heartbeat' })
    );
    expect(html.length).toBeGreaterThan(0);
    // ECG deve conter SVG
    expect(html).toContain('svg');
  });

  it('deve renderizar conteudo para type "gradient-mesh" (neural)', () => {
    const html = renderToStaticMarkup(
      createElement(HeroAnimatedBackground, { type: 'gradient-mesh' })
    );
    expect(html.length).toBeGreaterThan(0);
  });
});
