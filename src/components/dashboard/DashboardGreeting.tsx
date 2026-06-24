import { StyleSheet, Text, View } from 'react-native';

import { GroupedList } from '@/components/ui/GroupedList';
import { formatBRL, userProfile } from '@/data/mock';
import { formatDateDisplay } from '@/utils/dateTime';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type DashboardGreetingProps = {
  pendingCount: number;
  pendingTotal: number;
  dueDate?: string;
  vehicleCount?: number;
};

function firstName(fullName: string) {
  return fullName.split(' ')[0];
}

export function DashboardGreeting({
  pendingCount,
  pendingTotal,
  dueDate = '11/07/2026',
  vehicleCount = 1,
}: DashboardGreetingProps) {
  const subtitle =
    pendingCount === 1
      ? '1 passagem pendente'
      : `${pendingCount} passagens pendentes`;

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, {firstName(userProfile.name)}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <GroupedList style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Em aberto</Text>
          <Text style={styles.summaryValue}>{formatBRL(pendingTotal)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Vencimento</Text>
          <Text style={[styles.summaryValue, styles.summaryDue]}>
            {formatDateDisplay(dueDate)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Veículos</Text>
          <Text style={styles.summaryValue}>
            {vehicleCount} {vehicleCount === 1 ? 'cadastrado' : 'cadastrados'}
          </Text>
        </View>
      </GroupedList>
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
  summaryValue: {
    ...fonts.medium,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
    fontVariant: ['tabular-nums'],
  },
  summaryDue: {
    color: colors.systemOrange,
  },
});
