import { StyleSheet, Text, View } from 'react-native';

import { PassageCard } from '@/components/PassageCard';
import { usePassages } from '@/context/PassagesContext';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type TransactionListProps = {
  filter?: 'all' | 'pending' | 'paid';
  title?: string;
};

export function TransactionList({ filter = 'all', title }: TransactionListProps) {
  const { passages } = usePassages();

  const data = passages.filter((passage) => {
    if (filter === 'pending') return passage.status === 'pending';
    if (filter === 'paid') return passage.status === 'paid';
    return true;
  });

  return (
    <View style={styles.wrapper}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.card}>
        {data.map((passage, index) => (
          <PassageCard
            key={passage.id}
            passage={passage}
            showDivider={index < data.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  title: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
  },
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});
