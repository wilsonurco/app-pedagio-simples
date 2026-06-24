import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GroupedDivider, GroupedList } from '@/components/ui/GroupedList';
import { ChevronRight, iconSize, iconStroke, profileMenuIcons } from '@/components/ui/icons';
import { profileMenuItems } from '@/data/mock';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export function ProfileMenuList() {
  return (
    <GroupedList>
      {profileMenuItems.map((item, index) => {
        const Icon = profileMenuIcons[item.icon];

        return (
          <View key={item.id}>
            {index > 0 ? <GroupedDivider inset={spacing.lg + iconSize.sm + spacing.md} /> : null}
            <Pressable
              onPress={() => router.push(item.route)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <Icon size={iconSize.sm} color={colors.secondaryLabel} strokeWidth={iconStroke} />
              <Text style={styles.label}>{item.label}</Text>
              <ChevronRight size={16} color={colors.quaternaryLabel} strokeWidth={iconStroke} />
            </Pressable>
          </View>
        );
      })}
    </GroupedList>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 44,
  },
  pressed: {
    opacity: 0.65,
  },
  label: {
    flex: 1,
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.label,
  },
});
