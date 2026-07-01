import { StyleSheet, Text, View } from 'react-native';

import { formatBRL, userProfile } from '@/data/mock';
import {
  formatCompactDueHint,
  formatCompactVehicleHint,
  formatIdleVehicleHint,
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

function pendingHeadline(pendingCount: number, pendingTotal: number) {
  if (pendingCount === 0) return 'Nenhuma passagem pendente';
  const countLabel =
    pendingCount === 1 ? '1 passagem pendente' : `${pendingCount} passagens pendentes`;
  return `${countLabel} · ${formatBRL(pendingTotal)}`;
}

export function DashboardGreeting({ summary }: DashboardGreetingProps) {
  const { pendingCount, pendingTotal, vehicleCount, platesWithDebt, dueDateSummary } = summary;

  const metaParts = [
    dueDateSummary ? formatCompactDueHint(dueDateSummary) : undefined,
    formatCompactVehicleHint(vehicleCount, platesWithDebt),
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, {firstName(userProfile.name)}</Text>
      <Text style={styles.headline}>{pendingHeadline(pendingCount, pendingTotal)}</Text>

      {metaParts.length > 0 ? (
        <Text style={styles.meta} numberOfLines={2}>
          {metaParts.join(' · ')}
        </Text>
      ) : pendingCount === 0 && vehicleCount > 0 ? (
        <Text style={styles.meta}>{formatIdleVehicleHint(vehicleCount)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  greeting: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    letterSpacing: -0.4,
  },
  headline: {
    ...fonts.medium,
    fontSize: fontSize.subheadline,
    color: colors.label,
    fontVariant: ['tabular-nums'],
  },
  meta: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
    lineHeight: 18,
  },
});
