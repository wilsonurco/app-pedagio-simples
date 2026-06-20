import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { HistoryChart } from '@/components/HistoryChart';
import { PayButton } from '@/components/PayButton';
import { PendingCard } from '@/components/PendingCard';
import { TransactionList } from '@/components/TransactionList';
import { usePassages } from '@/context/PassagesContext';
import { colors, spacing } from '@/theme/tokens';
import { buildMonthlyHistory } from '@/utils/history';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { pendingPassages, passages } = usePassages();
  const monthlyHistory = buildMonthlyHistory(passages);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.sm, paddingBottom: spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Header onPressNotifications={() => router.push('/alertas')} />

        <View style={styles.stack}>
          <PendingCard />
          {pendingPassages.length > 0 ? (
            <TransactionList filter="pending" title="Passagens pendentes" />
          ) : null}
          <HistoryChart
            data={monthlyHistory}
            onPressDetail={() => router.push('/historico')}
          />
        </View>
      </ScrollView>

      {pendingPassages.length > 0 ? (
        <View style={[styles.footer, { paddingBottom: spacing.sm }]}>
          <PayButton onPress={() => router.push('/pagar')} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  stack: {
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.groupedBackground,
  },
});
