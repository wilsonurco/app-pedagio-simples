import type { HistoryPoint, Passage } from '@/data/mock';
import { compareAppDateTime, parseAppDateTime } from '@/utils/dateTime';

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

const MONTH_BY_NUMBER: Record<number, HistoryMonth> = {
  1: 'Jan',
  2: 'Fev',
  3: 'Mar',
  4: 'Abr',
  5: 'Mai',
  6: 'Jun',
};

const MONTH_FROM_LEGACY: Record<string, HistoryMonth> = {
  jan: 'Jan',
  fev: 'Fev',
  mar: 'Mar',
  abr: 'Abr',
  mai: 'Mai',
  jun: 'Jun',
};

export function getPassageMonth(date: string): HistoryMonth | null {
  const parsed = parseAppDateTime(date);
  if (parsed) {
    return MONTH_BY_NUMBER[parsed.getMonth() + 1] ?? null;
  }

  const legacyMatch = date.match(/\b(jan|fev|mar|abr|mai|jun)\b/i);
  if (!legacyMatch) return null;
  return MONTH_FROM_LEGACY[legacyMatch[1].toLowerCase()] ?? null;
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
      .sort((a, b) => compareAppDateTime(b.date, a.date));

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
