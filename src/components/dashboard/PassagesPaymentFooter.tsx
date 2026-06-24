import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

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
        <View style={styles.totalBlock}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.totalAmount}>{formatBRL(hasSelection ? total : 0)}</Text>
        </View>
        <Text style={styles.totalHint}>
          {selectedCount} de {totalPassages} selecionadas
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
        <Text style={styles.payButtonText}>Pagar agora</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.secondaryBackground,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 -1px 0 rgba(0, 0, 0, 0.04)' }
      : null),
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  totalBlock: {
    gap: 2,
  },
  totalLabel: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  totalAmount: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  totalHint: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
    flexShrink: 1,
    textAlign: 'right',
    paddingBottom: 2,
  },
  payButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tint,
    borderRadius: radius.pill,
    minHeight: 52,
    paddingHorizontal: spacing.xl,
  },
  payButtonPressed: {
    backgroundColor: colors.tintPressed,
  },
  payButtonDisabled: {
    opacity: 0.38,
  },
  payButtonText: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.onTint,
  },
});
