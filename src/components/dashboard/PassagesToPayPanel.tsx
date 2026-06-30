import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DashboardPassageCard } from '@/components/dashboard/DashboardPassageCard';
import { FilterTabs, type PassageFilter } from '@/components/dashboard/FilterTabs';
import { SelectAllRow } from '@/components/dashboard/SelectAllRow';
import {
  VehiclePlateFilter,
  type PlateFilter,
} from '@/components/dashboard/VehiclePlateFilter';
import { GroupedList } from '@/components/ui/GroupedList';
import { Plus, iconStroke } from '@/components/ui/icons';
import { isFiscalTechEnabled } from '@/config/dataSource';
import { type Passage, type Vehicle } from '@/data/mock';
import { isPassagePayable } from '@/services/fiscaltech/mappers';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PassagesToPayPanelProps = {
  passages: Passage[];
  allPassages: Passage[];
  selectedIds: string[];
  filter: PassageFilter;
  plateFilter: PlateFilter;
  vehicles: Vehicle[];
  passageCountByPlate: Record<string, number>;
  allVisibleSelected: boolean;
  onFilterChange: (filter: PassageFilter) => void;
  onPlateFilterChange: (filter: PlateFilter) => void;
  onTogglePassage: (id: string) => void;
  onToggleAllVisible: () => void;
};

function filterPassages(passages: Passage[], filter: PassageFilter) {
  if (filter === 'all') return passages;
  return passages.filter((p) => p.type === filter);
}

function countSelectable(passages: Passage[]) {
  if (isFiscalTechEnabled()) {
    return passages.filter(isPassagePayable).length;
  }
  return passages.length;
}

export function PassagesToPayPanel({
  passages,
  allPassages,
  selectedIds,
  filter,
  plateFilter,
  vehicles,
  passageCountByPlate,
  allVisibleSelected,
  onFilterChange,
  onPlateFilterChange,
  onTogglePassage,
  onToggleAllVisible,
}: PassagesToPayPanelProps) {
  const filtered = filterPassages(passages, filter);
  const selectableCount = countSelectable(filtered);

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Passagens a pagar</Text>
          <Text style={styles.subtitle}>Selecione os débitos para pagar agora</Text>
        </View>
        <Pressable
          onPress={() => router.push('/veiculos')}
          accessibilityRole="button"
          accessibilityLabel="Adicionar placa"
          hitSlop={8}
          style={({ pressed }) => [styles.addPlate, pressed && styles.addPlatePressed]}
        >
          <Plus size={16} color={colors.tint} strokeWidth={iconStroke} />
          <Text style={styles.addPlateText}>Placa</Text>
        </Pressable>
      </View>

      <VehiclePlateFilter
        vehicles={vehicles}
        value={plateFilter}
        onChange={onPlateFilterChange}
        passageCountByPlate={passageCountByPlate}
      />

      <FilterTabs value={filter} onChange={onFilterChange} />

      {filtered.length > 0 ? (
        <Text style={styles.countLabel}>
          {filtered.length} {filtered.length === 1 ? 'pendência' : 'pendências'}
        </Text>
      ) : null}

      <SelectAllRow
        allSelected={allVisibleSelected}
        selectableCount={selectableCount}
        onToggleAll={onToggleAllVisible}
      />

      <GroupedList>
        {filtered.map((passage, index) => (
          <DashboardPassageCard
            key={passage.id}
            passage={passage}
            selected={selectedIds.includes(passage.id)}
            onToggleSelect={() => onTogglePassage(passage.id)}
            showDivider={index < filtered.length - 1}
          />
        ))}
      </GroupedList>

      {filtered.length === 0 && allPassages.length > 0 ? (
        <Text style={styles.emptyFilter}>Nenhuma passagem neste filtro.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    letterSpacing: -0.4,
  },
  subtitle: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
    lineHeight: 20,
  },
  addPlate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  addPlatePressed: {
    opacity: 0.55,
  },
  addPlateText: {
    ...fonts.medium,
    fontSize: fontSize.subheadline,
    color: colors.tint,
  },
  countLabel: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
    marginTop: -spacing.xs,
  },
  emptyFilter: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
