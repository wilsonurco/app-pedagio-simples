import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArrowUpRight, iconStroke } from '@/components/ui/icons';
import { formatBRL } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PassagesPaymentFooterProps = {
  total: number;
  selectedCount: number;
  totalPassages: number;
  hasSelection: boolean;
  onPay: () => void;
};

export function PassagesPaymentFooter({
  total,
  selectedCount,
  totalPassages,
  hasSelection,
  onPay,
}: PassagesPaymentFooterProps) {
  if (totalPassages === 0) return null;

  return (
    <View style={styles.footer}>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total a pagar</Text>
        <Text style={styles.totalHint}>
          {selectedCount} de {totalPassages}{' '}
          {totalPassages === 1 ? 'pendência selecionada' : 'pendências selecionadas'}
        </Text>
      </View>

      <Pressable
        onPress={onPay}
        disabled={!hasSelection}
        accessibilityRole="button"
        accessibilityLabel={`Pagar ${formatBRL(total)}`}
        style={({ pressed }) => [
          styles.payButton,
          !hasSelection && styles.payButtonDisabled,
          pressed && hasSelection && styles.payButtonPressed,
        ]}
      >
        <ArrowUpRight size={18} color={colors.onTint} strokeWidth={iconStroke} />
        <Text style={styles.payButtonText}>Pagar — {formatBRL(hasSelection ? total : 0)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.secondaryBackground,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  totalLabel: {
    ...fonts.medium,
    fontSize: fontSize.caption,
    color: colors.secondaryLabel,
  },
  totalHint: {
    ...fonts.regular,
    fontSize: fontSize.caption2,
    color: colors.tertiaryLabel,
    flexShrink: 1,
    textAlign: 'right',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.payButtonBright,
    borderRadius: radius.lg,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  payButtonPressed: {
    opacity: 0.9,
  },
  payButtonDisabled: {
    opacity: 0.45,
  },
  payButtonText: {
    ...fonts.bold,
    fontSize: fontSize.body,
    color: colors.onTint,
  },
});
