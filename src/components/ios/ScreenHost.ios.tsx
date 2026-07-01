import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Host } from '@expo/ui/swift-ui';
import { tint as tintModifier } from '@expo/ui/swift-ui/modifiers';

import { colors } from '@/theme/tokens';

const TINT = tintModifier(colors.tint);

type ScreenHostProps = {
  children: ReactNode;
  style?: ViewStyle;
  useViewport?: boolean;
};

/** Container SwiftUI com tint de marca aplicado globalmente. */
export function ScreenHost({ children, style, useViewport = true }: ScreenHostProps) {
  return (
    <View style={[styles.container, style]}>
      <Host
        style={styles.host}
        useViewportSizeMeasurement={useViewport}
        modifiers={[TINT]}
      >
        {children}
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
  },
  host: {
    flex: 1,
  },
});
