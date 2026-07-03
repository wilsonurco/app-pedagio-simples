import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme/tokens';

/** Padding inferior de footers fixos, respeitando home indicator. */
export function useFooterBottomPadding(min = spacing.md) {
  const insets = useSafeAreaInsets();
  // Web PWA: innerHeight já cobre safe area; insets somados empurram o botão e deixam tarja cinza.
  if (Platform.OS === 'web') {
    return min;
  }
  return insets.bottom + min;
}
