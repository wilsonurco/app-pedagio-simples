import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PayButtonProps = {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export function PayButton({
  label = 'Pagar Agora',
  loading = false,
  disabled = false,
  onPress,
}: PayButtonProps) {
  const isDisabled = loading || disabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: loading, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onTint} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.tint,
    minHeight: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonPressed: {
    backgroundColor: colors.tintPressed,
    opacity: 0.92,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.onTint,
  },
});
