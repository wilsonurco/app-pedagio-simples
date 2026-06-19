import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { PayButton } from '@/components/PayButton';
import { formatBRL, paymentMethods, pendingAmount } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Status = 'idle' | 'processing' | 'success';

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(paymentMethods[0].id);
  const [status, setStatus] = useState<Status>('idle');

  function handleConfirm() {
    setStatus('processing');
    setTimeout(() => setStatus('success'), 1400);
  }

  if (status === 'success') {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <View style={styles.successIcon}>
          <MaterialIcons name="check" size={44} color={colors.onPrimary} />
        </View>
        <Text style={styles.successTitle}>Pagamento confirmado</Text>
        <Text style={styles.successSubtitle}>
          {formatBRL(pendingAmount)} foram pagos com sucesso.
        </Text>

        <View style={[styles.footer, styles.successFooter, { paddingBottom: insets.bottom + spacing.md }]}>
          <PayButton label="Concluir" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          hitSlop={12}
          style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
        >
          <MaterialIcons name="close" size={24} color={colors.label} />
        </Pressable>
        <Text style={styles.topTitle}>Pagamento</Text>
        <View style={styles.closeBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total a pagar</Text>
          <Text style={styles.amount}>{formatBRL(pendingAmount)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Forma de pagamento</Text>
        <View style={styles.methods}>
          {paymentMethods.map((method) => {
            const isActive = method.id === selected;
            return (
              <Pressable
                key={method.id}
                onPress={() => setSelected(method.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={method.label}
                style={({ pressed }) => [
                  styles.method,
                  isActive && styles.methodActive,
                  pressed && styles.methodPressed,
                ]}
              >
                <View style={styles.methodIcon}>
                  <MaterialIcons
                    name={method.icon === 'pix' ? 'pix' : method.icon}
                    size={22}
                    color={isActive ? colors.tint : colors.secondaryLabel}
                  />
                </View>
                <View style={styles.methodText}>
                  <Text style={styles.methodLabel}>{method.label}</Text>
                  <Text style={styles.methodDetail}>{method.detail}</Text>
                </View>
                <MaterialIcons
                  name={isActive ? 'radio-button-checked' : 'radio-button-unchecked'}
                  size={22}
                  color={isActive ? colors.tint : colors.tertiaryLabel}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PayButton
          label={`Pagar ${formatBRL(pendingAmount)}`}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    backgroundColor: colors.fill,
  },
  topTitle: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  amountCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  amountLabel: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
  },
  amount: {
    ...fonts.bold,
    fontSize: fontSize.largeTitle,
    color: colors.tint,
    letterSpacing: -0.5,
  },
  sectionTitle: {
    ...fonts.semibold,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  methods: {
    gap: spacing.md,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  methodActive: {
    backgroundColor: 'rgba(91, 46, 140, 0.08)',
  },
  methodPressed: {
    opacity: 0.9,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodText: {
    flex: 1,
    gap: 2,
  },
  methodLabel: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
  },
  methodDetail: {
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
});
