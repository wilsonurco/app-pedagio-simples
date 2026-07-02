import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';

import { OnboardingBrandLogo } from '@/components/onboarding/OnboardingBrandLogo';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type OnboardingHeaderProps = {
  onSkip: () => void;
  style?: StyleProp<ViewStyle>;
};

export function OnboardingHeader({ onSkip, style }: OnboardingHeaderProps) {
  return (
    <View style={[styles.header, style]} pointerEvents="box-none">
      <OnboardingBrandLogo />

      <Pressable
        onPress={onSkip}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Pular introdução"
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <OnboardingGlassChip label="Pular" />
      </Pressable>
    </View>
  );
}

type OnboardingGlassChipProps = {
  label: string;
};

function OnboardingGlassChip({ label }: OnboardingGlassChipProps) {
  const content = <Text style={styles.skip}>{label}</Text>;

  if (Platform.OS === 'ios' && isLiquidGlassAvailable()) {
    return (
      <GlassView
        glassEffectStyle="regular"
        tintColor="rgba(255, 255, 255, 0.08)"
        colorScheme="dark"
        style={styles.glassChip}
      >
        {content}
      </GlassView>
    );
  }

  return <View style={[styles.glassChip, Platform.OS === 'web' && styles.glassWeb]}>{content}</View>;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  glassChip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.24)',
  },
  glassWeb: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    // @ts-expect-error propriedades CSS para liquid glass no web
    backdropFilter: 'blur(18px) saturate(160%)',
    WebkitBackdropFilter: 'blur(18px) saturate(160%)',
  },
  skip: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.onTint,
  },
  pressed: {
    opacity: 0.82,
  },
});
