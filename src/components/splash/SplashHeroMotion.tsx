import { useEffect } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

const logo = require('@/assets/images/logo-pedagio-simples.png');

export function SplashHeroMotion() {
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, [floatY]);

  const logoFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <View style={styles.hero}>
      <Animated.View style={logoFloatStyle}>
        <Animated.View entering={ZoomIn.duration(700).delay(120).springify().damping(17).stiffness(120)}>
          <Image source={logo} style={styles.logo} contentFit="contain" accessibilityLabel="Pedágio Simples" />
        </Animated.View>
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.duration(520).delay(300).easing(Easing.out(Easing.cubic))}
        style={styles.title}
      >
        Consulte seus débitos de pedágio
      </Animated.Text>

      <Animated.Text
        entering={FadeInDown.duration(520).delay(460).easing(Easing.out(Easing.cubic))}
        style={styles.subtitle}
      >
        Informe a placa e veja gratuitamente as passagens pendentes. Para pagar, crie sua conta em poucos passos.
      </Animated.Text>
    </View>
  );
}

type SplashFooterMotionProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SplashFooterMotion({ children, style }: SplashFooterMotionProps) {
  return (
    <Animated.View
      entering={FadeInUp.duration(520).delay(620).easing(Easing.out(Easing.cubic))}
      style={[styles.footer, style]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
