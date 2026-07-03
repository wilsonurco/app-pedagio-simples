import { router, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

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
    const previousTheme = meta?.getAttribute('content');
    meta?.setAttribute('content', '#000000');

    const { body } = document;
    const root = document.getElementById('root');
    const previousBodyBg = body.style.backgroundColor;
    const previousRootBg = root?.style.backgroundColor ?? '';
    body.style.backgroundColor = '#000000';
    if (root) root.style.backgroundColor = '#000000';

    return () => {
      if (previousTheme) meta?.setAttribute('content', previousTheme);
      body.style.backgroundColor = previousBodyBg;
      if (root) root.style.backgroundColor = previousRootBg;
    };
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <OnboardingPager onComplete={finish} />
    </>
  );
}
