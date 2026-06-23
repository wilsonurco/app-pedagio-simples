import { Platform, StyleSheet, View } from 'react-native';

import { usePwaStatusBarHeight } from '@/hooks/useAppTopPadding';
import { colors } from '@/theme/tokens';

/** Faixa superior estilo PWA (status bar) — apenas no web. */
export function PwaStatusBar() {
  const height = usePwaStatusBarHeight();

  if (Platform.OS !== 'web' || height <= 0) {
    return null;
  }

  return <View style={[styles.bar, { height }]} accessibilityElementsHidden importantForAccessibility="no" />;
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.secondaryBackground,
    width: '100%',
  },
});
