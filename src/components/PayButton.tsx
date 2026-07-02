import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PayButtonProps = {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  onPress?: () => void;
};

export function PayButton({
  label = 'Pagar agora',
  loading = false,
  disabled = false,
  variant = 'primary',
  onPress,
}: PayButtonProps) {
  const isDisabled = loading || disabled;
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: loading, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        isSecondary && styles.buttonSecondary,
        pressed && !isDisabled && (isSecondary ? styles.buttonSecondaryPressed : styles.buttonPressed),
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.tint : colors.onTint} />
      ) : (
        <Text style={[styles.label, isSecondary && styles.labelSecondary]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.tint,
    minHeight: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  buttonPressed: {
    backgroundColor: colors.tintPressed,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.tint,
  },
  buttonSecondaryPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.38,
  },
  label: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.onTint,
  },
  labelSecondary: {
    color: colors.tint,
  },
});
