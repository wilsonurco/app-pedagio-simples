import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { PaymentMethodPicker } from '@/components/PaymentMethodPicker';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import {
  Check,
  iconSize,
  iconStrokeActive,
} from '@/components/ui/icons';
import { usePassages } from '@/context/PassagesContext';
import { formatBRL, paymentMethods, sumPassagesAmount } from '@/data/mock';
import { navigateBack, navigateHome } from '@/utils/navigation';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Status = 'idle' | 'processing' | 'success';

export default function PaymentMethodScreen() {
  const insets = useSafeAreaInsets();
  const { selected: selectedParam } = useLocalSearchParams<{ selected?: string }>();
  const { pendingPassages, markAsPaid } = usePassages();

  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);
  const [status, setStatus] = useState<Status>('idle');

  const selectedIds = useMemo(() => {
    if (!selectedParam) return [];
    const pendingIds = pendingPassages.map((p) => p.id);
    return selectedParam.split(',').filter((id) => pendingIds.includes(id));
  }, [selectedParam, pendingPassages]);

  const selectedPassages = useMemo(
    () => pendingPassages.filter((p) => selectedIds.includes(p.id)),
    [pendingPassages, selectedIds],
  );

  const total = sumPassagesAmount(selectedPassages);
  const selectedMethodLabel = paymentMethods.find((m) => m.id === selectedMethod)?.label;

  function handleConfirm() {
    if (selectedIds.length === 0) return;
    setStatus('processing');
    setTimeout(() => {
      markAsPaid(selectedIds);
      setStatus('success');
    }, 1400);
  }

  if (selectedIds.length === 0) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.emptyTitle}>Nenhuma passagem selecionada</Text>
        <Text style={styles.emptySubtitle}>Volte e escolha as passagens que deseja pagar.</Text>
        <View style={[styles.footer, styles.successFooter, { paddingBottom: insets.bottom + spacing.md }]}>
          <PayButton label="Voltar" onPress={() => navigateBack({ fallback: '/pagar', params: { selected: selectedParam } })} />
        </View>
      </View>
    );
  }

  if (status === 'success') {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <View style={styles.successIcon}>
          <Check size={iconSize.xl} color={colors.onPrimary} strokeWidth={iconStrokeActive} />
        </View>
        <Text style={styles.successTitle}>Pagamento confirmado</Text>
        <Text style={styles.successSubtitle}>
          {selectedIds.length}{' '}
          {selectedIds.length === 1 ? 'passagem paga' : 'passagens pagas'} • {formatBRL(total)}
        </Text>
        {selectedMethodLabel ? (
          <Text style={styles.successMethod}>via {selectedMethodLabel}</Text>
        ) : null}

        <View style={[styles.footer, styles.successFooter, { paddingBottom: insets.bottom + spacing.md }]}>
          <PayButton label="Concluir" onPress={navigateHome} />
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

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Resumo</Text>
          <Text style={styles.summaryAmount}>{formatBRL(total)}</Text>
          <Text style={styles.summaryHint}>
            {selectedIds.length}{' '}
            {selectedIds.length === 1 ? 'passagem selecionada' : 'passagens selecionadas'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Métodos disponíveis</Text>
        <PaymentMethodPicker selectedId={selectedMethod} onSelect={setSelectedMethod} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PayButton
          label={`Pagar ${formatBRL(total)}`}
          loading={status === 'processing'}
          onPress={handleConfirm}
        />
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
    fontSize: fontSize.largeTitle,
    color: colors.label,
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
  },
  summaryCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryLabel: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryAmount: {
    ...fonts.bold,
    fontSize: fontSize.title1,
    color: colors.tint,
    letterSpacing: -0.4,
  },
  summaryHint: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
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
  successFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
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
  },
  successMethod: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
    marginTop: spacing.xs,
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
