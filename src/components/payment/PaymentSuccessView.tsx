import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { Check, iconSize, iconStrokeActive } from '@/components/ui/icons';
import { formatBRL } from '@/data/mock';
import { navigateHome } from '@/utils/navigation';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PaymentSuccessViewProps = {
  passageCount: number;
  total: number;
  paymentMethod: string;
};

export function PaymentSuccessView({ passageCount, total, paymentMethod }: PaymentSuccessViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.icon}>
        <Check size={iconSize.xl} color={colors.onPrimary} strokeWidth={iconStrokeActive} />
      </View>
      <Text style={styles.title}>Pagamento confirmado</Text>
      <Text style={styles.subtitle}>
        {passageCount} {passageCount === 1 ? 'passagem paga' : 'passagens pagas'} • {formatBRL(total)}
      </Text>
      <Text style={styles.method}>via {paymentMethod}</Text>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PayButton label="Concluir" onPress={navigateHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    textAlign: 'center',
  },
  subtitle: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  method: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
    marginTop: spacing.xs,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
});
