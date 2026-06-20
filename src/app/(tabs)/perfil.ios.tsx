import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, List, Section } from '@expo/ui/swift-ui';
import { listStyle } from '@expo/ui/swift-ui/modifiers';

import { Car, iconSize, iconStroke, LogOut } from '@/components/ui/icons';
import { ScreenHost } from '@/components/ios/ScreenHost';
import { profileMenuItems, userProfile } from '@/data/mock';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

const SF_ICONS = {
  'credit-card': 'creditcard',
  car: 'car',
  bell: 'bell',
  help: 'questionmark.circle',
} as const;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { name, email, vehicle } = userProfile;
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
      <RNText style={styles.pageTitle}>Perfil</RNText>

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <RNText style={styles.avatarText}>{initial}</RNText>
        </View>
        <View style={styles.userInfo}>
          <RNText style={styles.userName}>{name}</RNText>
          <RNText style={styles.userEmail}>{email}</RNText>
        </View>
      </View>

      <View style={styles.vehicleCard}>
        <View style={styles.vehicleIcon}>
          <Car size={22} color={colors.tint} strokeWidth={iconStroke} />
        </View>
        <View style={styles.userInfo}>
          <RNText style={styles.userName}>
            {vehicle.model} • {vehicle.plate}
          </RNText>
          <RNText style={styles.userEmail}>{vehicle.category}</RNText>
        </View>
      </View>

      <ScreenHost style={styles.menuHost}>
        <List modifiers={[listStyle('insetGrouped')]}>
          <Section>
            {profileMenuItems.map((item) => (
              <Button
                key={item.id}
                label={item.label}
                systemImage={SF_ICONS[item.icon]}
                onPress={() => router.push(item.route)}
              />
            ))}
          </Section>
        </List>
      </ScreenHost>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
        style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
      >
        <LogOut size={iconSize.sm} color={colors.systemRed} strokeWidth={iconStroke} />
        <RNText style={styles.logoutText}>Sair da conta</RNText>
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
  pageTitle: {
    ...fonts.bold,
    fontSize: fontSize.largeTitle,
    color: colors.label,
    letterSpacing: -0.4,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
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
    borderRadius: 12,
    padding: spacing.lg,
  },
  vehicleIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(91, 46, 140, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuHost: {
    minHeight: 220,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
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
