import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArrowUpRight, iconStroke, Wifi } from '@/components/ui/icons';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PromoBannerProps = {
  onPress?: () => void;
};

export function PromoBanner({ onPress }: PromoBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Wifi size={18} color={colors.promoAccent} strokeWidth={iconStroke} />
      </View>

      <Text style={styles.text}>Economize até 30% em pedágios com a Tag Move Mais</Text>

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Ver planos"
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Ver planos</Text>
        <ArrowUpRight size={14} color={colors.label} strokeWidth={iconStroke} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.promoBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...fonts.medium,
    flex: 1,
    fontSize: fontSize.footnote,
    color: colors.onTint,
    lineHeight: 18,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.onTint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    ...fonts.semibold,
    fontSize: fontSize.caption,
    color: colors.label,
  },
});
