/**
 * CENTRALIZADOR DE TIMEZONE BRASIL
 * Fonte única de verdade para todas as operações de data/hora
 * Timezone: America/Sao_Paulo (GMT-3)
 */

export const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

/**
 * Retorna a data/hora atual no timezone Brasil
 */
export function nowBrazil(): Date {
  const now = new Date();
  // Cria uma string formatada no timezone Brasil e converte de volta para Date
  const brazilDateString = now.toLocaleString('en-US', { timeZone: BRAZIL_TIMEZONE });
  return new Date(brazilDateString);
}

/**
 * Retorna timestamp ISO string ajustado para timezone Brasil
 * Formato: YYYY-MM-DDTHH:mm:ss.sssZ
 */
export function createBrazilTimestamp(): string {
  const now = nowBrazil();
  return now.toISOString();
}

/**
 * Formata data no padrão brasileiro DD/MM/YYYY
 * Aceita Date ou string ISO (para compatibilidade com dados do banco)
 */
export function formatBrazilDate(date: Date | string | null = new Date()): string {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return typeof date === 'string' ? date : '-';
    return dateObj.toLocaleDateString('pt-BR', { timeZone: BRAZIL_TIMEZONE });
  } catch {
    return typeof date === 'string' ? date : '-';
  }
}

/**
 * Formata hora no padrão HH:mm:ss
 */
export function formatBrazilTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('pt-BR', { 
    timeZone: BRAZIL_TIMEZONE, 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Formata data e hora no padrão brasileiro DD/MM/YYYY HH:mm:ss
 */
export function formatBrazilDateTime(date: Date = new Date()): string {
  return `${formatBrazilDate(date)} ${formatBrazilTime(date)}`;
}

/**
 * Converte uma data qualquer para o timezone Brasil
 */
export function toBrazilTimezone(date: Date): Date {
  const brazilDateString = date.toLocaleString('en-US', { timeZone: BRAZIL_TIMEZONE });
  return new Date(brazilDateString);
}

/**
 * Retorna apenas a data no formato YYYY-MM-DD (para campos date do banco)
 */
export function getBrazilDateISO(date: Date = new Date()): string {
  const brazil = toBrazilTimezone(date);
  const year = brazil.getFullYear();
  const month = String(brazil.getMonth() + 1).padStart(2, '0');
  const day = String(brazil.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Retorna apenas a hora no formato HH:mm:ss (para campos time do banco)
 */
export function getBrazilTimeISO(date: Date = new Date()): string {
  const brazil = toBrazilTimezone(date);
  const hours = String(brazil.getHours()).padStart(2, '0');
  const minutes = String(brazil.getMinutes()).padStart(2, '0');
  const seconds = String(brazil.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Formata data curta no padrão DD/MM/YY (para tabelas)
 */
export function formatBrazilDateShort(date: Date): string {
  return date.toLocaleDateString('pt-BR', { 
    timeZone: BRAZIL_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
}

/**
 * Formata data e hora curta no padrão DD/MM/YY HH:mm
 */
export function formatBrazilDateTimeShort(date: Date): string {
  const dateStr = formatBrazilDateShort(date);
  const timeStr = date.toLocaleTimeString('pt-BR', {
    timeZone: BRAZIL_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return `${dateStr} ${timeStr}`;
}

/**
 * Formata data relativa em portugues (ex: "ha 5min", "ha 2h", "ha 3d")
 */
export function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'agora mesmo';
  if (diffMin < 60) return `ha ${diffMin}min`;
  if (diffHrs < 24) return `ha ${diffHrs}h`;
  if (diffDays < 7) return `ha ${diffDays}d`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}
