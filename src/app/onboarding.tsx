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
    const previous = meta?.getAttribute('content');
    meta?.setAttribute('content', '#000000');
    return () => {
      if (previous) meta?.setAttribute('content', previous);
    };
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <OnboardingPager onComplete={finish} />
    </>
  );
}
