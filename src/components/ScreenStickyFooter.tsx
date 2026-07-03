import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme/tokens';

type ScreenStickyFooterProps = {
  children: React.ReactNode;
  backgroundColor?: string;
};

/** Altura aproximada reservada no scroll quando o footer é position:fixed (web PWA). */
export function useStickyFooterScrollPadding(extraTop = spacing.md) {
  const insets = useSafeAreaInsets();
  const buttonHeight = 52;
  if (Platform.OS === 'web') {
    return buttonHeight + extraTop + spacing.sm + 34;
  }
  return buttonHeight + extraTop + insets.bottom + spacing.sm;
}

/**
 * Footer colado na base da tela. No PWA iOS usa position:fixed + env(safe-area-inset-bottom)
 * para o fundo branco cobrir a faixa do home indicator (evita tarja cinza abaixo do botão).
 */
export function ScreenStickyFooter({
  children,
  backgroundColor = colors.secondaryBackground,
}: ScreenStickyFooterProps) {
  const insets = useSafeAreaInsets();

  const webSafePadding = {
    paddingBottom: 'max(8px, calc(env(safe-area-inset-bottom, 0px) + 8px))',
  } as ViewStyle;

  const nativePadding = { paddingBottom: insets.bottom + spacing.sm };

  return (
    <View
      style={[
        styles.dock,
        { backgroundColor },
        Platform.OS === 'web' ? styles.dockWeb : nativePadding,
        Platform.OS === 'web' ? webSafePadding : null,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  dockWeb: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});
