import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileMenuList } from '@/components/ProfileMenuList';
import { ScreenTitle } from '@/components/ScreenTitle';
import { iconSize, iconStroke, LogOut } from '@/components/ui/icons';
import { useVehicles } from '@/context/VehiclesContext';
import { userProfile } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

const vehicleImage = require('@/assets/images/honda-civic-profile.png');

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { name, email } = userProfile;
  const { primaryVehicle } = useVehicles();
  const initial = name.charAt(0).toUpperCase();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.sm, paddingBottom: spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Título */}
      <ScreenTitle title="Perfil" />

      {/* 2. Card do usuário */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </View>

      {/* 3. Card do veículo */}
      {primaryVehicle ? (
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleImageWrap}>
            <Image
              source={vehicleImage}
              style={styles.vehicleImage}
              contentFit="contain"
              backgroundColor="#FFFFFF"
              accessibilityLabel={`Foto do ${primaryVehicle.model}`}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {primaryVehicle.model} • {primaryVehicle.plate}
            </Text>
          </View>
        </View>
      ) : null}

      {/* 4. Menu (sequência do print) */}
      <ProfileMenuList />

      {/* 5. Sair da conta */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
        style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
      >
        <LogOut size={iconSize.sm} color={colors.systemRed} strokeWidth={iconStroke} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: colors.groupedBackground,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.onTint,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
  },
  userEmail: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  vehicleImageWrap: {
    width: 120,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleImage: {
    width: 120,
    height: 64,
    backgroundColor: '#FFFFFF',
  },
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
