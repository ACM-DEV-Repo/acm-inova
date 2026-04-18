import { describe, it, expect } from 'vitest';
import {
  ensureAllSections,
  getNewLPContent,
  getEventoMedicoContent,
  DEFAULT_LP_TEMPLATE,
} from '@/lib/cms-v2/lp-template';
import type { LPContent } from '@/lib/cms-v2/cms-types';

describe('ensureAllSections', () => {
  // ---- Caso 1: content ja completo nao sofre alteracao ----
  it('deve retornar false quando content ja tem todas as secoes', () => {
    const content = getNewLPContent();
    const changed = ensureAllSections(content);
    expect(changed).toBe(false);
  });

  // ---- Caso 2: secao faltando no content e adicionada ----
  it('deve adicionar secao faltante no content e retornar true', () => {
    const content = getNewLPContent();
    // Remove secao "carousel" do content
    delete (content as Record<string, unknown>)['carousel'];
    expect((content as Record<string, unknown>)['carousel']).toBeUndefined();

    const changed = ensureAllSections(content);

    expect(changed).toBe(true);
    expect(content.carousel).toBeDefined();
    expect(content.carousel.enabled).toBe(false);
    expect(content.carousel.settings).toBeDefined();
  });

  // ---- Caso 3: multiplas secoes faltando ----
  it('deve adicionar varias secoes faltantes de uma vez', () => {
    const content = getNewLPContent();
    delete (content as Record<string, unknown>)['speakers'];
    delete (content as Record<string, unknown>)['sponsors'];
    delete (content as Record<string, unknown>)['video'];

    const changed = ensureAllSections(content);

    expect(changed).toBe(true);
    expect(content.speakers).toBeDefined();
    expect(content.sponsors).toBeDefined();
    expect(content.video).toBeDefined();
  });

  // ---- Caso 4: sectionOrder vazio recebe todas as secoes ----
  it('deve preencher sectionOrder quando esta vazio', () => {
    const content = getNewLPContent();
    content.sectionOrder = [];

    const changed = ensureAllSections(content);

    expect(changed).toBe(true);
    expect(content.sectionOrder.length).toBe(DEFAULT_LP_TEMPLATE.sectionOrder.length);
    // Cada item do template deve estar presente
    for (const key of DEFAULT_LP_TEMPLATE.sectionOrder) {
      expect(content.sectionOrder).toContain(key);
    }
  });

  // ---- Caso 5: secao faltando no sectionOrder mas presente no content ----
  it('deve adicionar secao faltante ao sectionOrder sem duplicar', () => {
    const content = getNewLPContent();
    // Remove "carousel" e "speakers" do sectionOrder
    content.sectionOrder = content.sectionOrder.filter(
      (s) => s !== 'carousel' && s !== 'speakers'
    );

    const changed = ensureAllSections(content);

    expect(changed).toBe(true);
    expect(content.sectionOrder).toContain('carousel');
    expect(content.sectionOrder).toContain('speakers');
    // Sem duplicatas
    const unique = new Set(content.sectionOrder);
    expect(unique.size).toBe(content.sectionOrder.length);
  });

  // ---- Caso 6: secao faltante no content e no sectionOrder ao mesmo tempo ----
  it('deve adicionar secao faltante tanto no content quanto no sectionOrder', () => {
    const content = getNewLPContent();
    delete (content as Record<string, unknown>)['form'];
    content.sectionOrder = content.sectionOrder.filter((s) => s !== 'form');

    const changed = ensureAllSections(content);

    expect(changed).toBe(true);
    expect(content.form).toBeDefined();
    expect(content.sectionOrder).toContain('form');
  });

  // ---- Caso 7: nao altera secoes que nao sao renderizaveis ----
  it('nao deve tentar adicionar design, seo, tracking como secoes faltantes', () => {
    const content = getNewLPContent();
    // Remove design — ensureAllSections NAO deve re-adicionar (nao e secao renderizavel)
    delete (content as Record<string, unknown>)['design'];

    ensureAllSections(content);

    // design NAO e re-adicionado pelo ensureAllSections (filtrado no codigo)
    expect((content as Record<string, unknown>)['design']).toBeUndefined();
  });

  // ---- Caso 8: preserva dados existentes sem sobrescrever ----
  it('deve preservar dados customizados das secoes existentes', () => {
    const content = getNewLPContent();
    content.hero.title = 'Titulo Customizado';
    content.benefits.title = 'Beneficios Especiais';

    // Remove uma outra secao pra forcar changed=true
    delete (content as Record<string, unknown>)['carousel'];

    ensureAllSections(content);

    // Dados originais intactos
    expect(content.hero.title).toBe('Titulo Customizado');
    expect(content.benefits.title).toBe('Beneficios Especiais');
  });
});

describe('getNewLPContent — sectionOrder inclui carousel', () => {
  it('template generico deve incluir carousel no sectionOrder', () => {
    const content = getNewLPContent();
    expect(content.sectionOrder).toContain('carousel');
  });
});

describe('getEventoMedicoContent — sectionOrder inclui carousel', () => {
  it('template de evento medico deve incluir carousel no sectionOrder', () => {
    const content = getEventoMedicoContent();
    expect(content.sectionOrder).toContain('carousel');
  });

  it('template de evento medico deve ter preset summit-saude', () => {
    const content = getEventoMedicoContent();
    expect(content.design.preset).toBe('summit-saude');
  });

  it('template de evento medico deve desativar secoes de servico', () => {
    const content = getEventoMedicoContent();
    expect(content.howItWorks.enabled).toBe(false);
    expect(content.beforeAfter.enabled).toBe(false);
    expect(content.process.enabled).toBe(false);
    expect(content.services.enabled).toBe(false);
    expect(content.whyChoose.enabled).toBe(false);
    expect(content.videoCarousel.enabled).toBe(false);
  });

  it('template de evento medico deve ativar secoes de evento', () => {
    const content = getEventoMedicoContent();
    expect(content.speakers.enabled).toBe(true);
    expect(content.schedule.enabled).toBe(true);
    expect(content.sponsors.enabled).toBe(true);
    expect(content.forWhom.enabled).toBe(true);
  });
});
