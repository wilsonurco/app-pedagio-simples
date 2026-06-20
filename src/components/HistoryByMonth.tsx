import { StyleSheet, Text, View } from 'react-native';

import { PassageCard } from '@/components/PassageCard';
import { formatBRL } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';
import { MONTH_FULL_NAMES, type MonthPassageGroup } from '@/utils/history';

type HistoryByMonthProps = {
  groups: MonthPassageGroup[];
  selectedMonth?: string | null;
};

export function HistoryByMonth({ groups, selectedMonth }: HistoryByMonthProps) {
  const visibleGroups = selectedMonth
    ? groups.filter((group) => group.month === selectedMonth)
    : groups;

  if (visibleGroups.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Nenhuma passagem neste mês</Text>
        <Text style={styles.emptySubtitle}>Selecione outro mês no gráfico acima.</Text>
      </View>
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

          <View style={styles.card}>
            {group.passages.map((passage, index) => (
              <PassageCard
                key={passage.id}
                passage={passage}
                showDivider={index < group.passages.length - 1}
              />
            ))}
          </View>
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
  },
  sectionTotal: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.tint,
  },
  sectionHint: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    marginTop: -spacing.xs,
  },
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  empty: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
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
