import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HistoryChart } from '@/components/HistoryChart';
import { ScreenTitle } from '@/components/ScreenTitle';
import { TransactionList } from '@/components/TransactionList';
import { spacing, colors } from '@/theme/tokens';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.sm, paddingBottom: spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenTitle title="Histórico" subtitle="Gastos e passagens recentes" />
      <HistoryChart />
      <TransactionList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    backgroundColor: colors.groupedBackground,
    flexGrow: 1,
  },
});
