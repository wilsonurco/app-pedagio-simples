import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { GroupedList } from '@/components/ui/GroupedList';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

const MOVE_MAIS_URL = 'https://movemais.com';

type PromoBannerProps = {
  onPress?: () => void;
};

function openMoveMaisSite() {
  Linking.openURL(MOVE_MAIS_URL).catch(() => undefined);
}

export function PromoBanner({ onPress = openMoveMaisSite }: PromoBannerProps) {
  return (
    <GroupedList style={styles.banner}>
      <Pressable
        onPress={onPress}
        accessibilityRole="link"
        accessibilityLabel="Ver planos da Tag Move Mais em movemais.com"
        accessibilityHint="Abre o site da Move Mais"
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
  banner: {
    backgroundColor: colors.promoBannerSurface,
  },
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
