import { describe, it, expect } from 'vitest';
import { getNewLPContent } from '@/lib/cms-v2/lp-template';

describe('CarouselSection no LPContent', () => {
  // ---- Content tem secao carousel ----
  it('getNewLPContent deve retornar content com carousel definido', () => {
    const content = getNewLPContent();
    expect(content.carousel).toBeDefined();
  });

  // ---- Carousel tem campos obrigatorios ----
  it('carousel deve ter enabled, title, slides e settings', () => {
    const content = getNewLPContent();
    const { carousel } = content;

    expect(typeof carousel.enabled).toBe('boolean');
    expect(typeof carousel.title).toBe('string');
    expect(Array.isArray(carousel.slides)).toBe(true);
    expect(carousel.settings).toBeDefined();
    expect(typeof carousel.settings).toBe('object');
  });

  // ---- Carousel comeca desabilitado ----
  it('carousel deve comecar desabilitado por padrao', () => {
    const content = getNewLPContent();
    expect(content.carousel.enabled).toBe(false);
  });

  // ---- Slides comeca vazio ----
  it('carousel deve comecar com array de slides vazio', () => {
    const content = getNewLPContent();
    expect(content.carousel.slides).toHaveLength(0);
  });

  // ---- Settings tem todos os campos obrigatorios ----
  it('settings deve ter autoplay, interval, transition, showDots, showArrows e height', () => {
    const content = getNewLPContent();
    const { settings } = content.carousel;

    expect(typeof settings.autoplay).toBe('boolean');
    expect(typeof settings.interval).toBe('number');
    expect(typeof settings.transition).toBe('string');
    expect(typeof settings.showDots).toBe('boolean');
    expect(typeof settings.showArrows).toBe('boolean');
    expect(typeof settings.height).toBe('string');
  });

  // ---- Valores padrao dos settings ----
  it('settings deve ter valores padrao coerentes', () => {
    const content = getNewLPContent();
    const { settings } = content.carousel;

    expect(settings.autoplay).toBe(true);
    expect(settings.interval).toBe(5);
    expect(settings.transition).toBe('slide');
    expect(settings.showDots).toBe(true);
    expect(settings.showArrows).toBe(true);
    expect(settings.height).toBe('md');
  });

  // ---- Settings extras do carousel ----
  it('settings deve ter rounded, overlay, overlayOpacity e pauseOnHover', () => {
    const content = getNewLPContent();
    const { settings } = content.carousel;

    expect(typeof settings.rounded).toBe('boolean');
    expect(typeof settings.overlay).toBe('boolean');
    expect(typeof settings.overlayOpacity).toBe('number');
    expect(typeof settings.pauseOnHover).toBe('boolean');
  });

  // ---- Transition aceita apenas slide ou fade ----
  it('transition padrao deve ser "slide" ou "fade"', () => {
    const content = getNewLPContent();
    expect(['slide', 'fade']).toContain(content.carousel.settings.transition);
  });

  // ---- Height aceita apenas sm, md, lg, xl ----
  it('height padrao deve ser um dos tamanhos validos', () => {
    const content = getNewLPContent();
    expect(['sm', 'md', 'lg', 'xl']).toContain(content.carousel.settings.height);
  });

  // ---- Deep clone — nao compartilha referencia ----
  it('getNewLPContent deve retornar clone independente (sem referencia compartilhada)', () => {
    const content1 = getNewLPContent();
    const content2 = getNewLPContent();

    content1.carousel.title = 'Modificado';
    content1.carousel.settings.interval = 99;

    expect(content2.carousel.title).toBe('');
    expect(content2.carousel.settings.interval).toBe(5);
  });

  // ---- Carousel presente no sectionOrder ----
  it('carousel deve estar presente no sectionOrder', () => {
    const content = getNewLPContent();
    expect(content.sectionOrder).toContain('carousel');
  });

  // ---- footerCta padrao ----
  it('carousel deve ter footerCta com valores padrao', () => {
    const content = getNewLPContent();
    expect(content.carousel.footerCta).toBeDefined();
    expect(content.carousel.footerCta!.enabled).toBe(false);
    expect(content.carousel.footerCta!.text).toBeTruthy();
    expect(content.carousel.footerCta!.link).toBeTruthy();
  });
});
