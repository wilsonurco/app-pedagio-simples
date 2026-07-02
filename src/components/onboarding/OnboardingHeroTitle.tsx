import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export function OnboardingHeroTitle() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>
        Pendências de{'\n'}
        pedágio <Text style={styles.accentYellow}>resolvidas em</Text>
        {'\n'}
        <Text style={styles.accentYellow}>minutos</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...fonts.bold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.7,
    color: colors.onTint,
  },
  accentYellow: {
    color: colors.promoBannerSurface,
  },
});
