import { useState } from 'react';
import { router } from 'expo-router';
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
import { formatBRL, paymentMethods, pendingAmount } from '@/data/mock';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

const TINT = tintModifier(colors.tint);

type Status = 'idle' | 'processing' | 'success';

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(paymentMethods[0].id);
  const [status, setStatus] = useState<Status>('idle');

  function handleConfirm() {
    if (status === 'processing') return;
    setStatus('processing');
    setTimeout(() => setStatus('success'), 1400);
  }

  if (status === 'success') {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <RNText style={styles.successTitle}>Pagamento confirmado</RNText>
        <RNText style={styles.successSubtitle}>
          {formatBRL(pendingAmount)} foram pagos com sucesso.
        </RNText>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Host matchContents modifiers={[TINT, buttonStyle('borderedProminent'), controlSize('large')]}>
            <Button label="Concluir" onPress={() => router.back()} />
          </Host>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Host matchContents modifiers={[buttonStyle('borderless')]}>
          <Button label="Fechar" systemImage="xmark" onPress={() => router.back()} />
        </Host>
        <RNText style={styles.headerTitle}>Pagamento</RNText>
        <View style={styles.headerSpacer} />
      </View>

      <ScreenHost>
        <Form>
          <Section>
            <LabeledContent label="Total a pagar">
              <Text
                modifiers={[
                  font({ textStyle: 'title2', weight: 'bold' }),
                  foregroundStyle(colors.tint),
                ]}
              >
                {formatBRL(pendingAmount)}
              </Text>
            </LabeledContent>
          </Section>

          <Section title="Forma de pagamento">
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
                isOn={selected === method.id}
                onIsOnChange={(isOn) => {
                  if (isOn) setSelected(method.id);
                }}
              />
            ))}
          </Section>
        </Form>
      </ScreenHost>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Host matchContents modifiers={[TINT, buttonStyle('borderedProminent'), controlSize('large')]}>
          <Button
            label={status === 'processing' ? 'Processando...' : `Pagar ${formatBRL(pendingAmount)}`}
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
});
