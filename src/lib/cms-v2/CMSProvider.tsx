import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import * as Sentry from "@sentry/react";
import { LPContent } from './cms-types';
import { fetchLPByRef } from './cms-api';
import { hexToHSL, adjustHSL, setHSLVar, resolveSafeFont } from './design-utils';

const CACHE_TTL_MS = 60 * 1000; // 1 minuto
const REFETCH_COOLDOWN_MS = 30_000; // 30s cooldown entre fetches

interface CacheEntryV2 {
  content: LPContent;
  timestamp: number;
}

const getCacheV2 = (lpKey: string): LPContent | null => {
  try {
    const raw = localStorage.getItem(`cms_v2_cache_${lpKey}`);
    if (!raw) return null;
    const entry: CacheEntryV2 = JSON.parse(raw);
    // Validar TTL — cache expirado é descartado
    if (!entry.timestamp || Date.now() - entry.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(`cms_v2_cache_${lpKey}`);
      return null;
    }
    return entry.content;
  } catch {
    localStorage.removeItem(`cms_v2_cache_${lpKey}`);
    return null;
  }
};

const setCacheV2 = (lpKey: string, content: LPContent): void => {
  try {
    const entry: CacheEntryV2 = { content, timestamp: Date.now() };
    localStorage.setItem(`cms_v2_cache_${lpKey}`, JSON.stringify(entry));
  } catch {
    // Storage full or blocked, ignore
  }
};

