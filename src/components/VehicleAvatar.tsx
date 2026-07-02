import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Car, iconSize, iconStroke } from '@/components/ui/icons';
import { colors } from '@/theme/tokens';

type VehicleAvatarSize = 'sm' | 'md' | 'lg';

type VehicleAvatarProps = {
  size?: VehicleAvatarSize;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

const dimensions: Record<VehicleAvatarSize, number> = {
  sm: 40,
  md: 48,
  lg: 72,
};

const iconSizes: Record<VehicleAvatarSize, number> = {
  sm: iconSize.sm,
  md: iconSize.md,
  lg: iconSize.lg,
};

export function VehicleAvatar({
  size = 'md',
  style,
  accessibilityLabel = 'Avatar do veículo',
}: VehicleAvatarProps) {
  const dimension = dimensions[size];

  return (
    <View
      style={[styles.avatar, { width: dimension, height: dimension, borderRadius: dimension / 2 }, style]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Car size={iconSizes[size]} color={colors.tint} strokeWidth={iconStroke} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(91, 46, 140, 0.1)',
  },
});
