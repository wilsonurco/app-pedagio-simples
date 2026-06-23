import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { HistoryByMonth } from '@/components/HistoryByMonth';
import { HistoryChart } from '@/components/HistoryChart';
import { ScreenTitle } from '@/components/ScreenTitle';
import { usePassages } from '@/context/PassagesContext';
import { useAppTopPadding } from '@/hooks/useAppTopPadding';
import { colors, spacing } from '@/theme/tokens';
import {
  buildMonthlyHistory,
  getDefaultHistoryMonth,
  getLatestMonthWithPassages,
  groupPassagesByMonth,
  type HistoryMonth,
} from '@/utils/history';

export default function HistoryScreen() {
  const topPadding = useAppTopPadding(spacing.sm);
  const { passages } = usePassages();

  const monthlyHistory = useMemo(() => buildMonthlyHistory(passages), [passages]);
  const monthGroups = useMemo(() => groupPassagesByMonth(passages), [passages]);

  const [selectedMonth, setSelectedMonth] = useState<HistoryMonth>(() =>
    getLatestMonthWithPassages(monthGroups) ?? getDefaultHistoryMonth(monthlyHistory),
  );

  useEffect(() => {
    const hasSelected = monthGroups.some((group) => group.month === selectedMonth);
    if (!hasSelected && monthGroups.length > 0) {
      setSelectedMonth(monthGroups[0].month);
    }
  }, [monthGroups, selectedMonth]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPadding, paddingBottom: spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenTitle title="Histórico" subtitle="Gastos e passagens mês a mês" />

      <HistoryChart
        data={monthlyHistory}
        selectedMonth={selectedMonth}
        onSelectMonth={(label) => setSelectedMonth(label as HistoryMonth)}
        showTitle={false}
      />

      <HistoryByMonth groups={monthGroups} selectedMonth={selectedMonth} />
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
