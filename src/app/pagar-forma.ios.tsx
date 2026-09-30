import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Form,
  Host,
  LabeledContent,
  Section,
  Text,
  Toggle,
} from '@expo/ui/swift-ui';
import {
  buttonStyle,
  controlSize,
  font,
  foregroundStyle,
  tint as tintModifier,
} from '@expo/ui/swift-ui/modifiers';

import { ScreenHost } from '@/components/ios/ScreenHost';
import { usePassages } from '@/context/PassagesContext';
import { formatBRL, paymentMethods, sumPassagesAmount } from '@/data/mock';
import { navigateBack, navigateHome } from '@/utils/navigation';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

const TINT = tintModifier(colors.tint);

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
    if (selectedIds.length === 0 || status === 'processing') return;
    setStatus('processing');
    setTimeout(() => {
      markAsPaid(selectedIds, selectedMethodLabel);
      setStatus('success');
    }, 1400);
  }

  if (selectedIds.length === 0) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <RNText style={styles.emptyTitle}>Nenhuma passagem selecionada</RNText>
        <RNText style={styles.emptySubtitle}>Volte e escolha as passagens que deseja pagar.</RNText>
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Host matchContents modifiers={[TINT, buttonStyle('borderedProminent'), controlSize('large')]}>
            <Button
              label="Voltar"
              onPress={() =>
                navigateBack({ fallback: '/pagar', params: { selected: selectedParam } })
              }
            />
          </Host>
        </View>
      </View>
    );
  }

  if (status === 'success') {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <RNText style={styles.successTitle}>Pagamento confirmado</RNText>
        <RNText style={styles.successSubtitle}>
          {selectedIds.length}{' '}
          {selectedIds.length === 1 ? 'passagem paga' : 'passagens pagas'} • {formatBRL(total)}
        </RNText>
        {selectedMethodLabel ? (
          <RNText style={styles.successMethod}>via {selectedMethodLabel}</RNText>
        ) : null}

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Host matchContents modifiers={[TINT, buttonStyle('borderedProminent'), controlSize('large')]}>
            <Button label="Concluir" onPress={navigateHome} />
          </Host>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Host matchContents modifiers={[buttonStyle('borderless')]}>
          <Button
            label="Passagens"
            systemImage="chevron.left"
            onPress={() =>
              navigateBack({ fallback: '/pagar', params: { selected: selectedParam } })
            }
          />
        </Host>
        <RNText style={styles.headerTitle}>Forma de pagamento</RNText>
        <View style={styles.headerSpacer} />
      </View>

      <ScreenHost>
        <Form>
          <Section>
            <LabeledContent label="Resumo">
              <Text
                modifiers={[
                  font({ textStyle: 'title2', weight: 'bold' }),
                  foregroundStyle(colors.tint),
                ]}
              >
                {formatBRL(total)}
              </Text>
            </LabeledContent>
            <LabeledContent label="Selecionadas">
              <Text modifiers={[foregroundStyle({ type: 'hierarchical', style: 'secondary' })]}>
                {selectedIds.length}{' '}
                {selectedIds.length === 1 ? 'passagem' : 'passagens'}
              </Text>
            </LabeledContent>
          </Section>

          <Section title="Métodos disponíveis">
            {paymentMethods.map((method) => (
              <Toggle
                key={method.id}
                label={method.label}
                systemImage={
                  method.icon === 'pix'
                    ? 'brazilianrealsign.circle'
                    : method.icon === 'credit-card'
                      ? 'creditcard'
                      : 'building.columns'
                }
                isOn={selectedMethod === method.id}
                onIsOnChange={(isOn) => {
                  if (isOn) setSelectedMethod(method.id);
                }}
              />
            ))}
          </Section>
        </Form>
      </ScreenHost>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Host matchContents modifiers={[TINT, buttonStyle('borderedProminent'), controlSize('large')]}>
          <Button
            label={status === 'processing' ? 'Processando...' : `Pagar ${formatBRL(total)}`}
            systemImage="bolt.fill"
            onPress={handleConfirm}
          />
        </Host>
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
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
  },
  headerSpacer: {
    width: 60,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
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
  },
  successMethod: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
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
  },
});
