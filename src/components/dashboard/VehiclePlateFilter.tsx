import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { type Vehicle } from '@/data/mock';
import { normalizePlate } from '@/services/lookupVehicleByPlate';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export type PlateFilter = 'all' | string;

type VehiclePlateFilterProps = {
  vehicles: Vehicle[];
  value: PlateFilter;
  onChange: (value: PlateFilter) => void;
  passageCountByPlate?: Record<string, number>;
};

export function VehiclePlateFilter({
  vehicles,
  value,
  onChange,
  passageCountByPlate = {},
}: VehiclePlateFilterProps) {
  if (vehicles.length <= 1) return null;

  const tabs: { id: PlateFilter; label: string; accessibilityLabel: string }[] = [
    {
      id: 'all',
      label: 'Todas as placas',
      accessibilityLabel: 'Filtrar por todas as placas',
    },
    ...vehicles.map((vehicle) => {
      const normalized = normalizePlate(vehicle.plate);
      const count = passageCountByPlate[normalized];
      const countSuffix = count !== undefined ? ` (${count})` : '';
      return {
        id: normalized,
        label: `${vehicle.plate}${countSuffix}`,
        accessibilityLabel: `Filtrar passagens da placa ${vehicle.plate}, ${vehicle.model}`,
      };
    }),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {tabs.map((tab) => {
        const active = value === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.accessibilityLabel}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    minHeight: 34,
  },
  chipActive: {
    backgroundColor: colors.secondaryBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  chipText: {
    ...fonts.medium,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  chipTextActive: {
    ...fonts.semibold,
    color: colors.label,
  },
});
