import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

const logo = require('@/assets/images/logo-pedagio-simples.png');

export default function SplashScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
      <View style={styles.hero}>
        <Image source={logo} style={styles.logo} contentFit="contain" accessibilityLabel="Pedágio Simples" />
        <Text style={styles.title}>Consulte seus débitos de pedágio</Text>
        <Text style={styles.subtitle}>
          Informe a placa e veja gratuitamente as passagens pendentes. Para pagar, crie sua conta em poucos passos.
        </Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <PayButton label="Consultar placa grátis" onPress={() => router.push('/consulta-placa' as Href)} />
        <PayButton
          label="Já tenho conta"
          variant="secondary"
          onPress={() => router.push('/login' as Href)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  logo: {
    width: 220,
    height: 56,
  },
  title: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  subtitle: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    gap: spacing.md,
  },
});
