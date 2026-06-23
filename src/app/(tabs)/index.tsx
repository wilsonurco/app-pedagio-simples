import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DashboardGreeting } from '@/components/dashboard/DashboardGreeting';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { type PassageFilter } from '@/components/dashboard/FilterTabs';
import { PassagesToPayPanel } from '@/components/dashboard/PassagesToPayPanel';
import { PromoBanner } from '@/components/dashboard/PromoBanner';
import { RecentActivitySection } from '@/components/dashboard/RecentActivitySection';
import { usePassages } from '@/context/PassagesContext';
import { useVehicles } from '@/context/VehiclesContext';
import { useAppTopPadding } from '@/hooks/useAppTopPadding';
import { usePassageSelection } from '@/hooks/usePassageSelection';
import { colors, spacing } from '@/theme/tokens';

function getEarliestDueDate(passages: { dueDate?: string }[]) {
  const withDue = passages.filter((p) => p.dueDate);
  if (withDue.length === 0) return undefined;
  return withDue[0]?.dueDate;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = useAppTopPadding(spacing.sm);
  const { pendingPassages, pendingTotal } = usePassages();
  const { vehicles } = useVehicles();
  const [filter, setFilter] = useState<PassageFilter>('all');

  const filteredPassages = useMemo(() => {
    if (filter === 'all') return pendingPassages;
    return pendingPassages.filter((p) => p.type === filter);
  }, [pendingPassages, filter]);

  const { selectedIds, togglePassage } = usePassageSelection(pendingPassages);

  const selectedTotal = useMemo(() => {
    const selected = pendingPassages.filter((p) => selectedIds.includes(p.id));
    const visible = filter === 'all' ? selected : selected.filter((p) => p.type === filter);
    return visible.reduce((sum, p) => sum + p.amount, 0);
  }, [pendingPassages, selectedIds, filter]);

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
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stack}>
          <PromoBanner />

          <DashboardGreeting
            pendingCount={pendingPassages.length}
            pendingTotal={pendingTotal}
            dueDate={getEarliestDueDate(pendingPassages)}
            vehicleCount={vehicles.length}
          />

          <PassagesToPayPanel
            passages={filteredPassages}
            selectedIds={selectedIds}
            total={selectedTotal}
            filter={filter}
            onFilterChange={setFilter}
            onTogglePassage={togglePassage}
            onPay={handlePay}
          />

          <RecentActivitySection />
        </View>
      </ScrollView>
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
    paddingTop: spacing.md,
  },
  stack: {
    gap: spacing.lg,
  },
});
