import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { SplashFooterMotion, SplashHeroMotion } from '@/components/splash/SplashHeroMotion';
import { colors, spacing } from '@/theme/tokens';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
      <SplashHeroMotion />

      <SplashFooterMotion style={{ paddingBottom: insets.bottom + spacing.lg }}>
        <PayButton label="Consultar placa grátis" onPress={() => router.push('/consulta-placa' as Href)} />
        <PayButton
          label="Já tenho conta"
          variant="secondary"
          onPress={() => router.push('/login' as Href)}
        />
      </SplashFooterMotion>
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
});
