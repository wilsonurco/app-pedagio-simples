import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { HistoryByMonth } from '@/components/HistoryByMonth';
import { HistoryChart } from '@/components/HistoryChart';
import {
  PassageStatusFilterTabs,
  type PassageStatusFilter,
} from '@/components/PassageStatusFilterTabs';
import { ScreenTitle } from '@/components/ScreenTitle';
import { usePassages } from '@/context/PassagesContext';
import { type Passage } from '@/data/mock';
import { useAppTopPadding } from '@/hooks/useAppTopPadding';
import { colors, spacing } from '@/theme/tokens';
import {
  buildMonthlyHistory,
  getDefaultHistoryMonth,
  getLatestMonthWithPassages,
  groupPassagesByMonth,
  type HistoryMonth,
} from '@/utils/history';

function filterPassagesByStatus(passages: Passage[], filter: PassageStatusFilter) {
  if (filter === 'all') return passages;
  if (filter === 'paid') return passages.filter((passage) => passage.status === 'paid');
  return passages.filter((passage) => passage.status === 'pending');
}

export default function HistoryScreen() {
  const topPadding = useAppTopPadding(spacing.sm);
  const { passages } = usePassages();
  const [statusFilter, setStatusFilter] = useState<PassageStatusFilter>('all');

  const filteredPassages = useMemo(
    () => filterPassagesByStatus(passages, statusFilter),
    [passages, statusFilter],
  );

  const monthlyHistory = useMemo(
    () => buildMonthlyHistory(filteredPassages),
    [filteredPassages],
  );

  const monthGroups = useMemo(
    () => groupPassagesByMonth(filteredPassages),
    [filteredPassages],
  );

  const [selectedMonth, setSelectedMonth] = useState<HistoryMonth>(() =>
    getLatestMonthWithPassages(groupPassagesByMonth(passages)) ??
      getDefaultHistoryMonth(buildMonthlyHistory(passages)),
  );

  useEffect(() => {
    const hasSelected = monthGroups.some((group) => group.month === selectedMonth);
    if (!hasSelected) {
      setSelectedMonth(
        getLatestMonthWithPassages(monthGroups) ?? getDefaultHistoryMonth(monthlyHistory),
      );
    }
  }, [monthGroups, monthlyHistory, selectedMonth]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPadding, paddingBottom: spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenTitle title="Histórico" subtitle="Gastos e passagens mês a mês" />

      <PassageStatusFilterTabs value={statusFilter} onChange={setStatusFilter} />

      <HistoryChart
        data={monthlyHistory}
        selectedMonth={selectedMonth}
        onSelectMonth={(label) => setSelectedMonth(label as HistoryMonth)}
        showTitle={false}
      />

      <HistoryByMonth
        groups={monthGroups}
        selectedMonth={selectedMonth}
        statusFilter={statusFilter}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    backgroundColor: colors.groupedBackground,
    flexGrow: 1,
  },
});
