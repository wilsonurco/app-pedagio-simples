import { StyleSheet, Text, View } from 'react-native';

import { GroupedList } from '@/components/ui/GroupedList';
import { formatBRL, userProfile } from '@/data/mock';
import { formatDateDisplay } from '@/utils/dateTime';
import {
  formatIdleVehicleHint,
  formatVehicleSummary,
  type DashboardSummary,
} from '@/utils/dashboardSummary';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type DashboardGreetingProps = {
  summary: DashboardSummary;
};

function firstName(fullName: string) {
  return fullName.split(' ')[0];
}

function pendingSubtitle(pendingCount: number) {
  if (pendingCount === 0) return 'Nenhuma passagem pendente';
  if (pendingCount === 1) return '1 passagem pendente';
  return `${pendingCount} passagens pendentes`;
}

export function DashboardGreeting({ summary }: DashboardGreetingProps) {
  const { pendingCount, pendingTotal, vehicleCount, platesWithDebt, dueDateSummary } = summary;
  const showSummaryCard = pendingCount > 0;

  const dueLabel =
    dueDateSummary && dueDateSummary.uniqueCount > 1 ? 'Próximo vencimento' : 'Vencimento';

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, {firstName(userProfile.name)}</Text>
      <Text style={styles.subtitle}>{pendingSubtitle(pendingCount)}</Text>

      {showSummaryCard ? (
        <GroupedList style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Em aberto</Text>
            <Text style={styles.summaryValue}>{formatBRL(pendingTotal)}</Text>
          </View>

          {dueDateSummary ? (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <View style={styles.summaryLabelBlock}>
                  <Text style={styles.summaryLabel}>{dueLabel}</Text>
                  {dueDateSummary.uniqueCount > 1 ? (
                    <Text style={styles.summaryHint}>
                      {dueDateSummary.uniqueCount} datas diferentes
                    </Text>
                  ) : null}
                </View>
                <Text style={[styles.summaryValue, styles.summaryDue]}>
                  {formatDateDisplay(dueDateSummary.earliest)}
                </Text>
              </View>
            </>
          ) : null}

          {vehicleCount > 0 ? (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Veículos</Text>
                <Text style={styles.summaryValue}>
                  {formatVehicleSummary(vehicleCount, platesWithDebt)}
                </Text>
              </View>
            </>
          ) : null}
        </GroupedList>
      ) : vehicleCount > 0 ? (
        <Text style={styles.idleHint}>{formatIdleVehicleHint(vehicleCount)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  greeting: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    letterSpacing: -0.4,
  },
  subtitle: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
  },
  idleHint: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
  },
  summary: {
    marginTop: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 44,
    gap: spacing.md,
  },
  summaryLabelBlock: {
    flex: 1,
    gap: 2,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
    marginLeft: spacing.lg,
  },
  summaryLabel: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.label,
  },
  summaryHint: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
  },
  summaryValue: {
    ...fonts.medium,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
    textAlign: 'right',
  },
  summaryDue: {
    color: colors.systemOrange,
  },
});
