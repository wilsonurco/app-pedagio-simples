import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlertsList } from '@/components/AlertsList';
import { ScreenTitle } from '@/components/ScreenTitle';
import { alerts } from '@/data/mock';
import { spacing, colors } from '@/theme/tokens';

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.sm, paddingBottom: spacing.xxl },
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
