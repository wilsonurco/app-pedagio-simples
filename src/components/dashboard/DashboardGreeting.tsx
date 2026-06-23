import { StyleSheet, Text, View } from 'react-native';

import { Calendar, Car, iconSize, iconStroke, Shield, Wallet } from '@/components/ui/icons';
import { formatBRL, userProfile } from '@/data/mock';
import { formatDateTimeDisplay } from '@/utils/dateTime';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type DashboardGreetingProps = {
  pendingCount: number;
  pendingTotal: number;
  dueDate?: string;
  vehicleCount?: number;
};

function firstName(fullName: string) {
  return fullName.split(' ')[0];
}

export function DashboardGreeting({
  pendingCount,
  pendingTotal,
  dueDate = '11/07/2026',
  vehicleCount = 1,
}: DashboardGreetingProps) {
  const subtitle =
    pendingCount === 1
      ? '1 passagem pendente de pagamento'
      : `${pendingCount} passagens pendentes de pagamento`;

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, {firstName(userProfile.name)}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.badges}>
        <View style={[styles.badge, styles.badgePurple]}>
          <Wallet size={14} color={colors.tint} strokeWidth={iconStroke} />
          <Text style={styles.badgePurpleText}>{formatBRL(pendingTotal)} em aberto</Text>
        </View>

        <View style={[styles.badge, styles.badgeOrange]}>
          <Calendar size={14} color={colors.systemOrange} strokeWidth={iconStroke} />
          <Text style={styles.badgeOrangeText}>Vence {formatDateTimeDisplay(dueDate)}</Text>
        </View>
      </View>

      <View style={styles.vehicleRow}>
        <Shield size={iconSize.sm} color={colors.tertiaryLabel} strokeWidth={iconStroke} />
        <Text style={styles.vehicleText}>
          {vehicleCount} {vehicleCount === 1 ? 'veículo' : 'veículos'}
        </Text>
        <Car size={iconSize.sm} color={colors.tertiaryLabel} strokeWidth={iconStroke} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  greeting: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    letterSpacing: -0.3,
  },
  subtitle: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  badgePurple: {
    backgroundColor: colors.badgePurpleBg,
  },
  badgeOrange: {
    backgroundColor: colors.badgeOrangeBg,
  },
  badgePurpleText: {
    ...fonts.medium,
    fontSize: fontSize.footnote,
    color: colors.tint,
  },
  badgeOrangeText: {
    ...fonts.medium,
    fontSize: fontSize.footnote,
    color: colors.systemOrange,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  vehicleText: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
  },
});
