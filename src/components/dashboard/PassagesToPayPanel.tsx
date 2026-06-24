import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DashboardPassageCard } from '@/components/dashboard/DashboardPassageCard';
import { FilterTabs, type PassageFilter } from '@/components/dashboard/FilterTabs';
import { GroupedList } from '@/components/ui/GroupedList';
import { Plus, iconStroke } from '@/components/ui/icons';
import { type Passage } from '@/data/mock';
import { colors, fontSize, spacing } from '@/theme/tokens';
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

      <FilterTabs value={filter} onChange={onFilterChange} />

      {filtered.length > 0 ? (
        <Text style={styles.countLabel}>
          {filtered.length} {filtered.length === 1 ? 'pendência' : 'pendências'}
        </Text>
      ) : null}

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
});
