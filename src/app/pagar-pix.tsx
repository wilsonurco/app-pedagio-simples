import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { PaymentErrorBanner } from '@/components/payment/PaymentErrorBanner';
import { PaymentSuccessView } from '@/components/payment/PaymentSuccessView';
import { PaymentSummaryCard } from '@/components/payment/PaymentSummaryCard';
import { PixQrPanel } from '@/components/payment/PixQrPanel';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { QrCode, iconStrokeActive } from '@/components/ui/icons';
import { isFiscalTechEnabled } from '@/config/dataSource';
import { usePassages } from '@/context/PassagesContext';
import { formatBRL } from '@/data/mock';
import { usePaymentReservation } from '@/hooks/usePaymentReservation';
import { useSelectedPassages } from '@/hooks/useSelectedPassages';
import { formatDurationHms } from '@/utils/dateTime';
import { generatePixEmvCode } from '@/utils/pixCode';
import { navigateBack } from '@/utils/navigation';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Status = 'idle' | 'processing' | 'success';

type PaymentResult = {
  passageCount: number;
  total: number;
  protocol?: string;
};

export default function PixPaymentScreen() {
  const insets = useSafeAreaInsets();
  const fiscaltechEnabled = isFiscalTechEnabled();
  const { markAsPaid, refreshDebts } = usePassages();
  const {
    selectedParam,
    selectedIds,
    pendingSelectedIds,
    payableSelectedPassages,
    total,
    hasSelection,
    canPay,
  } = useSelectedPassages();

  const payableIds = payableSelectedPassages.map((passage) => passage.id);
  const passageCount = fiscaltechEnabled ? payableIds.length : pendingSelectedIds.length;

  const reservationFlow = usePaymentReservation({
    passages: payableSelectedPassages,
    enabled: fiscaltechEnabled && canPay,
  });

  const [codeGenerated, setCodeGenerated] = useState(false);
  const [codeSeed, setCodeSeed] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  const emvCode = useMemo(() => {
    if (!codeGenerated) return '';
    return generatePixEmvCode({
      amount: total,
      txId: selectedIds.join('-').slice(0, 25) || undefined,
    });
  }, [codeGenerated, codeSeed, total, selectedIds]);

  function handleGenerateCode() {
    setCodeSeed((current) => current + 1);
    setCodeGenerated(true);
  }

  function handleRegenerateCode() {
    setCodeSeed((current) => current + 1);
  }

  async function handleConfirmPayment() {
    if (!canPay || !codeGenerated) return;

    setPaymentResult({
      passageCount,
      total,
    });
    setStatus('processing');

    try {
      if (fiscaltechEnabled) {
        const response = await reservationFlow.confirmPayment('PIX');
        markAsPaid(payableIds, 'Pix', response.protocolo);
        setPaymentResult({
          passageCount,
          total,
          protocol: response.protocolo,
        });
        setStatus('success');
        return;
      }

      setTimeout(() => {
        markAsPaid(pendingSelectedIds, 'Pix');
        setStatus('success');
      }, 1400);
    } catch {
      setStatus('idle');
    }
  }

  async function handleReservationRecovery() {
    if (reservationFlow.errorAction === 'refresh') {
      const plates = [...new Set(payableSelectedPassages.map((passage) => passage.plate))];
      await refreshDebts(plates).catch(() => undefined);
      navigateBack({ fallback: '/pagar-forma', params: { selected: selectedParam } });
      return;
    }

    if (reservationFlow.errorAction === 'retry-reservation') {
      reservationFlow.resetReservation();
      await reservationFlow.createReservation().catch(() => undefined);
      return;
    }

    navigateBack({ fallback: '/pagar-forma', params: { selected: selectedParam } });
  }

  if (status === 'success' && paymentResult) {
    return (
      <PaymentSuccessView
        passageCount={paymentResult.passageCount}
        total={paymentResult.total}
        paymentMethod="Pix"
        protocol={paymentResult.protocol}
      />
    );
  }

  if (!hasSelection || (!canPay && status === 'idle')) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.emptyTitle}>
          {hasSelection ? 'Passagens indisponíveis' : 'Nenhuma passagem selecionada'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {hasSelection
            ? 'Estas passagens não estão disponíveis para pagamento no momento.'
            : 'Volte e escolha as passagens que deseja pagar.'}
        </Text>
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <PayButton label="Voltar" onPress={() => navigateBack({ fallback: '/pagar-forma' })} />
        </View>
      </View>
    );
  }

  const reservationBlocked =
    fiscaltechEnabled && (reservationFlow.isReserving || !reservationFlow.reservation);

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
          label="Forma de pagamento"
          fallback="/pagar-forma"
          fallbackParams={{ selected: selectedParam }}
        />

        <View style={styles.header}>
          <Text style={styles.pageTitle}>Pagamento via Pix</Text>
          <Text style={styles.pageSubtitle}>
            {codeGenerated
              ? 'Use o QR Code ou copie o código Pix para concluir o pagamento'
              : 'Gere o código Pix para pagar ou compartilhar com quem vai pagar'}
          </Text>
        </View>

        {fiscaltechEnabled && reservationFlow.secondsRemaining !== null ? (
          <Text style={styles.reservationTimer}>
            Reserva válida por {formatDurationHms(reservationFlow.secondsRemaining)}
          </Text>
        ) : null}

        {reservationFlow.errorMessage ? (
          <PaymentErrorBanner
            message={reservationFlow.errorMessage}
            actionLabel={
              reservationFlow.errorAction === 'refresh'
                ? 'Atualizar débitos'
                : reservationFlow.errorAction === 'retry-reservation'
                  ? 'Tentar novamente'
                  : 'Voltar'
            }
            onAction={handleReservationRecovery}
          />
        ) : null}

        <PaymentSummaryCard total={total} passageCount={passageCount} />

        {reservationFlow.isReserving ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.tint} />
            <Text style={styles.loadingText}>Reservando passagens...</Text>
          </View>
        ) : null}

        {!codeGenerated ? (
          <View style={styles.promptCard}>
            <View style={styles.promptIcon}>
              <QrCode size={28} color={colors.tint} strokeWidth={iconStrokeActive} />
            </View>
            <Text style={styles.promptTitle}>Gerar código Pix</Text>
            <Text style={styles.promptBody}>
              Você receberá um QR Code para leitura em outro celular e um código Copia e Cola para colar
              no app do banco.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Código de pagamento</Text>
            <PixQrPanel emvCode={emvCode} amount={total} onRegenerate={handleRegenerateCode} />
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {codeGenerated ? (
          <PayButton
            label={`Confirmar pagamento ${formatBRL(total)}`}
            loading={status === 'processing' || reservationFlow.isConfirming}
            disabled={reservationBlocked}
            onPress={handleConfirmPayment}
          />
        ) : (
          <PayButton
            label="Gerar código Pix"
            disabled={reservationBlocked}
            onPress={handleGenerateCode}
          />
        )}
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
    lineHeight: 21,
  },
  reservationTimer: {
    ...fonts.medium,
    fontSize: fontSize.footnote,
    color: colors.tint,
  },
  sectionTitle: {
    ...fonts.semibold,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: -spacing.sm,
  },
  promptCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  promptIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  promptTitle: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
    textAlign: 'center',
  },
  promptBody: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingBox: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  loadingText: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
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
