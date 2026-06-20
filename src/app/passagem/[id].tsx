import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PassageDetailContent } from '@/components/PassageDetailContent';
import { usePassages } from '@/context/PassagesContext';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export default function PassageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPassage } = usePassages();
  const passage = id ? getPassage(id) : undefined;

  if (!passage) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Passagem não encontrada.</Text>
      </View>
    );
  }

  return <PassageDetailContent passage={passage} />;
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
