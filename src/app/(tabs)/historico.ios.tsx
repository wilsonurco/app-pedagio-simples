import { StyleSheet, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chart, LabeledContent, List, Section, Text } from '@expo/ui/swift-ui';
import { font, foregroundStyle, frame, listStyle } from '@expo/ui/swift-ui/modifiers';

import { ScreenHost } from '@/components/ios/ScreenHost';
import { formatBRL, history, transactions } from '@/data/mock';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

const maxHistory = Math.max(...history.map((p) => p.value));

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <RNText style={styles.pageTitle}>Histórico</RNText>

      <ScreenHost style={styles.host}>
        <List modifiers={[listStyle('insetGrouped')]}>
          <Section title="Gastos mensais">
            <Chart
              type="bar"
              data={history.map((point) => ({
                x: point.label,
                y: point.value,
                color: point.value === maxHistory ? colors.tint : undefined,
              }))}
              barStyle={{ cornerRadius: 4 }}
              modifiers={[frame({ height: 160 })]}
            />
          </Section>

          <Section title="Passagens">
            {transactions.map((tx) => (
              <LabeledContent key={tx.id} label={`${tx.plaza} • ${tx.highway}`}>
                <Text
                  modifiers={[
                    font({ weight: 'semibold' }),
                    foregroundStyle(tx.status === 'pending' ? colors.systemOrange : colors.tint),
                  ]}
                >
                  {formatBRL(tx.amount)} — {tx.status === 'pending' ? 'Pendente' : 'Pago'}
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
