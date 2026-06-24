import { useEffect, useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PassageCard } from '@/components/PassageCard';
import { PayButton } from '@/components/PayButton';
import { GroupedList } from '@/components/ui/GroupedList';
import { iconSize, iconStroke, X } from '@/components/ui/icons';
import { usePassages } from '@/context/PassagesContext';
import { formatBRL, sumPassagesAmount } from '@/data/mock';
import { navigateBack } from '@/utils/navigation';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

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
        <Text style={styles.emptyTitle}>Nenhuma passagem pendente</Text>
        <Text style={styles.emptySubtitle}>Você está em dia com seus pedágios.</Text>
        <View style={[styles.footer, styles.successFooter, { paddingBottom: insets.bottom + spacing.md }]}>
          <PayButton label="Voltar" onPress={() => navigateBack()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => navigateBack()}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          hitSlop={12}
          style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
        >
          <X size={iconSize.md} color={colors.label} strokeWidth={iconStroke} />
        </Pressable>
        <Text style={styles.topTitle}>Passagens</Text>
        <View style={styles.closeBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GroupedList>
          <View style={styles.amountRow}>
            <View>
              <Text style={styles.amountLabel}>Total selecionado</Text>
              <Text style={styles.amount}>{formatBRL(total)}</Text>
            </View>
            <Text style={styles.amountHint}>
              {selectedIds.length} de {pendingPassages.length}
            </Text>
          </View>
        </GroupedList>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Passagens</Text>
          <Pressable onPress={toggleAll} hitSlop={8}>
            <Text style={styles.selectAll}>{allSelected ? 'Desmarcar todas' : 'Selecionar todas'}</Text>
          </Pressable>
        </View>

        <GroupedList>
          {pendingPassages.map((passage, index) => (
            <PassageCard
              key={passage.id}
              passage={passage}
              showDivider={index < pendingPassages.length - 1}
              selectable
              selected={selectedIds.includes(passage.id)}
              onToggleSelect={() => togglePassage(passage.id)}
            />
          ))}
        </GroupedList>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PayButton
          label={selectedIds.length > 0 ? 'Ir para o pagamento' : 'Selecione passagens'}
          disabled={selectedIds.length === 0}
          onPress={handleContinue}
        />
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
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    backgroundColor: colors.fill,
  },
  topTitle: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  amountLabel: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    marginBottom: 2,
  },
  amount: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  amountHint: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
    paddingBottom: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  selectAll: {
    ...fonts.medium,
    fontSize: fontSize.subheadline,
    color: colors.tint,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  successFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});
