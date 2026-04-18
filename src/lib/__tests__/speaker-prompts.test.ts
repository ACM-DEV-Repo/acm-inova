import { describe, it, expect } from 'vitest';
import { PORTRAIT_PRESETS } from '@/lib/cms-v2/speaker-prompts';

describe('PORTRAIT_PRESETS', () => {
  // ---- Quantidade exata de presets ----
  it('deve ter exatamente 2 presets', () => {
    expect(PORTRAIT_PRESETS).toHaveLength(2);
  });

  // ---- Presets esperados existem ----
  it('deve conter os presets professional e cinematic', () => {
    const keys = PORTRAIT_PRESETS.map((p) => p.key);
    expect(keys).toContain('professional');
    expect(keys).toContain('cinematic');
  });

  // ---- Cada preset tem campos obrigatorios nao-vazios ----
  it.each(PORTRAIT_PRESETS.map((p) => [p.key, p]))(
    'preset "%s" deve ter key, label, description e prompt nao-vazios',
    (_key, preset) => {
      expect(preset.key).toBeTruthy();
      expect(preset.key.length).toBeGreaterThan(0);

      expect(preset.label).toBeTruthy();
      expect(preset.label.length).toBeGreaterThan(0);

      expect(preset.description).toBeTruthy();
      expect(preset.description.length).toBeGreaterThan(0);

      expect(preset.prompt).toBeTruthy();
      expect(preset.prompt.length).toBeGreaterThan(0);
    }
  );

  // ---- Prompts contem instrucao CRITICAL de preservar rosto ----
  it.each(PORTRAIT_PRESETS.map((p) => [p.key, p]))(
    'preset "%s" deve conter "CRITICAL" no prompt (instrucao de preservar rosto)',
    (_key, preset) => {
      expect(preset.prompt).toContain('CRITICAL');
    }
  );

  // ---- Keys sao unicas ----
  it('nao deve ter keys duplicadas', () => {
    const keys = PORTRAIT_PRESETS.map((p) => p.key);
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
  });

  // ---- Prompts mencionam preservacao facial ----
  it('prompt professional deve instruir a nao alterar o rosto', () => {
    const professional = PORTRAIT_PRESETS.find((p) => p.key === 'professional');
    expect(professional).toBeDefined();
    expect(professional!.prompt).toMatch(/Do NOT change the face/i);
  });

  it('prompt cinematic deve instruir a preservar estrutura facial', () => {
    const cinematic = PORTRAIT_PRESETS.find((p) => p.key === 'cinematic');
    expect(cinematic).toBeDefined();
    expect(cinematic!.prompt).toMatch(/Preserve the EXACT face/i);
  });

  // ---- Labels sao em portugues ----
  it('labels devem estar em portugues', () => {
    const professional = PORTRAIT_PRESETS.find((p) => p.key === 'professional');
    const cinematic = PORTRAIT_PRESETS.find((p) => p.key === 'cinematic');
    expect(professional!.label).toBe('Profissional');
    expect(cinematic!.label).toBe('Cinematográfico');
  });
});
