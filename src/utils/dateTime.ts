/** Formatos padrão: DD/MM/AAAA e DD/MM/AAAA HH:mm:ss (24h). */

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

export function compareAppDateTime(a: string, b: string): number {
  const dateA = Date.parse(a) || 0;
  const dateB = Date.parse(b) || 0;
  return dateA - dateB;
}
