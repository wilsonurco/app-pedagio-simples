import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { ChevronLeft, iconSize, iconStroke } from '@/components/ui/icons';
import { navigateBack } from '@/utils/navigation';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type ScreenBackButtonProps = {
  label?: string;
  fallback?: Href;
  fallbackParams?: Record<string, string | undefined>;
};

export function ScreenBackButton({
  label = 'Perfil',
  fallback,
  fallbackParams,
}: ScreenBackButtonProps) {
  return (
    <Pressable
      onPress={() => navigateBack({ fallback, params: fallbackParams })}
      accessibilityRole="button"
      accessibilityLabel={`Voltar para ${label}`}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <ChevronLeft size={iconSize.lg} color={colors.tint} strokeWidth={iconStroke} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: -spacing.xs,
    minHeight: 44,
    paddingRight: spacing.md,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.tint,
    marginLeft: -spacing.xs,
  },
});
