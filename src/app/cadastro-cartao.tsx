import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { CreditCardForm, SavedCardSummary } from '@/components/payment/CreditCardForm';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { Check, iconSize, iconStrokeActive } from '@/components/ui/icons';
import { usePaymentProfile } from '@/context/PaymentProfileContext';
import { navigateBack } from '@/utils/navigation';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Status = 'idle' | 'success';

export default function CreditCardRegistrationScreen() {
  const insets = useSafeAreaInsets();
  const { savedCard, saveCreditCard } = usePaymentProfile();
  const [status, setStatus] = useState<Status>('idle');
  const [registeredCard, setRegisteredCard] = useState(savedCard);

  function handleSubmit(card: Parameters<typeof saveCreditCard>[0]) {
    saveCreditCard(card);
    setRegisteredCard(card);
    setStatus('success');
  }

  if (status === 'success' && registeredCard) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <View style={styles.successIcon}>
          <Check size={iconSize.xl} color={colors.onTint} strokeWidth={iconStrokeActive} />
        </View>
        <Text style={styles.successTitle}>Cartão cadastrado</Text>
        <Text style={styles.successSubtitle}>Seu cartão está pronto para pagamentos de pedágio.</Text>
        <View style={styles.cardPreview}>
          <SavedCardSummary card={registeredCard} />
        </View>
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <PayButton label="Concluir" onPress={() => navigateBack({ fallback: '/formas-pagamento' })} />
        </View>
      </View>
    );
  }

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
        <ScreenBackButton label="Formas de pagamento" fallback="/formas-pagamento" />
        <ScreenTitle
          title="Cartão de crédito"
          subtitle="Cadastre o cartão que será usado nos pagamentos de pedágio"
        />
        <CreditCardForm initialCard={savedCard} onSubmit={handleSubmit} />
      </ScrollView>
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
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    textAlign: 'center',
  },
  successSubtitle: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  cardPreview: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.groupedBackground,
  },
});
