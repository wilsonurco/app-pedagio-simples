import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Chart,
  Host,
  LabeledContent,
  List,
  Section,
  Text,
} from '@expo/ui/swift-ui';
import {
  buttonStyle,
  controlSize,
  font,
  foregroundStyle,
  frame,
  listStyle,
  tint as tintModifier,
} from '@expo/ui/swift-ui/modifiers';

import { ScreenHost } from '@/components/ios/ScreenHost';
import { alerts, formatBRL, history, pendingAmount } from '@/data/mock';
import { colors, spacing } from '@/theme/tokens';

const TINT = tintModifier(colors.tint);
const maxHistory = Math.max(...history.map((p) => p.value));

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScreenHost>
        <List modifiers={[listStyle('insetGrouped')]}>
          <Section title="Pendente">
            <LabeledContent label="Valor em aberto">
              <Text
                modifiers={[
                  font({ textStyle: 'title2', weight: 'bold' }),
                  foregroundStyle(colors.tint),
                ]}
              >
                {formatBRL(pendingAmount)}
              </Text>
            </LabeledContent>
            <LabeledContent label="Vencimento">
              <Text modifiers={[foregroundStyle({ type: 'hierarchical', style: 'secondary' })]}>
                Vence em 3 dias
              </Text>
            </LabeledContent>
          </Section>

          <Section title="Histórico">
            <Chart
              type="bar"
              data={history.map((point) => ({
                x: point.label,
                y: point.value,
                color: point.value === maxHistory ? colors.tint : undefined,
              }))}
              barStyle={{ cornerRadius: 4 }}
              modifiers={[frame({ height: 140 })]}
            />
          </Section>

          <Section title="Alertas">
            {alerts.slice(0, 2).map((alert) => (
              <LabeledContent key={alert.id} label={alert.title}>
                <Text modifiers={[foregroundStyle({ type: 'hierarchical', style: 'secondary' })]}>
                  {alert.description}
                </Text>
              </LabeledContent>
            ))}
          </Section>
        </List>
      </ScreenHost>

      <View style={[styles.footer, { paddingBottom: spacing.sm }]}>
        <Host matchContents modifiers={[TINT, buttonStyle('borderedProminent'), controlSize('large')]}>
          <Button
            label="Pagar Agora"
            systemImage="bolt.fill"
            onPress={() => router.push('/pagar')}
          />
        </Host>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.secondaryBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
});
