import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { ONBOARDING_SLIDES, type OnboardingSlide } from '@/constants/onboardingSlides';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

import { OnboardingSlideHero } from './OnboardingSlideHero';
import { OnboardingSlideScrim } from './OnboardingSlideScrim';

type OnboardingPagerProps = {
  onComplete: () => void;
};

export function OnboardingPager({ onComplete }: OnboardingPagerProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLast = activeIndex === ONBOARDING_SLIDES.length - 1;
  const footerHeight = insets.bottom + spacing.lg + 120;

  const goNext = useCallback(() => {
    if (isLast) {
      onComplete();
      return;
    }
    listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
  }, [activeIndex, isLast, onComplete]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      if (index !== activeIndex && index >= 0 && index < ONBOARDING_SLIDES.length) {
        setActiveIndex(index);
      }
    },
    [activeIndex, width],
  );

  const renderSlide = useCallback(
    ({ item, index }: { item: OnboardingSlide; index: number }) => (
      <View style={[styles.slide, { width, height }]}>
        <OnboardingSlideHero image={item.image} isActive={index === activeIndex} />
        <OnboardingSlideScrim />

        {index === activeIndex && (
          <Animated.View
            entering={FadeInDown.duration(420).delay(80)}
            style={[styles.textPanel, { paddingBottom: footerHeight }]}
          >
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>{item.eyebrow}</Text>
            </View>
            <Text style={styles.title}>
              {item.title}{' '}
              <Text style={styles.highlight}>{item.highlight}</Text>
            </Text>
            <Text style={styles.description}>{item.description}</Text>
          </Animated.View>
        )}
      </View>
    ),
    [activeIndex, footerHeight, height, width],
  );

  return (
    <View style={styles.root}>
      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={false}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        style={styles.list}
      />

      <OnboardingHeader
        onSkip={onComplete}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.dots} accessibilityRole="tablist">
          {ONBOARDING_SLIDES.map((slide, index) => (
            <View
              key={slide.id}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
              accessibilityLabel={`Etapa ${index + 1}`}
            />
          ))}
        </View>

        {isLast ? (
          <PayButton label="Começar" onPress={goNext} />
        ) : (
          <Pressable
            onPress={goNext}
            style={({ pressed }) => [styles.nextButton, pressed && styles.nextButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Próximo"
          >
            <Text style={styles.nextLabel}>Próximo</Text>
            <ChevronRight size={20} color={colors.onTint} strokeWidth={2.5} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.label,
  },
  list: {
    flex: 1,
  },
  slide: {
    overflow: 'hidden',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  textPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  stepBadgeText: {
    ...fonts.semibold,
    fontSize: fontSize.caption,
    color: 'rgba(255, 255, 255, 0.88)',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    ...fonts.bold,
    fontSize: fontSize.title1,
    color: colors.onTint,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  highlight: {
    color: colors.promoAccent,
  },
  description: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: 'rgba(255, 255, 255, 0.82)',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.onTint,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    backgroundColor: colors.tint,
    borderRadius: radius.pill,
  },
  nextButtonPressed: {
    opacity: 0.75,
  },
  nextLabel: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.onTint,
  },
});
