import { useState, useEffect, useCallback, useRef } from 'react';
import { LPContent } from '@/lib/cms-v2/cms-types';
import { useCMSSync } from './useCMSSync';

type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'success' | 'error';

/**
 * Hook de edição V2 Production — Save Manual (V2.0)
 *
 * Expõe updateField e updateNestedField com a mesma assinatura da V1.
 * Modelo linear: cada LP é um JSON isolado, sem herança, sem merge.
 * Inclui proteção de imagens contra race condition.
 *
 * SAVE MANUAL: Não há auto-save. O usuário salva via botão ou ⌘S.
 * Cada edição marca isDirty=true e saveStatus='unsaved'.
 */
export const useAdminEditorV2Production = (lpKey: string) => {
  const [draft, setDraft] = useState<LPContent | null>(null);
  const initializedRef = useRef(false);
  const draftRef = useRef<LPContent | null>(null);
  const serverContentRef = useRef<LPContent | null>(null);
  const touchedFieldsRef = useRef<Set<string>>(new Set());
  const slugRef = useRef<string>('');

  const { loadFromDatabase, persistToDatabase, isSyncing, lastSavedAt } = useCMSSync(lpKey);

  // Proteção de imagens — preserva URLs do servidor se o draft as perdeu acidentalmente
  const protectImageFields = useCallback((
    draftContent: LPContent,
    serverContent: LPContent | null
  ): LPContent => {
    if (!serverContent) return draftContent;

    const safe = JSON.parse(JSON.stringify(draftContent)) as LPContent;

    const simpleImageFields: Array<{ section: keyof LPContent; field: string }> = [
      { section: 'hero', field: 'imageDesktop' },
      { section: 'hero', field: 'imageMobile' },
      { section: 'howItWorks', field: 'imageDesktop' },
      { section: 'howItWorks', field: 'imageMobile' },
      { section: 'process', field: 'imageDesktop' },
      { section: 'process', field: 'imageMobile' },
      { section: 'forWhom', field: 'imageDesktop' },
      { section: 'forWhom', field: 'imageMobile' },
      { section: 'about', field: 'imageDesktop' },
      { section: 'about', field: 'imageMobile' },
      { section: 'whyChoose', field: 'imageDesktop' },
      { section: 'whyChoose', field: 'imageMobile' },
      { section: 'ctaFinal', field: 'imageDesktop' },
      { section: 'ctaFinal', field: 'imageMobile' },
      { section: 'beforeAfter', field: 'imageDesktop' },
      { section: 'beforeAfter', field: 'imageMobile' },
      { section: 'footer', field: 'logo' },
      { section: 'footer', field: 'logoDesktop' },
      { section: 'footer', field: 'logoMobile' },
    ];

    for (const { section, field } of simpleImageFields) {
      const touchKey = `${String(section)}.${field}`;
      if (touchedFieldsRef.current.has(touchKey)) continue;

      const sectionData = safe[section];
      const serverSection = serverContent[section];
      if (typeof sectionData !== 'object' || !sectionData) continue;
      if (typeof serverSection !== 'object' || !serverSection) continue;

      const serverVal = (serverSection as Record<string, unknown>)[field] as string | undefined;
      const draftVal = (sectionData as Record<string, unknown>)[field] as string | undefined;

      if (serverVal && (!draftVal || draftVal === '')) {
        (sectionData as Record<string, unknown>)[field] = serverVal;
      }
    }

    // Proteger arrays de imagem: benefits.items[*].image
    if (!touchedFieldsRef.current.has('benefits.items') && safe.benefits?.items && serverContent.benefits?.items) {
      for (let i = 0; i < Math.min(serverContent.benefits.items.length, safe.benefits.items.length); i++) {
        if (serverContent.benefits.items[i]?.image && (!safe.benefits.items[i]?.image || safe.benefits.items[i]?.image === '')) {
          safe.benefits.items[i].image = serverContent.benefits.items[i].image;
        }
      }
    }

    // Proteger beforeAfter.images[*].before/after
    if (!touchedFieldsRef.current.has('beforeAfter.images') && safe.beforeAfter?.images && serverContent.beforeAfter?.images) {
      for (let i = 0; i < Math.min(serverContent.beforeAfter.images.length, safe.beforeAfter.images.length); i++) {
        const srv = serverContent.beforeAfter.images[i];
        const dft = safe.beforeAfter.images[i];
        if (srv?.before && (!dft?.before || dft.before === '')) dft.before = srv.before;
        if (srv?.after && (!dft?.after || dft.after === '')) dft.after = srv.after;
      }
    }

    // Proteger testimonials.items[*].image
    if (!touchedFieldsRef.current.has('testimonials.items') && safe.testimonials?.items && serverContent.testimonials?.items) {
      for (let i = 0; i < Math.min(serverContent.testimonials.items.length, safe.testimonials.items.length); i++) {
        if (serverContent.testimonials.items[i]?.image && (!safe.testimonials.items[i]?.image || safe.testimonials.items[i]?.image === '')) {
          safe.testimonials.items[i].image = serverContent.testimonials.items[i].image;
        }
      }
    }

    // Proteger speakers.items[*].image
    if (!touchedFieldsRef.current.has('speakers.items') && safe.speakers?.items && serverContent.speakers?.items) {
      for (let i = 0; i < Math.min(serverContent.speakers.items.length, safe.speakers.items.length); i++) {
        if (serverContent.speakers.items[i]?.image && (!safe.speakers.items[i]?.image || safe.speakers.items[i]?.image === '')) {
          safe.speakers.items[i].image = serverContent.speakers.items[i].image;
        }
      }
    }

    // Proteger sponsors.tiers[*].items[*].logo
    if (!touchedFieldsRef.current.has('sponsors.tiers') && safe.sponsors?.tiers && serverContent.sponsors?.tiers) {
      for (let t = 0; t < Math.min(serverContent.sponsors.tiers.length, safe.sponsors.tiers.length); t++) {
        const srvTier = serverContent.sponsors.tiers[t];
        const dftTier = safe.sponsors.tiers[t];
        if (srvTier?.items && dftTier?.items) {
          for (let i = 0; i < Math.min(srvTier.items.length, dftTier.items.length); i++) {
            if (srvTier.items[i]?.logo && (!dftTier.items[i]?.logo || dftTier.items[i]?.logo === '')) {
              dftTier.items[i].logo = srvTier.items[i].logo;
            }
          }
        }
      }
    }

    return safe;
  }, []);

  // Estado local de save manual (sem auto-save)
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Carregamento inicial
  useEffect(() => {
    const init = async () => {
      const record = await loadFromDatabase();
      if (record?.content) {
        setDraft(record.content);
        draftRef.current = record.content;
        serverContentRef.current = record.content;
        slugRef.current = record.slug || '';
        initializedRef.current = true;
      }
    };
    init();
  }, [loadFromDatabase]);

  // Sync draftRef com draft state
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  // ======= API de Edição (compatível com V1) =======

  /**
   * Atualiza um campo direto de uma seção
   * Ex: updateField('hero', 'title', 'Novo título')
   */
  const updateField = useCallback(<T extends keyof LPContent>(
    section: T,
    field: string,
    value: unknown
  ) => {
    touchedFieldsRef.current.add(`${String(section)}.${field}`);

    setDraft(prev => {
      if (!prev) return prev;
      const sectionData = prev[section];

      if (typeof sectionData === 'object' && sectionData !== null && !Array.isArray(sectionData)) {
        const newDraft = {
          ...prev,
          [section]: { ...(sectionData as Record<string, unknown>), [field]: value }
        };
        setIsDirty(true);
        setSaveStatus('unsaved');
        return newDraft as LPContent;
      }
      return prev;
    });
  }, []);

  /**
   * Atualiza um campo aninhado via dot-notation
   * Ex: updateNestedField('hero.ctaPrimary.text', 'Comprar agora')
   */
  const updateNestedField = useCallback((path: string, value: unknown) => {
    const pathParts = path.split('.');
    touchedFieldsRef.current.add(
      pathParts.length >= 2 ? `${pathParts[0]}.${pathParts[1]}` : path
    );

    setDraft(prev => {
      if (!prev) return prev;

      const keys = path.split('.');
      const updatePath = (obj: Record<string, unknown>, pathKeys: string[], idx: number): Record<string, unknown> => {
        if (idx === pathKeys.length - 1) {
          return { ...obj, [pathKeys[idx]]: value };
        }
        const key = pathKeys[idx];
        const child = (obj[key] ?? {}) as Record<string, unknown>;
        return {
          ...obj,
          [key]: updatePath(child, pathKeys, idx + 1)
        };
      };

      const newDraft = updatePath(prev as unknown as Record<string, unknown>, keys, 0) as unknown as LPContent;
      setIsDirty(true);
      setSaveStatus('unsaved');
      return newDraft;
    });
  }, []);

  /**
   * Atualiza uma seção inteira (para arrays, sectionOrder, etc.)
   * Resolve bug C1: não faz spread em arrays
   */
  const updateSection = useCallback(<T extends keyof LPContent>(
    section: T,
    data: LPContent[T]
  ) => {
    touchedFieldsRef.current.add(String(section));

    setDraft(prev => {
      if (!prev) return prev;
      const newDraft = { ...prev, [section]: data };
      setIsDirty(true);
      setSaveStatus('unsaved');
      return newDraft;
    });
  }, []);

  /**
   * Save manual (botão "Salvar" ou ⌘S)
   */
  const saveNow = useCallback(async () => {
    if (!draftRef.current) return false;
    setSaveStatus('saving');
    const safeDraft = protectImageFields(draftRef.current, serverContentRef.current);
    const success = await persistToDatabase(safeDraft);
    if (success) {
      serverContentRef.current = safeDraft;
      touchedFieldsRef.current.clear();
      setIsDirty(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
      // Invalidar cache público da LP (por lp_key E slug — CMSProvider usa slug como key)
      try {
        localStorage.removeItem(`cms_v2_cache_${lpKey}`);
        if (slugRef.current && slugRef.current !== lpKey) {
          localStorage.removeItem(`cms_v2_cache_${slugRef.current}`);
        }
      } catch { /* ignore */ }
    } else {
      setSaveStatus('error');
    }
    return success;
  }, [persistToDatabase, protectImageFields]);

  // Listener ⌘S — dispara save via hotkey:save do useGlobalHotkeys
  useEffect(() => {
    const handleHotkeySave = () => {
      if (draftRef.current && isDirty) {
        saveNow();
      }
    };
    window.addEventListener('hotkey:save', handleHotkeySave);
    return () => window.removeEventListener('hotkey:save', handleHotkeySave);
  }, [saveNow, isDirty]);

  return {
    draft,
    isDirty,
    isLoading: !initializedRef.current || isSyncing,
    saveStatus,
    lastSavedAt,
    updateField,
    updateNestedField,
    updateSection,
    saveNow
  };
};
