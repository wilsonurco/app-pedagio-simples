import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type HeaderProps = {
  onPressNotifications?: () => void;
  hasUnread?: boolean;
};

export function Header({ onPressNotifications, hasUnread = true }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          {Platform.OS === 'ios' ? (
            <SymbolView name="road.lanes" size={18} tintColor={colors.onTint} weight="semibold" />
          ) : (
            <MaterialCommunityIcons name="boom-gate" size={20} color={colors.onTint} />
          )}
        </View>
        <Text style={styles.title}>Pedágio Simples</Text>
      </View>

      <Pressable
        onPress={onPressNotifications}
        accessibilityRole="button"
        accessibilityLabel="Abrir notificações"
        hitSlop={12}
        style={({ pressed }) => [styles.bell, pressed && styles.bellPressed]}
      >
        {Platform.OS === 'ios' ? (
          <SymbolView name="bell" size={22} tintColor={colors.label} />
        ) : (
          <MaterialIcons name="notifications-none" size={24} color={colors.label} />
        )}
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
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...fonts.bold,
    fontSize: fontSize.title3,
    color: colors.label,
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
