import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DashboardPassageCard } from '@/components/dashboard/DashboardPassageCard';
import { FilterTabs, type PassageFilter } from '@/components/dashboard/FilterTabs';
import { AlertTriangle, ArrowUpRight, iconStroke, Plus } from '@/components/ui/icons';
import { formatBRL, type Passage } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PassagesToPayPanelProps = {
  passages: Passage[];
  selectedIds: string[];
  total: number;
  filter: PassageFilter;
  onFilterChange: (filter: PassageFilter) => void;
  onTogglePassage: (id: string) => void;
  onPay: () => void;
};

function filterPassages(passages: Passage[], filter: PassageFilter) {
  if (filter === 'all') return passages;
  return passages.filter((p) => p.type === filter);
}

export function PassagesToPayPanel({
  passages,
  selectedIds,
  total,
  filter,
  onFilterChange,
  onTogglePassage,
  onPay,
}: PassagesToPayPanelProps) {
  const filtered = filterPassages(passages, filter);
  const selectedCount = filtered.filter((p) => selectedIds.includes(p.id)).length;
  const hasSelection = selectedCount > 0;

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

      {passages.length > 0 ? (
        <View style={styles.paymentSection}>
          <View style={styles.totalBar}>
            <Text style={styles.totalLabel}>Total a pagar</Text>
            <Text style={styles.totalHint}>
              {selectedCount} de {filtered.length}{' '}
              {filtered.length === 1 ? 'pendência selecionada' : 'pendências selecionadas'}
            </Text>
          </View>

          <Pressable
            onPress={onPay}
            disabled={!hasSelection}
            accessibilityRole="button"
            accessibilityLabel={`Pagar ${formatBRL(total)}`}
            style={({ pressed }) => [
              styles.payButton,
              !hasSelection && styles.payButtonDisabled,
              pressed && hasSelection && styles.payButtonPressed,
            ]}
          >
            <ArrowUpRight size={18} color={colors.onTint} strokeWidth={iconStroke} />
            <Text style={styles.payButtonText}>
              Pagar — {formatBRL(hasSelection ? total : 0)}
            </Text>
          </Pressable>
        </View>
      ) : null}
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
  paymentSection: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  totalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.fill,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  totalLabel: {
    ...fonts.medium,
    fontSize: fontSize.caption,
    color: colors.secondaryLabel,
  },
  totalHint: {
    ...fonts.regular,
    fontSize: fontSize.caption2,
    color: colors.tertiaryLabel,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.payButtonBright,
    borderRadius: radius.lg,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  payButtonPressed: {
    opacity: 0.9,
  },
  payButtonDisabled: {
    opacity: 0.45,
  },
  payButtonText: {
    ...fonts.bold,
    fontSize: fontSize.body,
    color: colors.onTint,
  },
});
