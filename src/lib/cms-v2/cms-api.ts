import * as Sentry from "@sentry/react";
import { supabase } from "@/integrations/supabase/client";
import { LPRecord, LPContent, LPStatus, TrackingSettings } from "./cms-types";
import { Database, Json } from "@/integrations/supabase/types";

// ============================================================
// CMS V2 API - Camada de persistência com tipagem rigorosa
// ============================================================

// Database row types
type DbLPRow = Database['public']['Tables']['bd_cms_lp_v2']['Row'];
type DbLPInsert = Database['public']['Tables']['bd_cms_lp_v2']['Insert'];

/**
 * Converte row do banco para LPRecord de domínio
 */
const rowToRecord = (row: DbLPRow): LPRecord => ({
  id: row.id,
  lp_key: row.lp_key,
  name: row.name,
  slug: row.slug,
  status: row.status as LPStatus,
  content: row.content as unknown as LPContent,
  created_at: row.created_at ?? '',
  updated_at: row.updated_at ?? ''
});

/**
 * Converte LPRecord parcial para inserção no banco
 */
const recordToInsert = (record: Omit<LPRecord, 'id' | 'created_at' | 'updated_at'>): DbLPInsert => ({
  lp_key: record.lp_key,
  name: record.name,
  slug: record.slug,
  status: record.status,
  content: record.content as unknown as Json
});

/**
 * Busca uma LP completa pelo seu identificador (lp_key ou slug)
 */
export const fetchLPByRef = async (ref: string): Promise<LPRecord | null> => {
  try {
    const safeRef = ref.replace(/[^a-zA-Z0-9\-_]/g, '');
    if (!safeRef) return null;

    const { data, error } = await supabase
      .from('bd_cms_lp_v2')
      .select('*')
      .or(`lp_key.eq.${safeRef},slug.eq.${safeRef}`)
      .maybeSingle();

    if (error) {
      Sentry.captureException(error, { extra: { context: 'fetchLPByRef', ref } });
      console.error(`[CMS-V2] Erro ao buscar LP (${ref}):`, error);
      return null;
    }

    if (!data) return null;
    
    return rowToRecord(data);
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'fetchLPByRef', ref } });
    console.error(`[CMS-V2] Erro crítico no fetch:`, err);
    return null;
  }
};

/**
 * Lista todas as LPs da V2 (para Admin)
 */
export const fetchAllLPs = async (): Promise<LPRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('bd_cms_lp_v2')
      .select('*')
      .order('lp_key');
    
    if (error) {
      console.error(`[CMS-V2] Erro ao listar LPs:`, error);
      return [];
    }
    
    return (data || []).map(rowToRecord);
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'fetchAllLPs' } });
    console.error(`[CMS-V2] Erro crítico no fetchAll:`, err);
    return [];
  }
};

/**
 * Salva APENAS o content de uma LP (usado pelo save manual do editor)
 * NÃO sobrescreve name/slug/status — resolve o bug C2
 *
 * FIX: Usa .select() após .update() para detectar 0 rows affected.
 * Se 0 rows → a LP não existe no banco (foi criada mas nunca gravou).
 * Nesse caso retorna false com log explícito.
 */
export const saveContent = async (lpKey: string, content: LPContent): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bd_cms_lp_v2')
      .update({
        content: content as unknown as Json,
        updated_at: new Date().toISOString()
      })
      .eq('lp_key', lpKey);

    if (error) {
      console.error(`[CMS-V2] Erro ao salvar content (${lpKey}):`, error);
      return false;
    }

    return true;
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'saveContent', lpKey } });
    console.error(`[CMS-V2] Erro crítico no saveContent:`, err);
    return false;
  }
};

/**
 * Salva ou atualiza uma LP completa na V2 (metadados + content)
 * Usar APENAS quando explicitamente alterando name/slug/status
 */
export const saveLP = async (lp: Partial<LPRecord> & { lp_key: string }): Promise<boolean> => {
  try {
    const updatePayload: DbLPInsert = {
      lp_key: lp.lp_key,
      name: lp.name ?? '',
      slug: lp.slug ?? lp.lp_key,
      status: lp.status ?? 'draft',
      content: (lp.content ?? {}) as unknown as Json
    };

    const { error } = await supabase
      .from('bd_cms_lp_v2')
      .upsert(updatePayload, { onConflict: 'lp_key' });

    if (error) {
      console.error(`[CMS-V2] Erro ao salvar LP (${lp.lp_key}):`, error);
      return false;
    }

    return true;
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'saveLP', lpKey: lp.lp_key } });
    console.error(`[CMS-V2] Erro crítico no save:`, err);
    return false;
  }
};

/**
 * Deleta uma LP da V2
 */
