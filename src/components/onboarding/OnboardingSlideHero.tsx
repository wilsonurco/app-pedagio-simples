import { useEffect } from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type OnboardingSlideHeroProps = {
  image: ImageSourcePropType;
  isActive: boolean;
};

export function OnboardingSlideHero({ image, isActive }: OnboardingSlideHeroProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!isActive) {
      scale.value = 1;
      return;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [isActive, scale]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, imageStyle]}>
      <Image source={image} style={styles.image} contentFit="cover" transition={300} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
