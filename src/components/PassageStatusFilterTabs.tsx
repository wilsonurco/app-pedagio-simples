import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export type PassageStatusFilter = 'all' | 'paid' | 'pending';

const tabs: { id: PassageStatusFilter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'paid', label: 'Pagas' },
  { id: 'pending', label: 'Pendentes' },
];

type PassageStatusFilterTabsProps = {
  value: PassageStatusFilter;
  onChange: (value: PassageStatusFilter) => void;
};

export function PassageStatusFilterTabs({ value, onChange }: PassageStatusFilterTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = value === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.tertiaryBackground,
    borderRadius: radius.md,
    padding: 3,
    gap: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.sm,
    minHeight: 36,
  },
  tabActive: {
    backgroundColor: colors.secondaryBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    ...fonts.medium,
    fontSize: fontSize.caption,
    color: colors.secondaryLabel,
  },
  tabTextActive: {
    ...fonts.semibold,
    color: colors.label,
  },
});
