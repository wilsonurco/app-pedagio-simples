import { useEffect, useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Form,
  Host,
  LabeledContent,
  Section,
  Text,
  Toggle,
} from '@expo/ui/swift-ui';
import {
  buttonStyle,
  controlSize,
  font,
  foregroundStyle,
  tint as tintModifier,
} from '@expo/ui/swift-ui/modifiers';

import { ScreenHost } from '@/components/ios/ScreenHost';
import { usePassages } from '@/context/PassagesContext';
import { formatBRL, sumPassagesAmount } from '@/data/mock';
import { navigateBack } from '@/utils/navigation';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

const TINT = tintModifier(colors.tint);

export default function PaymentPassagesScreen() {
  const insets = useSafeAreaInsets();
  const { selected: selectedParam } = useLocalSearchParams<{ selected?: string }>();
  const { pendingPassages } = usePassages();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const pendingIds = useMemo(() => pendingPassages.map((p) => p.id), [pendingPassages]);

  useEffect(() => {
    if (selectedParam) {
      const ids = selectedParam.split(',').filter((id) => pendingIds.includes(id));
      setSelectedIds(ids.length > 0 ? ids : pendingIds);
      return;
    }
    setSelectedIds(pendingIds);
  }, [selectedParam, pendingIds.join(',')]);

  const selectedPassages = useMemo(
    () => pendingPassages.filter((p) => selectedIds.includes(p.id)),
    [pendingPassages, selectedIds],
  );

  const total = sumPassagesAmount(selectedPassages);
  const allSelected = pendingIds.length > 0 && selectedIds.length === pendingIds.length;

  function togglePassage(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : pendingIds);
  }

  function handleContinue() {
    if (selectedIds.length === 0) return;
    router.push({
      pathname: '/pagar-forma',
      params: { selected: selectedIds.join(',') },
    });
  }

  if (pendingPassages.length === 0) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <RNText style={styles.emptyTitle}>Nenhuma passagem pendente</RNText>
        <RNText style={styles.emptySubtitle}>Você está em dia com seus pedágios.</RNText>
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Host matchContents modifiers={[TINT, buttonStyle('borderedProminent'), controlSize('large')]}>
            <Button label="Voltar" onPress={() => navigateBack()} />
          </Host>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Host matchContents modifiers={[buttonStyle('borderless')]}>
          <Button label="Fechar" systemImage="xmark" onPress={() => navigateBack()} />
        </Host>
        <RNText style={styles.headerTitle}>Passagens</RNText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.selectAllRow}>
        <Pressable onPress={toggleAll} hitSlop={8}>
          <RNText style={styles.selectAll}>
            {allSelected ? 'Desmarcar todas' : 'Selecionar todas'}
          </RNText>
        </Pressable>
      </View>

      <ScreenHost>
        <Form>
          <Section>
            <LabeledContent label="Total selecionado">
              <Text
                modifiers={[
                  font({ textStyle: 'title2', weight: 'bold' }),
                  foregroundStyle(colors.tint),
                ]}
              >
                {formatBRL(total)}
              </Text>
            </LabeledContent>
            <LabeledContent label="Passagens">
              <Text modifiers={[foregroundStyle({ type: 'hierarchical', style: 'secondary' })]}>
                {selectedIds.length} de {pendingPassages.length}
              </Text>
            </LabeledContent>
          </Section>

          <Section title="Pendentes">
            {pendingPassages.map((passage) => (
              <Toggle
                key={passage.id}
                label={`${passage.plaza} • ${passage.highway}`}
                systemImage={passage.type === 'free-flow' ? 'dot.radiowaves.left.and.right' : 'signpost.right'}
                isOn={selectedIds.includes(passage.id)}
                onIsOnChange={(isOn) => {
                  if (isOn !== selectedIds.includes(passage.id)) {
                    togglePassage(passage.id);
                  }
                }}
              />
            ))}
          </Section>
        </Form>
      </ScreenHost>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Host matchContents modifiers={[TINT, buttonStyle('borderedProminent'), controlSize('large')]}>
          <Button
            label={selectedIds.length > 0 ? 'Ir para o pagamento' : 'Selecione passagens'}
            systemImage="arrow.right.circle.fill"
            onPress={handleContinue}
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
  },
  headerSpacer: {
    width: 60,
  },
  selectAllRow: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  selectAll: {
    ...fonts.medium,
    fontSize: fontSize.footnote,
    color: colors.tint,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  emptyTitle: {
    ...fonts.bold,
    fontSize: fontSize.title3,
    color: colors.label,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
    textAlign: 'center',
  },
});
