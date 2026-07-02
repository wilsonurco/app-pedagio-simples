import { useEffect } from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius, shadow, spacing } from '@/theme/tokens';

type OnboardingSlideHeroProps = {
  image: ImageSourcePropType;
  isActive: boolean;
  height: number;
};

export function OnboardingSlideHero({ image, isActive, height }: OnboardingSlideHeroProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!isActive) {
      scale.value = 1;
      return;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [isActive, scale]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.frame, { height }]}>
      <Animated.View style={[styles.imageWrap, imageStyle]}>
        <Image source={image} style={styles.image} contentFit="cover" transition={300} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.secondaryBackground,
    ...shadow.card,
  },
  imageWrap: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
