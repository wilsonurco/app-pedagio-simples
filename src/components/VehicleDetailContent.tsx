import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenBackButton } from '@/components/ScreenBackButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { Car, iconSize, iconStroke } from '@/components/ui/icons';
import { userProfile, type Vehicle } from '@/data/mock';
import { useAppTopPadding } from '@/hooks/useAppTopPadding';
import { getVehicleImageSource } from '@/utils/vehicleImages';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
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
  const imageSource = getVehicleImageSource(vehicle.model);

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

      <View style={styles.heroCard}>
        <View style={styles.imageWrap}>
          {imageSource ? (
            <Image
              source={imageSource}
              style={styles.image}
              contentFit="contain"
              backgroundColor="#FFFFFF"
              accessibilityLabel={`Foto do ${vehicle.model}`}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Car size={iconSize.xl} color={colors.tint} strokeWidth={iconStroke} />
            </View>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <DetailRow label="Modelo" value={vehicle.model} />
        <View style={styles.divider} />
        <DetailRow label="Placa" value={vehicle.plate} />
        <View style={styles.divider} />
        <DetailRow label="Titular" value={userProfile.name} />
        <View style={styles.divider} />
        <DetailRow label="E-mail da conta" value={userProfile.email} />
      </View>
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
  heroCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  imageWrap: {
    width: '100%',
    maxWidth: 320,
    height: 160,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(91, 46, 140, 0.08)',
  },
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  detailRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  detailLabel: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.secondaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
});
