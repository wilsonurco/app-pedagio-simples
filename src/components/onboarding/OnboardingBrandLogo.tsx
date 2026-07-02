import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

const logoWhite = require('@/assets/images/logo-pedagio-simples-white.png');

const LOGO_WIDTH = 168;
const LOGO_ASPECT = 560 / 115;

export function OnboardingBrandLogo() {
  return (
    <View style={styles.wrap}>
      <Image
        source={logoWhite}
        style={styles.logo}
        contentFit="contain"
        accessibilityLabel="Pedágio Simples"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    mixBlendMode: 'lighten',
  },
  logo: {
    width: LOGO_WIDTH,
    height: Math.round(LOGO_WIDTH / LOGO_ASPECT),
    backgroundColor: 'transparent',
  },
});
