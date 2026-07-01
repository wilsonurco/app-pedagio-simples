import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '@/theme/tokens';

type ScreenHostProps = {
  children: ReactNode;
  style?: ViewStyle;
  useViewport?: boolean;
};

/** Fallback web/Android — evita carregar SwiftUI nativo fora do iOS. */
export function ScreenHost({ children, style }: ScreenHostProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
  },
});
