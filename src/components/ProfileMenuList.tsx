import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { profileMenuItems } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export function ProfileMenuList() {
  return (
    <View style={styles.card}>
      {profileMenuItems.map((item, index) => (
        <Pressable
          key={item.id}
          onPress={() => router.push(item.route)}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          style={({ pressed }) => [
            styles.row,
            index < profileMenuItems.length - 1 && styles.divider,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.iconWrap}>
            <MaterialIcons name={item.icon} size={20} color={colors.tint} />
          </View>
          <Text style={styles.label}>{item.label}</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.tertiaryLabel} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    minHeight: 44,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  pressed: {
    opacity: 0.6,
  },
  iconWrap: {
    width: 32,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.label,
  },
});
