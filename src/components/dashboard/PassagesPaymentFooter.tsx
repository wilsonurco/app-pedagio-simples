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

  const selectionLabel =
    selectedCount === totalPassages
      ? `${selectedCount} selecionadas`
      : `${selectedCount} de ${totalPassages} selecionadas`;

  return (
    <View style={styles.footer}>
      <View style={styles.summaryRow}>
        <Text style={styles.totalAmount}>{formatBRL(hasSelection ? total : 0)}</Text>
        <Text style={styles.summaryMeta} numberOfLines={2}>
          Total a pagar · {selectionLabel}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 -1px 0 rgba(0, 0, 0, 0.04)' }
      : null),
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    minHeight: 28,
  },
  totalAmount: {
    ...fonts.bold,
    fontSize: fontSize.title3,
    color: colors.label,
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
    flexShrink: 0,
  },
  summaryMeta: {
    flex: 1,
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
    textAlign: 'right',
    lineHeight: 16,
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
