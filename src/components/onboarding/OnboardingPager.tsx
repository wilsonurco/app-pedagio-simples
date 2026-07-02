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
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { ONBOARDING_SLIDES, type OnboardingSlide } from '@/constants/onboardingSlides';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

import { OnboardingSlideHero } from './OnboardingSlideHero';

const logo = require('@/assets/images/logo-pedagio-simples.png');

type OnboardingPagerProps = {
  onComplete: () => void;
};

export function OnboardingPager({ onComplete }: OnboardingPagerProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLast = activeIndex === ONBOARDING_SLIDES.length - 1;
  const heroHeight = Math.min(width * 0.92, height * 0.38, 360);

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
      <View style={[styles.slide, { width }]}>
        <OnboardingSlideHero image={item.image} isActive={index === activeIndex} height={heroHeight} />

        {index === activeIndex && (
          <Animated.View entering={FadeInDown.duration(380).delay(60)} style={styles.textBlock}>
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
    [activeIndex, heroHeight, width],
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Image source={logo} style={styles.logo} contentFit="contain" accessibilityLabel="Pedágio Simples" />
        <Pressable
          onPress={onComplete}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Pular introdução"
        >
          <Text style={styles.skip}>Pular</Text>
        </Pressable>
      </View>

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
        contentContainerStyle={styles.listContent}
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
            <ChevronRight size={20} color={colors.tint} strokeWidth={2.5} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  logo: {
    width: 168,
    height: 42,
  },
  skip: {
    ...fonts.medium,
    fontSize: fontSize.subheadline,
    color: colors.tint,
  },
  list: {
    flex: 1,
  },
  listContent: {
    alignItems: 'stretch',
  },
  slide: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    gap: spacing.xl,
  },
  textBlock: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.badgePurpleBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  stepBadgeText: {
    ...fonts.semibold,
    fontSize: fontSize.caption,
    color: colors.tint,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  highlight: {
    color: colors.tint,
  },
  description: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.lg,
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
    backgroundColor: colors.barInactive,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.tint,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
  },
  nextButtonPressed: {
    opacity: 0.7,
  },
  nextLabel: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.tint,
  },
});
