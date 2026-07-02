import { Redirect, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/tokens';
import { hasCompletedOnboarding } from '@/utils/onboardingStorage';

export default function IndexScreen() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    hasCompletedOnboarding().then(setOnboardingDone);
  }, []);

  if (isBootstrapping || onboardingDone === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  if (!onboardingDone) {
    return <Redirect href={'/onboarding' as Href} />;
  }

  return <Redirect href={'/splash' as Href} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.groupedBackground,
  },
});
