import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DashboardPassageCard } from '@/components/dashboard/DashboardPassageCard';
import { FilterTabs, type PassageFilter } from '@/components/dashboard/FilterTabs';
import { AlertTriangle, iconStroke, Plus } from '@/components/ui/icons';
import { type Passage } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PassagesToPayPanelProps = {
  passages: Passage[];
  selectedIds: string[];
  filter: PassageFilter;
  onFilterChange: (filter: PassageFilter) => void;
  onTogglePassage: (id: string) => void;
};

function filterPassages(passages: Passage[], filter: PassageFilter) {
  if (filter === 'all') return passages;
  return passages.filter((p) => p.type === filter);
}

export function PassagesToPayPanel({
  passages,
  selectedIds,
  filter,
  onFilterChange,
  onTogglePassage,
}: PassagesToPayPanelProps) {
  const filtered = filterPassages(passages, filter);

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <AlertTriangle size={18} color={colors.systemOrange} strokeWidth={iconStroke} />
          <Text style={styles.title}>Passagens a pagar</Text>
        </View>
        <Pressable
          onPress={() => router.push('/veiculos')}
          accessibilityRole="button"
          accessibilityLabel="Adicionar placa"
          hitSlop={8}
        >
          <View style={styles.addPlate}>
            <Plus size={14} color={colors.tint} strokeWidth={iconStroke} />
            <Text style={styles.addPlateText}>Placa</Text>
          </View>
        </Pressable>
      </View>

      <Text style={styles.subtitle}>Selecione quais débitos deseja pagar agora</Text>

      <FilterTabs value={filter} onChange={onFilterChange} />

      <Text style={styles.countLabel}>
        {filtered.length}{' '}
        {filtered.length === 1 ? 'PENDÊNCIA DISPONÍVEL' : 'PENDÊNCIAS DISPONÍVEIS'}
      </Text>

      <View style={styles.list}>
        {filtered.map((passage) => (
          <DashboardPassageCard
            key={passage.id}
            passage={passage}
            selected={selectedIds.includes(passage.id)}
            onToggleSelect={() => onTogglePassage(passage.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...fonts.bold,
    fontSize: fontSize.title3,
    color: colors.label,
  },
  addPlate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  addPlateText: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.tint,
  },
  subtitle: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    marginTop: -spacing.xs,
  },
  countLabel: {
    ...fonts.semibold,
    fontSize: fontSize.caption2,
    color: colors.tint,
    letterSpacing: 0.6,
  },
  list: {
    gap: spacing.md,
  },
});
