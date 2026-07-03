import { router, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { OnboardingPager } from '@/components/onboarding/OnboardingPager';
import { setOnboardingComplete } from '@/utils/onboardingStorage';

export default function OnboardingScreen() {
  const finish = useCallback(async () => {
    await setOnboardingComplete();
    router.replace('/splash' as Href);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const meta = document.querySelector('meta[name="theme-color"]');
    const html = document.documentElement;
    const { body } = document;
    const root = document.getElementById('root');

    const previous = {
      theme: meta?.getAttribute('content'),
      htmlOverflow: html.style.overflow,
      htmlHeight: html.style.height,
      bodyOverflow: body.style.overflow,
      bodyHeight: body.style.height,
      bodyMinHeight: body.style.minHeight,
      bodyMargin: body.style.margin,
      bodyPadding: body.style.padding,
      bodyBg: body.style.backgroundColor,
      rootBg: root?.style.backgroundColor ?? '',
      rootHeight: root?.style.height ?? '',
      rootMinHeight: root?.style.minHeight ?? '',
    };

    meta?.setAttribute('content', '#000000');
    html.style.height = '100%';
    html.style.overflow = 'hidden';
    body.style.margin = '0';
    body.style.padding = '0';
    body.style.height = '100%';
    body.style.minHeight = '100dvh';
    body.style.overflow = 'hidden';
    body.style.backgroundColor = '#000000';
    if (root) {
      root.style.height = '100%';
      root.style.minHeight = '100dvh';
      root.style.backgroundColor = '#000000';
    }

    return () => {
      if (previous.theme) meta?.setAttribute('content', previous.theme);
      html.style.overflow = previous.htmlOverflow;
      html.style.height = previous.htmlHeight;
      body.style.overflow = previous.bodyOverflow;
      body.style.height = previous.bodyHeight;
      body.style.minHeight = previous.bodyMinHeight;
      body.style.margin = previous.bodyMargin;
      body.style.padding = previous.bodyPadding;
      body.style.backgroundColor = previous.bodyBg;
      if (root) {
        root.style.backgroundColor = previous.rootBg;
        root.style.height = previous.rootHeight;
        root.style.minHeight = previous.rootMinHeight;
      }
    };
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <OnboardingPager onComplete={finish} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: Platform.OS === 'web'
    ? {
        flex: 1,
        width: '100%',
        height: '100dvh',
        minHeight: '100dvh',
        backgroundColor: '#000000',
      }
    : { flex: 1 },
});
