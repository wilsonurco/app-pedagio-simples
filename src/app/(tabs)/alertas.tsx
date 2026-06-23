import { ScrollView, StyleSheet } from 'react-native';

import { AlertsList } from '@/components/AlertsList';
import { ScreenTitle } from '@/components/ScreenTitle';
import { alerts } from '@/data/mock';
import { useAppTopPadding } from '@/hooks/useAppTopPadding';
import { spacing, colors } from '@/theme/tokens';

export default function AlertsScreen() {
  const topPadding = useAppTopPadding(spacing.sm);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPadding, paddingBottom: spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenTitle title="Alertas" subtitle="Avisos e movimentações da sua conta" />
      <AlertsList data={alerts} />
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
