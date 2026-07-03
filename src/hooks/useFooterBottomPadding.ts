import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme/tokens';

/** Padding inferior de footers fixos, respeitando home indicator. */
export function useFooterBottomPadding(min = spacing.md) {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, min);
}
