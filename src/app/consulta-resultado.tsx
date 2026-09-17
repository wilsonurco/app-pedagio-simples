import { Redirect, router, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { TransactionList } from '@/components/TransactionList';
import { usePassages } from '@/context/PassagesContext';
import { useVehicles } from '@/context/VehiclesContext';
import { formatBRL } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export default function ConsultaResultadoScreen() {
  const insets = useSafeAreaInsets();
  const { pendingPassages, pendingTotal, lastConsultedPlate, loadError } = usePassages();
  const { addVehicle } = useVehicles();

  if (!lastConsultedPlate) {
    return <Redirect href={'/consulta-placa' as Href} />;
  }

  const platePassages = pendingPassages.filter((passage) => passage.plate === lastConsultedPlate);
  const plateTotal = platePassages.reduce((sum, passage) => sum + passage.amount, 0);
  const hasPending = platePassages.length > 0;

  function handleRegister() {
    if (!lastConsultedPlate) return;
    addVehicle({
      plate: lastConsultedPlate,
      model: lastConsultedPlate,
      categoryId: '1',
    });
    router.replace('/');
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
        <ScreenBackButton label="Consulta" fallback={'/consulta-placa' as Href} />
        <ScreenTitle
          title={`Placa ${lastConsultedPlate}`}
          subtitle="Débitos desta placa"
        />

        {loadError ? (
          <Text style={styles.error}>{loadError}</Text>
        ) : hasPending ? (
          <>
            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>Débitos encontrados</Text>
              <Text style={styles.summaryValue}>{formatBRL(plateTotal || pendingTotal)}</Text>
              <Text style={styles.summaryHint}>
                {platePassages.length} {platePassages.length === 1 ? 'passagem' : 'passagens'} na
                API
              </Text>
            </View>
            <TransactionList
              filter="pending"
              title="Passagens da consulta"
              plate={lastConsultedPlate}
            />
          </>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nenhum débito pendente</Text>
            <Text style={styles.emptyBody}>
              A API respondeu para esta placa, mas não há transações disponíveis no momento.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <PayButton label="Cadastrar esta placa" onPress={handleRegister} />
      </View>
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
  error: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.systemRed,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.groupedBackground,
  },
});
