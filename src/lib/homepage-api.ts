import * as Sentry from "@sentry/react";
import { supabase } from '@/integrations/supabase/client';

// ============================================================
// Homepage API — Controla qual LP e a pagina principal
// Tabela: bd_site_homepage (singleton, nao tipada no schema gerado)
// ============================================================

export type HomepageConfig = {
  version: 'v2';
  lp_ref: string;
};

export const DEFAULT_HOMEPAGE: HomepageConfig = { version: 'v2', lp_ref: '' };

// Tipo manual pra tabela bd_site_homepage (nao existe no schema gerado)
interface HomepageRow {
  id: string;
  version: string;
  lp_ref: string;
  updated_at: string;
}

/**
 * Busca a configuracao da homepage atual.
 * Fallback seguro: retorna default se tabela vazia ou erro.
 * Usa rpc generico pra evitar `as any` — a tabela nao esta no types.ts
 */
export async function fetchHomepageConfig(): Promise<HomepageConfig> {
  try {
    const { data, error } = await supabase
      .rpc('get_homepage_config' as never)
      .single();

    // Se RPC nao existir, tenta query direta via REST
    if (error) {
      const response = await fetch(
        `${supabase.supabaseUrl}/rest/v1/bd_site_homepage?select=version,lp_ref&limit=1`,
        {
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
          },
        }
      );

      if (!response.ok) return DEFAULT_HOMEPAGE;

      const rows = await response.json() as HomepageRow[];
      if (!rows?.length) return DEFAULT_HOMEPAGE;

      const row = rows[0];
      if (row.version !== 'v2' || !row.lp_ref?.trim()) return DEFAULT_HOMEPAGE;
      return { version: 'v2', lp_ref: row.lp_ref };
    }

    const row = data as unknown as HomepageRow;
    if (!row || row.version !== 'v2' || !row.lp_ref?.trim()) return DEFAULT_HOMEPAGE;
    return { version: 'v2', lp_ref: row.lp_ref };
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'fetchHomepageConfig' } });
    console.error('[Homepage] Erro critico no fetch:', err);
    return DEFAULT_HOMEPAGE;
  }
}

/**
 * Define qual LP e a homepage.
 * Valida que a LP existe e esta ativa antes de salvar.
 */
export async function setHomepage(lpRef: string): Promise<boolean> {
  try {
    // Validacao: verificar se LP V2 existe e esta ativa
    const { data: lp, error: lpErr } = await supabase
      .from('bd_cms_lp_v2')
      .select('lp_key, status')
      .eq('lp_key', lpRef)
      .maybeSingle();

    if (lpErr || !lp) {
      console.error('[Homepage] LP V2 nao encontrada:', lpRef);
      return false;
    }
    if (lp.status !== 'active') {
      console.error('[Homepage] LP V2 nao esta ativa:', lpRef, lp.status);
      return false;
    }

    // Upsert via REST (tabela fora do schema tipado)
    const response = await fetch(
      `${supabase.supabaseUrl}/rest/v1/bd_site_homepage?on_conflict=id`,
      {
        method: 'POST',
        headers: {
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          version: 'v2',
          lp_ref: lpRef,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      console.error('[Homepage] Erro ao salvar:', response.statusText);
      return false;
    }

    return true;
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'setHomepage', lpRef } });
    console.error('[Homepage] Erro critico no setHomepage:', err);
    return false;
  }
}
