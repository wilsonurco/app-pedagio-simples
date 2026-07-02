import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { RpvActions } from '@/components/RpvActions';
import { Check, iconSize, iconStrokeActive } from '@/components/ui/icons';
import { usePassages } from '@/context/PassagesContext';
import { formatBRL, type Passage } from '@/data/mock';
import { navigateHome } from '@/utils/navigation';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PaymentSuccessViewProps = {
  passageCount: number;
  total: number;
  paymentMethod: string;
  protocol?: string;
  paidPassageIds?: string[];
};

export function PaymentSuccessView({
  passageCount,
  total,
  paymentMethod,
  protocol,
  paidPassageIds = [],
}: PaymentSuccessViewProps) {
  const insets = useSafeAreaInsets();
  const { passages, getPassage } = usePassages();

  const paidPassages = useMemo(() => {
    return paidPassageIds
      .map((id) => getPassage(id))
      .filter((passage): passage is Passage => passage !== undefined && passage.status === 'paid');
  }, [paidPassageIds, passages, getPassage]);

  const showRpvList = paidPassages.length > 0 && paidPassages.length <= 3;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.icon}>
            <Check size={iconSize.xl} color={colors.onPrimary} strokeWidth={iconStrokeActive} />
          </View>
          <Text style={styles.title}>Pagamento confirmado</Text>
          <Text style={styles.subtitle}>
            {passageCount} {passageCount === 1 ? 'passagem paga' : 'passagens pagas'} •{' '}
            {formatBRL(total)}
          </Text>
          <Text style={styles.method}>via {paymentMethod}</Text>
          {protocol ? <Text style={styles.protocol}>Protocolo: {protocol}</Text> : null}
        </View>

        {showRpvList ? (
          <View style={styles.rpvSection}>
            <Text style={styles.rpvSectionTitle}>Registro de Passagem Veicular</Text>
            <Text style={styles.rpvSectionHint}>
              {paidPassages.length === 1
                ? 'Baixe ou compartilhe o RPV da passagem quitada.'
                : 'Baixe ou compartilhe o RPV de cada passagem.'}
            </Text>
            {paidPassages.map((passage) => (
              <RpvActions key={passage.id} passage={passage} compact={paidPassages.length > 1} />
            ))}
          </View>
        ) : paidPassageIds.length > 3 ? (
          <Text style={styles.rpvHint}>
            Os RPVs estão disponíveis no histórico de cada passagem paga.
          </Text>
        ) : null}
      </ScrollView>

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
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
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
  protocol: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.secondaryLabel,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  rpvSection: {
    width: '100%',
    gap: spacing.md,
  },
  rpvSectionTitle: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.label,
    textAlign: 'center',
  },
  rpvSectionHint: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  rpvHint: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
});
