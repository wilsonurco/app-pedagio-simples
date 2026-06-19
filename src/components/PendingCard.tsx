import { StyleSheet, Text, View } from 'react-native';

import { formatBRL } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PendingCardProps = {
  amount: number;
  dueLabel?: string;
};

export function PendingCard({ amount, dueLabel = 'Vence em 3 dias' }: PendingCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Pendente</Text>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{dueLabel}</Text>
        </View>
      </View>

      <Text
        style={styles.amount}
        accessibilityLabel={`Valor pendente de ${formatBRL(amount)}`}
      >
        {formatBRL(amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
  },
  statusPill: {
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  statusText: {
    ...fonts.medium,
    fontSize: fontSize.caption,
    color: colors.systemOrange,
  },
  amount: {
    ...fonts.bold,
    fontSize: fontSize.largeTitle,
    color: colors.label,
    letterSpacing: -0.5,
  },
});
