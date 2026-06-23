/** Formatos padrão: DD/MM/AAAA e DD/MM/AAAA HH:mm:ss (24h). */

const MONTH_ABBR: Record<string, number> = {
  jan: 1,
  fev: 2,
  mar: 3,
  abr: 4,
  mai: 5,
  jun: 6,
  jul: 7,
  ago: 8,
  set: 9,
  out: 10,
  nov: 11,
  dez: 12,
};

const APP_DATE_TIME_PATTERN =
  /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
const LEGACY_DATE_TIME_PATTERN = /^(\d{1,2})\s+(\w{3}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)$/i;
const HOJE_PATTERN = /^Hoje,\s*(\d{1,2}:\d{2}(?::\d{2})?)$/i;

export function formatAppDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatAppTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function formatAppDateTime(date: Date): string {
  return `${formatAppDate(date)} ${formatAppTime(date)}`;
}

export function formatNowForPassage(): string {
  return formatAppDateTime(new Date());
}

export function parseAppDateTime(value: string): Date | null {
  const trimmed = value.trim();

  const appMatch = trimmed.match(APP_DATE_TIME_PATTERN);
  if (appMatch) {
    const [, dd, mm, yyyy, hh = '0', min = '0', sec = '0'] = appMatch;
    return new Date(+yyyy, +mm - 1, +dd, +hh, +min, +sec);
  }

  const legacyMatch = trimmed.match(LEGACY_DATE_TIME_PATTERN);
  if (legacyMatch) {
    const [, dayStr, monthAbbr, timeStr] = legacyMatch;
    const month = MONTH_ABBR[monthAbbr.toLowerCase()];
    if (!month) return null;
    const [hh, min, sec = '0'] = timeStr.split(':');
    return new Date(2026, month - 1, +dayStr, +hh, +min, +sec);
  }

  const hojeMatch = trimmed.match(HOJE_PATTERN);
  if (hojeMatch) {
    const today = new Date();
    const [hh, min, sec = '0'] = hojeMatch[1].split(':');
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      +hh,
      +min,
      +sec,
    );
  }

  return null;
}

export function formatDurationHms(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => value.toString().padStart(2, '0')).join(':');
}

/** Normaliza data para exibição no padrão DD/MM/AAAA. */
export function formatDateDisplay(value?: string | null): string {
  if (!value) return '—';

  const trimmed = value.trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return trimmed;

  const parsed = parseAppDateTime(trimmed);
  if (parsed) return formatAppDate(parsed);

  const dateOnly = trimmed.split(/\s+/)[0];
  return /^\d{2}\/\d{2}\/\d{4}$/.test(dateOnly) ? dateOnly : trimmed;
}

/** Normaliza data/hora para exibição no padrão DD/MM/AAAA HH:mm:ss. */
export function formatDateTimeDisplay(value?: string | null): string {
  if (!value) return '—';

  const trimmed = value.trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return trimmed;

  const hasTime = /\d{1,2}:\d{2}/.test(trimmed);
  const parsed = parseAppDateTime(trimmed);

  if (parsed) {
    return hasTime ? formatAppDateTime(parsed) : formatAppDate(parsed);
  }

  return trimmed;
}

export function compareAppDateTime(a: string, b: string): number {
  const dateA = parseAppDateTime(a)?.getTime() ?? 0;
  const dateB = parseAppDateTime(b)?.getTime() ?? 0;
  return dateA - dateB;
}
