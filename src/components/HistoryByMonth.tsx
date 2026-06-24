import { StyleSheet, Text, View } from 'react-native';

import { PassageCard } from '@/components/PassageCard';
import { type PassageStatusFilter } from '@/components/PassageStatusFilterTabs';
import { GroupedList } from '@/components/ui/GroupedList';
import { formatBRL } from '@/data/mock';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';
import { MONTH_FULL_NAMES, type MonthPassageGroup } from '@/utils/history';

type HistoryByMonthProps = {
  groups: MonthPassageGroup[];
  selectedMonth?: string | null;
  statusFilter?: PassageStatusFilter;
};

const emptyMessages: Record<PassageStatusFilter, { title: string; subtitle: string }> = {
  all: {
    title: 'Nenhuma passagem neste mês',
    subtitle: 'Selecione outro mês no gráfico acima.',
  },
  paid: {
    title: 'Nenhuma passagem paga neste mês',
    subtitle: 'Tente outro mês ou altere o filtro para ver pendências.',
  },
  pending: {
    title: 'Nenhuma passagem pendente neste mês',
    subtitle: 'Tente outro mês ou altere o filtro para ver pagamentos.',
  },
};

export function HistoryByMonth({ groups, selectedMonth, statusFilter = 'all' }: HistoryByMonthProps) {
  const visibleGroups = selectedMonth
    ? groups.filter((group) => group.month === selectedMonth)
    : groups;

  if (visibleGroups.length === 0) {
    const empty = emptyMessages[statusFilter];
    return (
      <GroupedList>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{empty.title}</Text>
          <Text style={styles.emptySubtitle}>{empty.subtitle}</Text>
        </View>
      </GroupedList>
    );
  }

  return (
    <View style={styles.wrapper}>
      {visibleGroups.map((group) => (
        <View key={group.month} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{MONTH_FULL_NAMES[group.month]}</Text>
            <Text style={styles.sectionTotal}>{formatBRL(group.total)}</Text>
          </View>
          <Text style={styles.sectionHint}>
            {group.passages.length}{' '}
            {group.passages.length === 1 ? 'passagem' : 'passagens'}
          </Text>

          <GroupedList>
            {group.passages.map((passage, index) => (
              <PassageCard
                key={passage.id}
                passage={passage}
                showDivider={index < group.passages.length - 1}
              />
            ))}
          </GroupedList>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...fonts.semibold,
    fontSize: fontSize.title3,
    color: colors.label,
    letterSpacing: -0.3,
  },
  sectionTotal: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
    fontVariant: ['tabular-nums'],
  },
  sectionHint: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
    marginTop: -spacing.xs,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyTitle: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    textAlign: 'center',
  },
});
