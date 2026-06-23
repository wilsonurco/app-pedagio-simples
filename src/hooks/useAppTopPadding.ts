import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme/tokens';

/** Padding superior respeitando a safe area do dispositivo. */
export function useAppTopPadding(extra = spacing.sm) {
  const insets = useSafeAreaInsets();
  return insets.top + extra;
}
