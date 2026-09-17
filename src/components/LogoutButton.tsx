import { Alert, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

import { iconSize, iconStroke, LogOut } from '@/components/ui/icons';
import { usePassages } from '@/context/PassagesContext';
import { useSession } from '@/context/SessionContext';
import { useVehicles } from '@/context/VehiclesContext';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

const CONFIRM_TITLE = 'Sair da conta';
const CONFIRM_MESSAGE = 'Os veículos e débitos desta sessão serão limpos.';

export function LogoutButton() {
  const { signedIn, signOut } = useSession();
  const { clearVehicles } = useVehicles();
  const { clearPassages } = usePassages();

  if (!signedIn) return null;

  function leave() {
    clearVehicles();
    clearPassages();
    signOut();
    router.replace('/');
  }

  function handlePress() {
    if (Platform.OS === 'web') {
      const confirmed =
        typeof window !== 'undefined' && window.confirm(`${CONFIRM_TITLE}\n\n${CONFIRM_MESSAGE}`);
      if (confirmed) leave();
      return;
    }

    Alert.alert(CONFIRM_TITLE, CONFIRM_MESSAGE, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: leave },
    ]);
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Sair da conta"
      onPress={handlePress}
      style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
    >
      <LogOut size={iconSize.sm} color={colors.systemRed} strokeWidth={iconStroke} />
      <Text style={styles.logoutText}>Sair da conta</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    minHeight: 44,
  },
  logoutText: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.systemRed,
  },
  pressed: {
    opacity: 0.6,
  },
});
