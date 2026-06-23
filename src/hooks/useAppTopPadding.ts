import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme/tokens';

/** Altura simulada da status bar no web quando não há safe area (modo PWA). */
export const WEB_STATUS_BAR_FALLBACK = 47;

export function usePwaStatusBarHeight() {
  const insets = useSafeAreaInsets();

  if (Platform.OS !== 'web') {
    return 0;
  }

  return Math.max(insets.top, WEB_STATUS_BAR_FALLBACK);
}

/** Padding superior do conteúdo abaixo da faixa de status bar simulada no web. */
export function useAppTopPadding(extra = spacing.sm) {
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'web') {
    return extra;
  }

  return insets.top + extra;
}
