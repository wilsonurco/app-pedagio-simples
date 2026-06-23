import { StyleSheet, Text, View } from 'react-native';

import { formatBRL } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PaymentSummaryCardProps = {
  total: number;
  passageCount: number;
};

export function PaymentSummaryCard({ total, passageCount }: PaymentSummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Resumo</Text>
      <Text style={styles.amount}>{formatBRL(total)}</Text>
      <Text style={styles.hint}>
        {passageCount} {passageCount === 1 ? 'passagem selecionada' : 'passagens selecionadas'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  amount: {
    ...fonts.bold,
    fontSize: fontSize.title1,
    color: colors.tint,
    letterSpacing: -0.4,
  },
  hint: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
  },
});
