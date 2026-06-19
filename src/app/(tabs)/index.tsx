import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlertsList } from '@/components/AlertsList';
import { Header } from '@/components/Header';
import { HistoryChart } from '@/components/HistoryChart';
import { PayButton } from '@/components/PayButton';
import { PendingCard } from '@/components/PendingCard';
import { alerts, pendingAmount } from '@/data/mock';
import { colors, spacing } from '@/theme/tokens';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

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
          <PendingCard amount={pendingAmount} />
          <HistoryChart />
          <AlertsList data={alerts.slice(0, 2)} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: spacing.sm }]}>
        <PayButton onPress={() => router.push('/pagar')} />
      </View>
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
    backgroundColor: colors.secondaryBackground,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
});