interface CMSContextValueV2 {
  content: LPContent | null;
  lpKey: string;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CMSContextV2 = createContext<CMSContextValueV2 | undefined>(undefined);

/**
 * CMSProviderV2 — 100% isolado da V1
 * Zero imports de @/lib/cms ou @/lib/cms-types
 * Carrega content direto de bd_cms_lp_v2 e aplica design tokens via CSS variables
 */
export const CMSProviderV2 = ({ children, lpKey }: { children: ReactNode; lpKey: string }) => {
  const [content, setContent] = useState<LPContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef(0);

  const load = useCallback(async (): Promise<void> => {
    lastFetchRef.current = Date.now();
    // Retry com backoff exponencial (3 tentativas)
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const record = await fetchLPByRef(lpKey);
        if (record?.content) {
          setContent(record.content);
          setCacheV2(lpKey, record.content);
          setError(null);
          return;
        }
      } catch (err) {
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
          continue;
        }
        Sentry.captureException(err, { extra: { context: 'CMSProviderV2.load', lpKey, attempt } });
      }
    }
    setError('LP não encontrada ou sem conteúdo.');
  }, [lpKey]);

  useEffect(() => {
    setIsLoading(true);

    // UX Speed: load from cache first (com TTL)
    const cached = getCacheV2(lpKey);
    if (cached) {
      setContent(cached);
    }

    // Truth: always fetch from DB and overwrite
    load().finally(() => setIsLoading(false));
  }, [lpKey, load]);

  // Refetch quando o usuário volta pro tab (com cooldown de 30s)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastFetchRef.current < REFETCH_COOLDOWN_MS) return;
      load();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [load]);

  // Apply design tokens as CSS variables — ALL editor fields
  useEffect(() => {
    if (!content?.design) return;

    const { design } = content;
    const root = document.documentElement;

    // ── DS tokens (using extracted design-utils) ──
    const setVar = (varName: string, hex: string) => setHSLVar(root, varName, hex);
    if (design.primaryColor) setVar('--ds-color-accent', design.primaryColor);
    if (design.buttonColor) setVar('--ds-color-btn', design.buttonColor);
    if (design.titleColor) setVar('--ds-color-title', design.titleColor);
    if (design.secondaryColor) setVar('--ds-color-secondary', design.secondaryColor);
    if (design.borderColor) setVar('--ds-border-color', design.borderColor);
    if (design.iconColor) setVar('--ds-color-icon', design.iconColor);
    if (design.starColor) setVar('--ds-color-star', design.starColor);

    // Background → DS + Tailwind bridge
    const bgHSL = design.backgroundColor ? setVar('--ds-color-bg', design.backgroundColor) : null;
    if (bgHSL) {
      root.style.setProperty('--background', bgHSL);
      root.style.setProperty('--ds-color-surface', adjustHSL(bgHSL, 5));
      root.style.setProperty('--ds-color-glass', adjustHSL(bgHSL, 3));
      root.style.setProperty('--card', adjustHSL(bgHSL, 5));
      root.style.setProperty('--muted', adjustHSL(bgHSL, 10));
    }

    // Text primary → DS + Tailwind bridge
    const textHex = design.textPrimaryColor || design.titleColor;
    if (textHex) {
      const textHSL = setVar('--ds-color-text', textHex);
      if (textHSL) {
        root.style.setProperty('--foreground', textHSL);
        root.style.setProperty('--card-foreground', textHSL);
      }
    }

    // Text secondary → DS + Tailwind bridge
    if (design.textSecondaryColor) {
      const softHSL = setVar('--ds-color-text-soft', design.textSecondaryColor);
      if (softHSL) {
        root.style.setProperty('--muted-foreground', softHSL);
      }
    }

    // Glass intensity — clamp minimum 0.12 for visibility in dark themes
    if (design.glassIntensity !== undefined) {
      const safeIntensity = Math.max(0.12, design.glassIntensity);
      root.style.setProperty('--ds-glass-opacity', safeIntensity.toString());
    }

    // Card roundness — aligned with editor values (leve/medio/full)
    const roundnessMap: Record<string, string> = {
      leve: '0.5rem',
      medio: '1rem',
      full: '1.5rem',
    };
    if (design.cardRoundness && roundnessMap[design.cardRoundness]) {
      root.style.setProperty('--ds-radius', roundnessMap[design.cardRoundness]);
    }

    // Adaptive shadows & button text — light themes get different treatment
    if (bgHSL) {
      const parts = bgHSL.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
      const bgLightness = parts ? parseInt(parts[3], 10) : 50;
      const isLight = bgLightness > 60;
      const bgHue = parts ? parts[1] : '0';

      // Button text: white for light themes (btn bg is dark), bg color for dark themes (btn bg is bright)
      root.style.setProperty('--ds-color-btn-text', isLight ? '0 0% 100%' : bgHSL);

      // Shadows: stronger for light themes for card visibility
      const shadowColor = isLight
        ? `${bgHue} 30% 50%`   // warm tinted shadow for light themes
        : '0 0% 0%';           // pure black for dark themes
      const shadowSm = isLight ? 0.14 : 0.35;
      const shadowLg = isLight ? 0.22 : 0.45;
      root.style.setProperty('--ds-shadow', `0 4px 24px hsl(${shadowColor} / ${shadowSm})`);
      root.style.setProperty('--ds-shadow-lg', `0 12px 40px hsl(${shadowColor} / ${shadowLg})`);
    }

    // Border opacity — lighter for light themes
    if (bgHSL) {
      const parts = bgHSL.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
      const bgLightness = parts ? parseInt(parts[3], 10) : 50;
      root.style.setProperty('--ds-border-opacity', bgLightness > 60 ? '0.5' : '0.14');
    }

    // Vertical spacing — fixed 100px via CSS global, token removed

    // Font family — sanitized via whitelist + Google Fonts preload
    if (design.fontFamily) {
      const fontName = resolveSafeFont(design.fontFamily);
      const safeFontFamily = `${fontName}, sans-serif`;
      root.style.setProperty('--ds-font-family', safeFontFamily);

      // Scoped to LP content only — do NOT set on document.body (pollutes admin)
      const lpContent = document.querySelector('.lp-v2-content') as HTMLElement | null;
      if (lpContent) {
        lpContent.style.fontFamily = safeFontFamily;
      }

      // Inject Google Fonts stylesheet if not Inter (Inter is system-available on most devices)
      if (fontName !== 'Inter') {
        const fontId = `gfonts-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
        if (!document.getElementById(fontId)) {
          const link = document.createElement('link');
          link.id = fontId;
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
          document.head.appendChild(link);
        }
      }
    }
  }, [content]);

  return (
    <CMSContextV2.Provider value={{ content, lpKey, isLoading, error, refresh: load }}>
      {children}
    </CMSContextV2.Provider>
  );
};

export const useCMSV2 = () => {
  const context = useContext(CMSContextV2);
  if (!context) throw new Error('useCMSV2 deve ser usado dentro de um CMSProviderV2');
  return context;
};
