import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ChevronRight, iconSize, iconStroke } from '@/components/ui/icons';
import { usePassages } from '@/context/PassagesContext';
import { formatBRL } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PendingCardProps = {
  dueLabel?: string;
};

export function PendingCard({ dueLabel = 'Vence em 3 dias' }: PendingCardProps) {
  const { pendingPassages, pendingTotal } = usePassages();
  const count = pendingPassages.length;

  return (
    <Pressable
      onPress={() => router.push('/pagar')}
      accessibilityRole="button"
      accessibilityLabel={`${count} passagens pendentes, total ${formatBRL(pendingTotal)}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Pendente</Text>
          <Text style={styles.count}>
            {count} {count === 1 ? 'passagem' : 'passagens'}
          </Text>
        </View>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{dueLabel}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text
          style={styles.amount}
          accessibilityLabel={`Valor pendente de ${formatBRL(pendingTotal)}`}
        >
          {formatBRL(pendingTotal)}
        </Text>
        <ChevronRight size={iconSize.sm} color={colors.tertiaryLabel} strokeWidth={iconStroke} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  label: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
  },
  count: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
    marginTop: 2,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: {
    ...fonts.bold,
    fontSize: fontSize.largeTitle,
    color: colors.label,
    letterSpacing: -0.5,
  },
});
