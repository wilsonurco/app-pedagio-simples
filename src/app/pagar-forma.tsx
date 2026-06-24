import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { PaymentMethodPicker } from '@/components/PaymentMethodPicker';
import { PaymentSummaryCard } from '@/components/payment/PaymentSummaryCard';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { paymentMethods } from '@/data/mock';
import { useSelectedPassages } from '@/hooks/useSelectedPassages';
import { navigateBack } from '@/utils/navigation';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export default function PaymentMethodScreen() {
  const insets = useSafeAreaInsets();
  const { selectedParam, pendingSelectedIds, total, canPay } = useSelectedPassages();
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);

  function handleContinue() {
    if (!canPay) return;

    const pathname = selectedMethod === 'pix' ? '/pagar-pix' : '/pagar-cartao';
    router.push({
      pathname,
      params: { selected: pendingSelectedIds.join(',') },
    });
  }

  if (!canPay) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.emptyTitle}>Nenhuma passagem selecionada</Text>
        <Text style={styles.emptySubtitle}>Volte e escolha as passagens que deseja pagar.</Text>
        <View style={[styles.footer, styles.emptyFooter, { paddingBottom: insets.bottom + spacing.md }]}>
          <PayButton
            label="Voltar"
            onPress={() => navigateBack({ fallback: '/pagar', params: { selected: selectedParam } })}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.sm, paddingBottom: spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenBackButton
          label="Passagens"
          fallback="/pagar"
          fallbackParams={{ selected: selectedParam }}
        />

        <View style={styles.header}>
          <Text style={styles.pageTitle}>Forma de pagamento</Text>
          <Text style={styles.pageSubtitle}>Escolha como deseja pagar</Text>
        </View>

        <PaymentSummaryCard total={total} passageCount={pendingSelectedIds.length} />

        <Text style={styles.sectionTitle}>Métodos disponíveis</Text>
        <PaymentMethodPicker selectedId={selectedMethod} onSelect={setSelectedMethod} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PayButton label="Continuar" onPress={handleContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  pageTitle: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
  },
  sectionTitle: {
    ...fonts.semibold,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: -spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  emptyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  emptyTitle: {
    ...fonts.bold,
    fontSize: fontSize.title3,
    color: colors.label,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});
