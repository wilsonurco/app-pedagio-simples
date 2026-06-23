import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { VehicleDetailContent } from '@/components/VehicleDetailContent';
import { useVehicles } from '@/context/VehiclesContext';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export default function VehicleDetailScreen() {
  const { plate } = useLocalSearchParams<{ plate: string }>();
  const { getVehicle } = useVehicles();
  const vehicle = plate ? getVehicle(plate) : undefined;

  if (!vehicle) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Veículo não encontrado.</Text>
      </View>
    );
  }

  return <VehicleDetailContent vehicle={vehicle} />;
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.groupedBackground,
    padding: spacing.xl,
  },
  emptyText: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
  },
});
