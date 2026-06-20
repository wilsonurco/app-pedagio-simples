import { StyleSheet, Text, View } from 'react-native';

import { type PassageType, passageTypeLabels } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PassageTypeBadgeProps = {
  type: PassageType;
};

export function PassageTypeBadge({ type }: PassageTypeBadgeProps) {
  const isFreeFlow = type === 'free-flow';

  return (
    <View style={[styles.badge, isFreeFlow ? styles.freeFlow : styles.conventional]}>
      <Text style={[styles.text, isFreeFlow ? styles.freeFlowText : styles.conventionalText]}>
        {passageTypeLabels[type]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  conventional: {
    backgroundColor: 'rgba(91, 46, 140, 0.1)',
  },
  freeFlow: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  text: {
    ...fonts.medium,
    fontSize: fontSize.caption,
  },
  conventionalText: {
    color: colors.tint,
  },
  freeFlowText: {
    color: colors.systemBlue,
  },
});
