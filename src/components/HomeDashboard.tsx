import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { HistoryChart } from '@/components/HistoryChart';
import { PayButton } from '@/components/PayButton';
import { PendingCard } from '@/components/PendingCard';
import { TransactionList } from '@/components/TransactionList';
import { isFiscalTechEnabled } from '@/config/dataSource';
import { usePassages } from '@/context/PassagesContext';
import { useVehicles } from '@/context/VehiclesContext';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';
import { buildMonthlyHistory } from '@/utils/history';
import { normalizePlate } from '@/services/lookupVehicleByPlate';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { pendingPassages, passages, isLoading, loadError, refreshDebts } = usePassages();
  const { vehicles } = useVehicles();
  const monthlyHistory = buildMonthlyHistory(passages);
  const fiscaltech = isFiscalTechEnabled();

  const vehicleModels = useMemo(
    () =>
      Object.fromEntries(
        vehicles.map((vehicle) => {
          const plate = normalizePlate(vehicle.plate);
          const model = vehicle.model.trim();
          return [plate, model.length >= 2 ? model : plate] as const;
        }),
      ),
    [vehicles],
  );

  useEffect(() => {
    if (!fiscaltech) return;
    if (vehicles.length === 0) return;
    refreshDebts(
      vehicles.map((vehicle) => vehicle.plate),
      { vehicleModels },
    ).catch(() => undefined);
  }, [fiscaltech, vehicles, vehicleModels, refreshDebts]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.sm, paddingBottom: spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Header onPressNotifications={() => router.push('/alertas')} />

        <View style={styles.stack}>
          {fiscaltech ? (
            <Pressable
              onPress={() => router.push('/consulta-placa' as Href)}
              accessibilityRole="button"
              accessibilityLabel="Consultar débitos por placa"
              style={({ pressed }) => [styles.consultCard, pressed && styles.pressed]}
            >
              <Text style={styles.consultTitle}>Consultar débitos</Text>
              <Text style={styles.consultBody}>
                Informe a placa e busque na API Fiscaltech, sem cadastrar o veículo antes.
              </Text>
            </Pressable>
          ) : null}

          {isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.tint} />
              <Text style={styles.loadingText}>Consultando débitos reais...</Text>
            </View>
          ) : null}

          {loadError ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {loadError}
            </Text>
          ) : null}

          {pendingPassages.length > 0 ? <PendingCard /> : null}
          {pendingPassages.length > 0 ? (
            <TransactionList filter="pending" title="Passagens pendentes" />
          ) : fiscaltech && !isLoading && !loadError ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Nenhum débito carregado</Text>
              <Text style={styles.emptyBody}>
                Consulte uma placa para ver os débitos na API.
              </Text>
            </View>
          ) : null}

          {!fiscaltech ? (
            <HistoryChart data={monthlyHistory} onPressDetail={() => router.push('/historico')} />
          ) : null}
        </View>
      </ScrollView>

      {pendingPassages.length > 0 ? (
        <View style={[styles.footer, { paddingBottom: spacing.sm }]}>
          <PayButton onPress={() => router.push('/pagar')} />
        </View>
      ) : fiscaltech ? (
        <View style={[styles.footer, { paddingBottom: spacing.sm }]}>
          <PayButton
            label="Consultar placa"
            onPress={() => router.push('/consulta-placa' as Href)}
          />
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
  },
  stack: {
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  consultCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  consultTitle: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
  },
  consultBody: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
    lineHeight: 22,
  },
  pressed: {
    opacity: 0.65,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  error: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.systemRed,
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
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.groupedBackground,
  },
});
