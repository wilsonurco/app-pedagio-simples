import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { Bell, iconSize, iconStroke } from '@/components/ui/icons';
import { colors, spacing } from '@/theme/tokens';

const logo = require('@/assets/images/logo-pedagio-simples.png');

type HeaderProps = {
  onPressNotifications?: () => void;
  hasUnread?: boolean;
};

export function Header({ onPressNotifications, hasUnread = true }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Image
        source={logo}
        style={styles.logo}
        contentFit="contain"
        accessibilityLabel="pedágio simples"
      />

      <Pressable
        onPress={onPressNotifications}
        accessibilityRole="button"
        accessibilityLabel="Abrir notificações"
        hitSlop={12}
        style={({ pressed }) => [styles.bell, pressed && styles.bellPressed]}
      >
        <Bell size={iconSize.md} color={colors.label} strokeWidth={iconStroke} />
        {hasUnread && <View style={styles.badge} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  logo: {
    height: 36,
    width: 180,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellPressed: {
    backgroundColor: colors.fill,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.systemRed,
    borderWidth: 1.5,
    borderColor: colors.groupedBackground,
  },
});
