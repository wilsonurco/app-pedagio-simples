import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type ScreenBackButtonProps = {
  label?: string;
};

export function ScreenBackButton({ label = 'Perfil' }: ScreenBackButtonProps) {
  return (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel={`Voltar para ${label}`}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <MaterialIcons name="chevron-left" size={28} color={colors.tint} />
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
