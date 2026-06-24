import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { CreditCardForm, SavedCardSummary } from '@/components/payment/CreditCardForm';
import { PaymentSuccessView } from '@/components/payment/PaymentSuccessView';
import { PaymentSummaryCard } from '@/components/payment/PaymentSummaryCard';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { usePassages } from '@/context/PassagesContext';
import { usePaymentProfile } from '@/context/PaymentProfileContext';
import { formatBRL } from '@/data/mock';
import { useSelectedPassages } from '@/hooks/useSelectedPassages';
import { navigateBack } from '@/utils/navigation';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Step = 'register' | 'pay';
type Status = 'idle' | 'processing' | 'success';

type PaymentResult = {
  passageCount: number;
  total: number;
};

export default function CreditCardPaymentScreen() {
  const insets = useSafeAreaInsets();
  const { markAsPaid } = usePassages();
  const { savedCard, saveCreditCard } = usePaymentProfile();
  const { selectedParam, pendingSelectedIds, total, hasSelection, canPay } = useSelectedPassages();

  const [step, setStep] = useState<Step>(savedCard ? 'pay' : 'register');
  const [status, setStatus] = useState<Status>('idle');
  const [editingCard, setEditingCard] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  function handleSaveCard(card: Parameters<typeof saveCreditCard>[0]) {
    saveCreditCard(card);
    setEditingCard(false);
    setStep('pay');
  }

  function handleConfirmPayment() {
    if (!canPay || !savedCard) return;

    setPaymentResult({
      passageCount: pendingSelectedIds.length,
      total,
    });
    setStatus('processing');

    setTimeout(() => {
      markAsPaid(pendingSelectedIds, 'Cartão de crédito');
      setStatus('success');
    }, 1400);
  }

  if (status === 'success' && paymentResult) {
    return (
      <PaymentSuccessView
        passageCount={paymentResult.passageCount}
        total={paymentResult.total}
        paymentMethod="Cartão de crédito"
      />
    );
  }

  if (!hasSelection || (!canPay && status === 'idle')) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.emptyTitle}>
          {hasSelection ? 'Passagens já pagas' : 'Nenhuma passagem selecionada'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {hasSelection
            ? 'Estas passagens já foram quitadas.'
            : 'Volte e escolha as passagens que deseja pagar.'}
        </Text>
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <PayButton label="Voltar" onPress={() => navigateBack({ fallback: '/pagar-forma' })} />
        </View>
      </View>
    );
  }

  const showRegistration = step === 'register' || editingCard;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.sm, paddingBottom: spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenBackButton
          label="Forma de pagamento"
          fallback="/pagar-forma"
          fallbackParams={{ selected: selectedParam }}
        />

        <View style={styles.header}>
          <Text style={styles.pageTitle}>Cartão de crédito</Text>
          <Text style={styles.pageSubtitle}>
            {showRegistration
              ? 'Cadastre seu cartão para concluir o pagamento'
              : 'Confirme os dados do cartão e finalize'}
          </Text>
        </View>

        <PaymentSummaryCard total={total} passageCount={pendingSelectedIds.length} />

        {showRegistration ? (
          <>
            <Text style={styles.sectionTitle}>Cadastro do cartão</Text>
            <CreditCardForm
              initialCard={savedCard}
              onSubmit={handleSaveCard}
              submitLabel={savedCard ? 'Atualizar cartão' : 'Salvar cartão'}
            />
          </>
        ) : (
          savedCard && (
            <>
              <Text style={styles.sectionTitle}>Cartão selecionado</Text>
              <SavedCardSummary card={savedCard} onChangeCard={() => setEditingCard(true)} />
            </>
          )
        )}
      </ScrollView>

      {!showRegistration ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <PayButton
            label={`Pagar ${formatBRL(total)}`}
            loading={status === 'processing'}
            disabled={!savedCard}
            onPress={handleConfirmPayment}
          />
        </View>
      ) : null}
    </KeyboardAvoidingView>
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
