import { StyleSheet, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LabeledContent, List, Section, Text } from '@expo/ui/swift-ui';
import { font, foregroundStyle, listStyle } from '@expo/ui/swift-ui/modifiers';

import { ScreenHost } from '@/components/ios/ScreenHost';
import { alerts } from '@/data/mock';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

const ALERT_COLORS = {
  info: colors.systemBlue,
  warning: colors.systemOrange,
  danger: colors.systemRed,
} as const;

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <RNText style={styles.pageTitle}>Alertas</RNText>

      <ScreenHost style={styles.host}>
        <List modifiers={[listStyle('insetGrouped')]}>
          <Section title="Recentes">
            {alerts.map((alert) => (
              <LabeledContent key={alert.id} label={alert.title}>
                <Text modifiers={[foregroundStyle({ type: 'hierarchical', style: 'secondary' })]}>
                  {alert.description}
                </Text>
                <Text modifiers={[font({ textStyle: 'caption' }), foregroundStyle(ALERT_COLORS[alert.type])]}>
                  {alert.date}
                </Text>
              </LabeledContent>
            ))}
          </Section>
        </List>
      </ScreenHost>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
    paddingHorizontal: spacing.lg,
  },
  host: {
    flex: 1,
    marginTop: spacing.sm,
  },
  pageTitle: {
    ...fonts.bold,
    fontSize: fontSize.largeTitle,
    color: colors.label,
    letterSpacing: -0.4,
  },
});
