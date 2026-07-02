import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenBackButton } from '@/components/ScreenBackButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { VehicleAvatar } from '@/components/VehicleAvatar';
import { GroupedDivider, GroupedList } from '@/components/ui/GroupedList';
import { userProfile, type Vehicle } from '@/data/mock';
import { useAppTopPadding } from '@/hooks/useAppTopPadding';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type VehicleDetailContentProps = {
  vehicle: Vehicle;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function VehicleDetailContent({ vehicle }: VehicleDetailContentProps) {
  const insets = useSafeAreaInsets();
  const topPadding = useAppTopPadding(spacing.sm);

  const rows = [
    { label: 'Modelo', value: vehicle.model },
    { label: 'Placa', value: vehicle.plate },
    { label: 'Titular', value: userProfile.name },
    { label: 'E-mail da conta', value: userProfile.email },
  ];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPadding, paddingBottom: insets.bottom + spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenBackButton label="Meus veículos" fallback="/veiculos" />
      <ScreenTitle title={vehicle.model} subtitle={`Placa ${vehicle.plate}`} />

      <GroupedList>
        <View style={styles.hero}>
          <VehicleAvatar
            size="lg"
            accessibilityLabel={`Avatar do veículo ${vehicle.model}`}
          />
        </View>
        {rows.map((row, index) => (
          <View key={row.label}>
            <GroupedDivider />
            <DetailRow label={row.label} value={row.value} />
          </View>
        ))}
      </GroupedList>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: colors.groupedBackground,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  detailRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 2,
  },
  detailLabel: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.label,
  },
});
