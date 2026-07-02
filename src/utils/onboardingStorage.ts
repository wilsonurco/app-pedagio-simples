import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@pedagio_simples/onboarding_complete';

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, 'true');
}
