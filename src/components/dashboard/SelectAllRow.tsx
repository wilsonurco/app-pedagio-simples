import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Check } from '@/components/ui/icons';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type SelectAllRowProps = {
  allSelected: boolean;
  selectableCount: number;
  onToggleAll: () => void;
};

export function SelectAllRow({ allSelected, selectableCount, onToggleAll }: SelectAllRowProps) {
  if (selectableCount === 0) return null;

  const label = allSelected ? 'Desmarcar todas' : 'Selecionar todas';

  return (
    <Pressable
      onPress={onToggleAll}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: allSelected }}
      accessibilityLabel={`${label}, ${selectableCount} passagens`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.checkbox, allSelected && styles.checkboxSelected]}>
        {allSelected ? <Check size={12} color={colors.onTint} strokeWidth={2.5} /> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.count}>{selectableCount}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    paddingVertical: spacing.xs,
  },
  pressed: {
    opacity: 0.65,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.separator,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryBackground,
  },
  checkboxSelected: {
    backgroundColor: colors.tint,
    borderColor: colors.tint,
  },
  label: {
    flex: 1,
    ...fonts.medium,
    fontSize: fontSize.subheadline,
    color: colors.label,
  },
  count: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
    fontVariant: ['tabular-nums'],
  },
});
