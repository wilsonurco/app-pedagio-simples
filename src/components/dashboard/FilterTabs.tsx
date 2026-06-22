import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type PassageType } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export type PassageFilter = 'all' | PassageType;

const tabs: { id: PassageFilter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'conventional', label: 'Praça Manual' },
  { id: 'free-flow', label: 'Free Flow' },
];

type FilterTabsProps = {
  value: PassageFilter;
  onChange: (value: PassageFilter) => void;
};

export function FilterTabs({ value, onChange }: FilterTabsProps) {
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