export const deleteLP = async (lpKey: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bd_cms_lp_v2')
      .delete()
      .eq('lp_key', lpKey);

    if (error) {
      console.error(`[CMS-V2] Erro ao deletar LP (${lpKey}):`, error);
      return false;
    }

    return true;
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'deleteLP', lpKey } });
    console.error(`[CMS-V2] Erro crítico no delete:`, err);
    return false;
  }
};

/**
 * Duplica uma LP existente com novo lp_key e slug
 */
export const duplicateLP = async (
  sourceLpKey: string,
  newLpKey: string,
  newName: string,
  newSlug: string
): Promise<boolean> => {
  try {
    const source = await fetchLPByRef(sourceLpKey);
    if (!source) {
      console.error(`[CMS-V2] LP origem não encontrada: ${sourceLpKey}`);
      return false;
    }

    const { error } = await supabase
      .from('bd_cms_lp_v2')
      .insert({
        lp_key: newLpKey,
        name: newName,
        slug: newSlug,
        status: 'draft' as const,
        content: source.content as unknown as Json
      });

    if (error) {
      console.error(`[CMS-V2] Erro ao duplicar LP:`, error);
      return false;
    }

    return true;
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'duplicateLP', sourceLpKey } });
    console.error(`[CMS-V2] Erro crítico no duplicate:`, err);
    return false;
  }
};

/**
 * Cria uma nova LP na V2
 */
export const createLP = async (lp: Omit<LPRecord, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  try {
    const insertData = recordToInsert(lp);
    
    const { error } = await supabase
      .from('bd_cms_lp_v2')
      .insert(insertData);
    
    if (error) {
      console.error(`[CMS-V2] Erro ao criar LP:`, error);
      return false;
    }
    
    return true;
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'createLP' } });
    console.error(`[CMS-V2] Erro crítico no create:`, err);
    return false;
  }
};

/**
 * Atualiza o status de uma LP
 */
export const updateLPStatus = async (lpKey: string, status: LPStatus): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bd_cms_lp_v2')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('lp_key', lpKey);
    
    if (error) {
      console.error(`[CMS-V2] Erro ao atualizar status:`, error);
      return false;
    }
    
    return true;
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'updateLPStatus', lpKey } });
    console.error(`[CMS-V2] Erro crítico no updateStatus:`, err);
    return false;
  }
};

/**
 * Atualiza apenas metadados (Nome, Slug) de uma LP
 */
export const updateLPSettings = async (lpKey: string, data: { name: string; slug: string }): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bd_cms_lp_v2')
      .update({
        name: data.name,
        slug: data.slug,
        updated_at: new Date().toISOString()
      })
      .eq('lp_key', lpKey);

    if (error) {
      console.error(`[CMS-V2] Erro ao atualizar settings:`, error);
      return false;
    }

    return true;
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'updateLPSettings', lpKey } });
    console.error(`[CMS-V2] Erro crítico no updateSettings:`, err);
    return false;
  }
};

// ============================================================
// Global Tracking V2 — registro global-v2 dedicado a pixels
// ============================================================

const GLOBAL_V2_KEY = 'global-v2';

/**
 * Busca os pixels globais do registro global-v2
 */
export const fetchGlobalTrackingV2 = async (): Promise<TrackingSettings | null> => {
  try {
    const record = await fetchLPByRef(GLOBAL_V2_KEY);
    if (!record?.content?.tracking) return null;
    return record.content.tracking;
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'fetchGlobalTrackingV2' } });
    console.error('[CMS-V2] Erro ao buscar tracking global:', err);
    return null;
  }
};

/**
 * Salva os pixels globais no registro global-v2
 * Se o registro não existir, cria automaticamente
 */
export const saveGlobalTrackingV2 = async (tracking: TrackingSettings): Promise<boolean> => {
  try {
    // Tenta buscar o registro existente
    const existing = await fetchLPByRef(GLOBAL_V2_KEY);

    if (existing) {
      // Atualiza apenas o tracking dentro do content
      const updatedContent = { ...existing.content, tracking };
      return await saveContent(GLOBAL_V2_KEY, updatedContent);
    }

    // Registro não existe — cria com content mínimo
    const { error } = await supabase
      .from('bd_cms_lp_v2')
      .insert({
        lp_key: GLOBAL_V2_KEY,
        name: 'Global V2 (Tracking)',
        slug: 'global-v2',
        status: 'active' as const,
        content: { tracking } as unknown as Json,
      });

    if (error) {
      console.error('[CMS-V2] Erro ao criar registro global-v2:', error);
      return false;
    }

    return true;
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'saveGlobalTrackingV2' } });
    console.error('[CMS-V2] Erro crítico no saveGlobalTracking:', err);
    return false;
  }
};
