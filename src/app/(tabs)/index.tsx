import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { DashboardGreeting } from '@/components/dashboard/DashboardGreeting';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { type PassageFilter } from '@/components/dashboard/FilterTabs';
import { PassagesPaymentFooter } from '@/components/dashboard/PassagesPaymentFooter';
import { PassagesToPayPanel } from '@/components/dashboard/PassagesToPayPanel';
import { PromoBanner } from '@/components/dashboard/PromoBanner';
import { RecentActivitySection } from '@/components/dashboard/RecentActivitySection';
import { usePassages } from '@/context/PassagesContext';
import { useVehicles } from '@/context/VehiclesContext';
import { useAppTopPadding } from '@/hooks/useAppTopPadding';
import { usePassageSelection } from '@/hooks/usePassageSelection';
import { colors, spacing } from '@/theme/tokens';
import { compareAppDateTime } from '@/utils/dateTime';

function getEarliestDueDate(passages: { dueDate?: string }[]) {
  const withDue = passages.filter((p) => p.dueDate);
  if (withDue.length === 0) return undefined;
  return [...withDue].sort((a, b) => compareAppDateTime(a.dueDate!, b.dueDate!))[0]?.dueDate;
}

export default function HomeScreen() {
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

  const selectedCount = useMemo(
    () => filteredPassages.filter((p) => selectedIds.includes(p.id)).length,
    [filteredPassages, selectedIds],
  );

  const hasPendingPassages = pendingPassages.length > 0;

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
            filter={filter}
            onFilterChange={setFilter}
            onTogglePassage={togglePassage}
          />

          <RecentActivitySection />
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
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  stack: {
    gap: spacing.lg,
  },
});
