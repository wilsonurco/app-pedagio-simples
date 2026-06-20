import type { HistoryPoint, Passage } from '@/data/mock';

export const HISTORY_MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'] as const;

export type HistoryMonth = (typeof HISTORY_MONTHS)[number];

export const MONTH_FULL_NAMES: Record<HistoryMonth, string> = {
  Jan: 'Janeiro',
  Fev: 'Fevereiro',
  Mar: 'Março',
  Abr: 'Abril',
  Mai: 'Maio',
  Jun: 'Junho',
};

const MONTH_FROM_DATE: Record<string, HistoryMonth> = {
  jan: 'Jan',
  fev: 'Fev',
  mar: 'Mar',
  abr: 'Abr',
  mai: 'Mai',
  jun: 'Jun',
};

export function getPassageMonth(date: string): HistoryMonth | null {
  const match = date.match(/\b(jan|fev|mar|abr|mai|jun)\b/i);
  if (!match) return null;
  return MONTH_FROM_DATE[match[1].toLowerCase()] ?? null;
}

export function buildMonthlyHistory(passages: Passage[]): HistoryPoint[] {
  return HISTORY_MONTHS.map((label) => ({
    label,
    value: passages
      .filter((passage) => getPassageMonth(passage.date) === label)
      .reduce((sum, passage) => sum + passage.amount, 0),
  }));
}

export type MonthPassageGroup = {
  month: HistoryMonth;
  passages: Passage[];
  total: number;
};

export function groupPassagesByMonth(passages: Passage[]): MonthPassageGroup[] {
  return HISTORY_MONTHS.map((month) => {
    const monthPassages = passages
      .filter((passage) => getPassageMonth(passage.date) === month)
      .sort((a, b) => b.date.localeCompare(a.date, 'pt-BR'));

    return {
      month,
      passages: monthPassages,
      total: monthPassages.reduce((sum, passage) => sum + passage.amount, 0),
    };
  })
    .filter((group) => group.passages.length > 0)
    .reverse();
}

export function getDefaultHistoryMonth(history: HistoryPoint[]): HistoryMonth {
  const withValue = [...history].reverse().find((point) => point.value > 0);
  return (withValue?.label as HistoryMonth) ?? 'Jun';
}

export function getLatestMonthWithPassages(groups: MonthPassageGroup[]): HistoryMonth | null {
  return groups[0]?.month ?? null;
}
