import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { iconSize, iconStroke, LogOut } from '@/components/ui/icons';
import { colors, spacing } from '@/theme/tokens';

const logo = require('@/assets/images/logo-pedagio-simples.png');

type DashboardHeaderProps = {
  onPressLogout?: () => void;
};

export function DashboardHeader({ onPressLogout }: DashboardHeaderProps) {
  return (
    <View style={styles.container}>
      <Image
        source={logo}
        style={styles.logo}
        contentFit="contain"
        accessibilityLabel="pedágio simples"
      />

      <Pressable
        onPress={onPressLogout}
        accessibilityRole="button"
        accessibilityLabel="Sair"
        hitSlop={12}
        style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
      >
        <LogOut size={iconSize.md} color={colors.label} strokeWidth={iconStroke} />
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
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPressed: {
    backgroundColor: colors.fill,
  },
});
