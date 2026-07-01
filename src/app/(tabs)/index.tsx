import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DashboardGreeting } from '@/components/dashboard/DashboardGreeting';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { type PassageFilter } from '@/components/dashboard/FilterTabs';
import { type PlateFilter } from '@/components/dashboard/VehiclePlateFilter';
import { PassagesPaymentFooter } from '@/components/dashboard/PassagesPaymentFooter';
import { PassagesToPayPanel } from '@/components/dashboard/PassagesToPayPanel';
import { PromoBanner } from '@/components/dashboard/PromoBanner';
import { isFiscalTechEnabled } from '@/config/dataSource';
import { usePassages } from '@/context/PassagesContext';
import { useVehicles } from '@/context/VehiclesContext';
import { useAppTopPadding } from '@/hooks/useAppTopPadding';
import { usePassageSelection } from '@/hooks/usePassageSelection';
import { normalizePlate } from '@/services/lookupVehicleByPlate';
import { colors, spacing } from '@/theme/tokens';
import { buildDashboardSummary } from '@/utils/dashboardSummary';

export default function HomeScreen() {
  const topPadding = useAppTopPadding(spacing.sm);
  const { pendingPassages, pendingTotal, isLoading, loadError, refreshDebts } = usePassages();
  const { vehicles, isHydrated } = useVehicles();
  const [filter, setFilter] = useState<PassageFilter>('all');
  const [plateFilter, setPlateFilter] = useState<PlateFilter>('all');

  const vehicleModels = useMemo(
    () =>
      Object.fromEntries(
        vehicles.map((vehicle) => [normalizePlate(vehicle.plate), vehicle.model]),
      ),
    [vehicles],
  );

  useEffect(() => {
    if (plateFilter === 'all') return;
    const stillRegistered = vehicles.some(
      (vehicle) => normalizePlate(vehicle.plate) === plateFilter,
    );
    if (!stillRegistered) {
      setPlateFilter('all');
    }
  }, [vehicles, plateFilter]);

  useEffect(() => {
    if (!isFiscalTechEnabled() || !isHydrated) return;
    const plates = vehicles.map((vehicle) => vehicle.plate);
    refreshDebts(plates, { vehicleModels }).catch(() => undefined);
  }, [vehicles, vehicleModels, refreshDebts, isHydrated]);

  const passagesByPlate = useMemo(() => {
    if (plateFilter === 'all') return pendingPassages;
    return pendingPassages.filter(
      (passage) => normalizePlate(passage.plate) === plateFilter,
    );
  }, [pendingPassages, plateFilter]);

  const filteredPassages = useMemo(() => {
    if (filter === 'all') return passagesByPlate;
    return passagesByPlate.filter((p) => p.type === filter);
  }, [passagesByPlate, filter]);

  const passageCountByPlate = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const passage of pendingPassages) {
      const normalized = normalizePlate(passage.plate);
      counts[normalized] = (counts[normalized] ?? 0) + 1;
    }
    return counts;
  }, [pendingPassages]);

  const {
    selectedIds,
    togglePassage,
    allVisibleSelected,
    toggleAllVisible,
  } = usePassageSelection(pendingPassages);

  const selectedTotal = useMemo(() => {
    const selected = pendingPassages.filter((p) => selectedIds.includes(p.id));
    const visible = filter === 'all' ? selected : selected.filter((p) => p.type === filter);
    return visible.reduce((sum, p) => sum + p.amount, 0);
  }, [pendingPassages, selectedIds, filter]);

  const selectedCount = useMemo(
    () => filteredPassages.filter((p) => selectedIds.includes(p.id)).length,
    [filteredPassages, selectedIds],
  );

  const hasPendingPassages = pendingPassages.length > 0;

  const dashboardSummary = useMemo(
    () => buildDashboardSummary(pendingPassages, pendingTotal, vehicles.length),
    [pendingPassages, pendingTotal, vehicles.length],
  );

  function handlePay() {
    const idsForFilter =
      filter === 'all'
        ? selectedIds
        : selectedIds.filter((id) => filteredPassages.some((p) => p.id === id));

    if (idsForFilter.length === 0) return;

    router.push({
      pathname: '/pagar-forma',
      params: { selected: idsForFilter.join(',') },
    });
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <DashboardHeader />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stack}>
          <DashboardGreeting summary={dashboardSummary} />

          {isFiscalTechEnabled() && isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.tint} />
              <Text style={styles.loadingText}>Consultando débitos...</Text>
            </View>
          ) : null}

          {loadError ? <Text style={styles.errorText}>{loadError}</Text> : null}

          <PassagesToPayPanel
            passages={passagesByPlate}
            allPassages={pendingPassages}
            selectedIds={selectedIds}
            filter={filter}
            plateFilter={plateFilter}
            vehicles={vehicles}
            passageCountByPlate={passageCountByPlate}
            allVisibleSelected={allVisibleSelected(filteredPassages)}
            onFilterChange={setFilter}
            onPlateFilterChange={setPlateFilter}
            onTogglePassage={togglePassage}
            onToggleAllVisible={() => toggleAllVisible(filteredPassages)}
          />

          <PromoBanner />
        </View>
      </ScrollView>

      {hasPendingPassages ? (
        <PassagesPaymentFooter
          total={selectedTotal}
          selectedCount={selectedCount}
          totalPassages={filteredPassages.length}
          hasSelection={selectedCount > 0}
          onPay={handlePay}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.secondaryBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
    zIndex: 1,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 1px 0 rgba(0, 0, 0, 0.04)' }
      : null),
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  stack: {
    gap: spacing.md,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.secondaryLabel,
  },
  errorText: {
    color: colors.systemRed,
  },
});
