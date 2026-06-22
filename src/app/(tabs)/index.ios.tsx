import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
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
  listStyle,
  tint as tintModifier,
} from '@expo/ui/swift-ui/modifiers';

import { ScreenHost } from '@/components/ios/ScreenHost';
import { formatBRL, pendingAmount } from '@/data/mock';
import { colors, spacing } from '@/theme/tokens';

const TINT = tintModifier(colors.tint);

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
    backgroundColor: colors.groupedBackground,
  },
});
