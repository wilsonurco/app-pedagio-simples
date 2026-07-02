import { router, type Href } from 'expo-router';
import { useCallback } from 'react';

import { OnboardingPager } from '@/components/onboarding/OnboardingPager';
import { setOnboardingComplete } from '@/utils/onboardingStorage';

export default function OnboardingScreen() {
  const finish = useCallback(async () => {
    await setOnboardingComplete();
    router.replace('/splash' as Href);
  }, []);

  return <OnboardingPager onComplete={finish} />;
}
