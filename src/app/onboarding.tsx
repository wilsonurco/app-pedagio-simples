import { router, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { OnboardingPager } from '@/components/onboarding/OnboardingPager';
import { setOnboardingComplete } from '@/utils/onboardingStorage';

export default function OnboardingScreen() {
  const finish = useCallback(async () => {
    await setOnboardingComplete();
    router.replace('/splash' as Href);
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <OnboardingPager onComplete={finish} />
    </View>
  );
}

const webScreen = {
  flex: 1,
  width: '100%',
  height: '100dvh' as unknown as ViewStyle['height'],
  minHeight: '100dvh' as unknown as ViewStyle['minHeight'],
  backgroundColor: '#000000',
} satisfies ViewStyle;

const styles = StyleSheet.create({
  screen: Platform.OS === 'web' ? webScreen : { flex: 1 },
});
