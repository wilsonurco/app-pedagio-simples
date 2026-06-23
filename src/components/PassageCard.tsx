import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PassageTypeBadge } from '@/components/PassageTypeBadge';
import { ChevronRight, iconSize, iconStroke, ScanLine, Signpost } from '@/components/ui/icons';
import { formatBRL, type Passage } from '@/data/mock';
import { formatDateTimeDisplay } from '@/utils/dateTime';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PassageCardProps = {
  passage: Passage;
  showDivider?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
  onPress?: () => void;
};

export function PassageCard({
  passage,
  showDivider = false,
  selectable = false,
  selected = false,
  onToggleSelect,
  onPress,
}: PassageCardProps) {
  const isFreeFlow = passage.type === 'free-flow';
  const TypeIcon = isFreeFlow ? ScanLine : Signpost;

  function handlePress() {
    if (selectable && onToggleSelect) {
      onToggleSelect();
      return;
    }
    if (onPress) {
      onPress();
      return;
    }
    router.push(`/passagem/${passage.id}`);
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Passagem ${passage.passageId}, ${formatBRL(passage.amount)}`}
      style={({ pressed }) => [styles.row, showDivider && styles.divider, pressed && styles.pressed]}
    >
      {selectable ? (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected ? <View style={styles.checkboxInner} /> : null}
        </View>
      ) : (
        <View style={styles.iconWrap}>
          <TypeIcon size={iconSize.sm} color={colors.tint} strokeWidth={iconStroke} />
        </View>
      )}

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.plaza} numberOfLines={1}>
            {passage.plaza}
          </Text>
          <PassageTypeBadge type={passage.type} />
        </View>
        <Text style={styles.highway}>{passage.highway}</Text>
        <Text style={styles.meta}>
          {passage.plate} • {passage.passageId}
        </Text>
        <Text style={styles.date}>{formatDateTimeDisplay(passage.date)}</Text>
      </View>

      <View style={styles.trailing}>
        <Text style={styles.amount}>{formatBRL(passage.amount)}</Text>
        <Text
          style={[
            styles.status,
            passage.status === 'pending' ? styles.statusPending : styles.statusPaid,
          ]}
        >
          {passage.status === 'pending' ? 'Pendente' : 'Pago'}
        </Text>
        {!selectable ? (
          <ChevronRight size={16} color={colors.tertiaryLabel} strokeWidth={iconStroke} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 44,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  pressed: {
    opacity: 0.6,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(91, 46, 140, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.tertiaryLabel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: colors.tint,
    backgroundColor: colors.tint,
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.onTint,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  plaza: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.label,
    flexShrink: 1,
  },
  highway: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  meta: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
  },
  date: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amount: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.label,
  },
  status: {
    ...fonts.regular,
    fontSize: fontSize.caption,
  },
  statusPending: {
    color: colors.systemOrange,
  },
  statusPaid: {
    color: colors.systemGreen,
  },
});
