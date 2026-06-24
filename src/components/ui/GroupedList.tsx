import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type GroupedListProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

type GroupedSectionProps = {
  title?: string;
  children: React.ReactNode;
};

export function GroupedList({ children, style }: GroupedListProps) {
  return <View style={[styles.group, style]}>{children}</View>;
}

export function GroupedSection({ title, children }: GroupedSectionProps) {
  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      <GroupedList>{children}</GroupedList>
    </View>
  );
}

export function GroupedDivider({ inset = spacing.lg }: { inset?: number }) {
  return <View style={[styles.divider, { marginLeft: inset }]} />;
}

export const groupedListStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 44,
    gap: spacing.md,
  },
  rowPressed: {
    opacity: 0.65,
  },
});

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: spacing.xs,
  },
  group: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.card,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
  },
});
