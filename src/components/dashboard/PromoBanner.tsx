import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GroupedList } from '@/components/ui/GroupedList';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PromoBannerProps = {
  onPress?: () => void;
};

export function PromoBanner({ onPress }: PromoBannerProps) {
  return (
    <GroupedList>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Ver planos da Tag Move Mais"
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      >
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>Tag Move Mais</Text>
          <Text style={styles.text}>Economize até 30% em pedágios</Text>
        </View>
        <Text style={styles.action}>Ver planos</Text>
      </Pressable>
    </GroupedList>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  rowPressed: {
    opacity: 0.65,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    ...fonts.medium,
    fontSize: fontSize.caption,
    color: colors.tint,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  text: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.label,
    lineHeight: 20,
  },
  action: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.tint,
  },
});
