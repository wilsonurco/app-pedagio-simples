import { router, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { GroupedList } from '@/components/ui/GroupedList';
import { useGuestConsult } from '@/context/GuestConsultContext';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

function pendingLabel(count: number): string {
  if (count === 1) return '1 pendência encontrada';
  return `${count} pendências encontradas`;
}

export default function ConsultaResultadoScreen() {
  const insets = useSafeAreaInsets();
  const { consultedPlate, lookupResult, pendingDebitCount } = useGuestConsult();

  if (!consultedPlate || !lookupResult || lookupResult.found === false) {
    router.replace('/consulta-placa' as Href);
    return null;
  }

  const hasPending = pendingDebitCount > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.sm, paddingBottom: spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenBackButton label="Consulta" fallback={'/consulta-placa' as Href} />
        <ScreenTitle
          title={`Placa ${consultedPlate}`}
          subtitle={`${lookupResult.model} • consulta gratuita`}
        />

        {hasPending ? (
          <GroupedList>
            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>Passagens pendentes</Text>
              <Text style={styles.summaryValue}>{pendingDebitCount}</Text>
              <Text style={styles.summaryHint}>{pendingLabel(pendingDebitCount)}</Text>
            </View>
          </GroupedList>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nenhum débito pendente</Text>
            <Text style={styles.emptyBody}>
              Esta placa não possui passagens aguardando pagamento no momento.
            </Text>
          </View>
        )}

        {hasPending ? (
          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Detalhes disponíveis após o cadastro</Text>
            <Text style={styles.noticeText}>
              Por segurança, valores e informações de cada passagem só ficam visíveis depois que
              você cria sua conta. O cadastro é rápido e seus dados de acesso ficam protegidos no
              servidor.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {hasPending ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <PayButton label="Criar conta para ver e pagar" onPress={() => router.push('/cadastro' as Href)} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  summary: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.xs,
    alignItems: 'center',
  },
  summaryLabel: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  summaryValue: {
    ...fonts.bold,
    fontSize: fontSize.largeTitle,
    color: colors.label,
    fontVariant: ['tabular-nums'],
  },
  summaryHint: {
    ...fonts.medium,
    fontSize: fontSize.subheadline,
    color: colors.tint,
    textAlign: 'center',
  },
  emptyBox: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
  },
  emptyBody: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
    lineHeight: 22,
  },
  notice: {
    backgroundColor: 'rgba(91, 46, 140, 0.06)',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  noticeTitle: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.label,
  },
  noticeText: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
});
