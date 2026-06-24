import { StyleSheet, Text, View } from 'react-native';

import { GroupedList } from '@/components/ui/GroupedList';
import { formatBRL } from '@/data/mock';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PaymentSummaryCardProps = {
  total: number;
  passageCount: number;
};

export function PaymentSummaryCard({ total, passageCount }: PaymentSummaryCardProps) {
  return (
    <GroupedList>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Total selecionado</Text>
          <Text style={styles.amount}>{formatBRL(total)}</Text>
        </View>
        <Text style={styles.hint}>
          {passageCount} {passageCount === 1 ? 'passagem' : 'passagens'}
        </Text>
      </View>
    </GroupedList>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  label: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    marginBottom: 2,
  },
  amount: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
    paddingBottom: 2,
  },
});
