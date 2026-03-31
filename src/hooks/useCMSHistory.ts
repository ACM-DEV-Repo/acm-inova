/**
 * Hook para acessar historico de alteracoes do CMS
 * Permite rollback para versoes anteriores
 */
import * as Sentry from '@sentry/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface CMSHistoryEntry {
  id: string;
  table_name: string;
  record_id: string | null;
  record_key: string | null;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'BACKUP';
  old_data: Record<string, Json> | null;
  new_data: Record<string, Json> | null;
  changed_by: string | null;
  changed_at: string;
}

interface UseCMSHistoryOptions {
  tableName: string;
  recordId?: string;
  recordKey?: string;
  limit?: number;
}

/**
 * Hook para listar historico de alteracoes
 * Usa bd_cms_history_v2 (V2 — unica tabela de historico ativa)
 */
export function useCMSHistory(options: UseCMSHistoryOptions) {
  const { tableName, recordId, recordKey, limit = 50 } = options;

  return useQuery({
    queryKey: ['cms-history', tableName, recordId, recordKey, limit],
    queryFn: async () => {
      let query = supabase
        .from('bd_cms_history_v2')
        .select('*')
        .eq('table_name', tableName)
        .order('changed_at', { ascending: false })
        .limit(limit);

      if (recordId) {
        query = query.eq('record_id', recordId);
      }

      if (recordKey) {
        query = query.eq('record_key', recordKey);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as CMSHistoryEntry[];
    },
    staleTime: 1000 * 30,
  });
}

/**
 * Hook para restaurar uma versao anterior (apenas V2)
 */
export function useRestoreVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tableName,
      recordKey,
      dataToRestore
    }: {
      tableName: string;
      recordKey: string;
      dataToRestore: Record<string, Json>;
    }) => {
      const { id, created_at, updated_at, ...cleanData } = dataToRestore;
      void id; void created_at; void updated_at;

      if (tableName === 'bd_cms_lp_v2') {
        const { data, error } = await supabase
          .from('bd_cms_lp_v2')
          .update({ content: cleanData.content as Json })
          .eq('lp_key', recordKey)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      throw new Error(`Restore not supported for table: ${tableName}`);
    },
    onError: (err) => {
      Sentry.captureException(err, { extra: { context: 'useRestoreVersion' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-history'] });
      queryClient.invalidateQueries({ queryKey: ['cms-v2'] });
    },
  });
}

/**
 * Utilitario para comparar duas versoes e gerar diff
 */
export function generateDiff(
  oldData: Record<string, Json> | null,
  newData: Record<string, Json> | null
): { added: string[]; removed: string[]; changed: string[] } {
  const added: string[] = [];
  const removed: string[] = [];
  const changed: string[] = [];

  const oldKeys = new Set(Object.keys(oldData || {}));
  const newKeys = new Set(Object.keys(newData || {}));

  for (const key of newKeys) {
    if (!oldKeys.has(key)) {
      added.push(key);
    } else if (JSON.stringify(oldData?.[key]) !== JSON.stringify(newData?.[key])) {
      changed.push(key);
    }
  }

  for (const key of oldKeys) {
    if (!newKeys.has(key)) {
      removed.push(key);
    }
  }

  return { added, removed, changed };
}
