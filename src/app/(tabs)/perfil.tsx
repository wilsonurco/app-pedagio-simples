import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { ProfileMenuList } from '@/components/ProfileMenuList';
import { ScreenTitle } from '@/components/ScreenTitle';
import { GroupedDivider, GroupedList } from '@/components/ui/GroupedList';
import { iconSize, iconStroke, LogOut } from '@/components/ui/icons';
import { useVehicles } from '@/context/VehiclesContext';
import { userProfile } from '@/data/mock';
import { useAppTopPadding } from '@/hooks/useAppTopPadding';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

const vehicleImage = require('@/assets/images/honda-civic-profile.png');

export default function ProfileScreen() {
  const topPadding = useAppTopPadding(spacing.sm);
  const { name, email } = userProfile;
  const { primaryVehicle } = useVehicles();
  const initial = name.charAt(0).toUpperCase();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPadding, paddingBottom: spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenTitle title="Perfil" subtitle="Sua conta e preferências" />

      <GroupedList>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>
        </View>

        {primaryVehicle ? (
          <>
            <GroupedDivider />
            <View style={styles.vehicleRow}>
              <Image
                source={vehicleImage}
                style={styles.vehicleImage}
                contentFit="contain"
                accessibilityLabel={`Foto do ${primaryVehicle.model}`}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{primaryVehicle.model}</Text>
                <Text style={styles.userEmail}>{primaryVehicle.plate}</Text>
              </View>
            </View>
          </>
        ) : null}
      </GroupedList>

      <ProfileMenuList />

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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...fonts.semibold,
    fontSize: fontSize.title3,
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
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  vehicleImage: {
    width: 72,
    height: 40,
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
    ...fonts.medium,
    fontSize: fontSize.body,
    color: colors.systemRed,
  },
  pressed: {
    opacity: 0.65,
  },
});
