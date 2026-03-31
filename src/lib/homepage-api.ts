import * as Sentry from "@sentry/react";
import { supabase } from '@/integrations/supabase/client';

// ============================================================
// Homepage API — Controla qual LP é a página principal (limpme.com)
// Tabela: bd_site_homepage (singleton — 1 registro)
// ============================================================

export type HomepageConfig = {
  version: 'v1' | 'v2';
  lp_ref: string; // V1: 'lp01','lp02','lp03' | V2: lp_key da bd_cms_lp_v2
};

export const DEFAULT_HOMEPAGE: HomepageConfig = { version: 'v1', lp_ref: 'lp01' };

/**
 * Busca a configuração da homepage atual.
 * Fallback seguro: retorna V1 lp01 se tabela vazia ou erro.
 */
export async function fetchHomepageConfig(): Promise<HomepageConfig> {
  try {
    const { data, error } = await (supabase as any)
      .from('bd_site_homepage')
      .select('version, lp_ref')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.warn('[Homepage] Fallback para config padrão:', error?.message);
      return DEFAULT_HOMEPAGE;
    }

    const version = data.version as string;
    const lp_ref = data.lp_ref as string;

    if (version !== 'v1' && version !== 'v2') return DEFAULT_HOMEPAGE;
    if (!lp_ref?.trim()) return DEFAULT_HOMEPAGE;

    return { version: version as 'v1' | 'v2', lp_ref };
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'fetchHomepageConfig' } });
    console.error('[Homepage] Erro crítico no fetch:', err);
    return DEFAULT_HOMEPAGE;
  }
}

/**
 * Define qual LP é a homepage.
 * Estratégia: busca o ID existente → UPDATE (não DELETE+INSERT = sem race condition).
 * Se não existir registro, faz INSERT.
 * Valida que a LP existe e está ativa antes de salvar.
 */
export async function setHomepage(
  version: 'v1' | 'v2',
  lpRef: string
): Promise<boolean> {
  try {
    // Validação: verificar se LP existe e está ativa
    if (version === 'v2') {
      const { data: lp, error: lpErr } = await supabase
        .from('bd_cms_lp_v2')
        .select('lp_key, status')
        .eq('lp_key', lpRef)
        .maybeSingle();

      if (lpErr || !lp) {
        console.error('[Homepage] LP V2 não encontrada:', lpRef);
        return false;
      }
      if (lp.status !== 'active') {
        console.error('[Homepage] LP V2 não está ativa:', lpRef, lp.status);
        return false;
      }
    } else if (version === 'v1') {
      const { data: lp, error: lpErr } = await (supabase as any)
        .from('bd_cms_lp')
        .select('lp_key, status')
        .eq('lp_key', lpRef)
        .maybeSingle();

      if (lpErr || !lp) {
        console.error('[Homepage] LP V1 não encontrada:', lpRef);
        return false;
      }
      if ((lp as any).status !== 'active') {
        console.error('[Homepage] LP V1 não está ativa:', lpRef, (lp as any).status);
        return false;
      }
    }

    // Busca o registro existente
    const { data: existing } = await (supabase as any)
      .from('bd_site_homepage')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      // UPDATE no registro existente (sem race condition)
      const { error: updErr } = await (supabase as any)
        .from('bd_site_homepage')
        .update({
          version,
          lp_ref: lpRef,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updErr) {
        console.error('[Homepage] Erro ao atualizar:', updErr);
        return false;
      }
    } else {
      // Tabela vazia: INSERT
      const { error: insErr } = await (supabase as any)
        .from('bd_site_homepage')
        .insert({
          version,
          lp_ref: lpRef,
          updated_at: new Date().toISOString(),
        });

      if (insErr) {
        console.error('[Homepage] Erro ao inserir:', insErr);
        return false;
      }
    }

    return true;
  } catch (err) {
    Sentry.captureException(err, { extra: { context: 'setHomepage', version, lpRef } });
    console.error('[Homepage] Erro crítico no setHomepage:', err);
    return false;
  }
}
