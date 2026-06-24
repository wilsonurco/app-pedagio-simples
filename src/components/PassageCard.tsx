import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Check, ChevronRight, iconStroke } from '@/components/ui/icons';
import { GroupedDivider } from '@/components/ui/GroupedList';
import { formatBRL, passageTypeLabels, type Passage } from '@/data/mock';
import { formatDateDisplay, formatDateTimeDisplay } from '@/utils/dateTime';
import { formatPassageIdNumeric } from '@/utils/passageId';
import { colors, fontSize, spacing } from '@/theme/tokens';
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
  const typeLabel = passageTypeLabels[passage.type];
  const isPending = passage.status === 'pending';

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
    <View>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Passagem ${formatPassageIdNumeric(passage.passageId)}, ${formatBRL(passage.amount)}`}
        style={({ pressed }) => [
          styles.row,
          selected && styles.rowSelected,
          pressed && styles.rowPressed,
        ]}
      >
        {selectable ? (
          <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
            {selected ? <Check size={12} color={colors.onTint} strokeWidth={2.5} /> : null}
          </View>
        ) : null}

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.plaza} numberOfLines={1}>
                {passage.plaza}
              </Text>
              <Text style={styles.tagLine}>
                {typeLabel} · {isPending ? 'Pendente' : 'Pago'}
              </Text>
            </View>
            <View style={styles.trailing}>
              <Text style={styles.amount}>{formatBRL(passage.amount)}</Text>
              {!selectable ? (
                <ChevronRight size={15} color={colors.quaternaryLabel} strokeWidth={iconStroke} />
              ) : null}
            </View>
          </View>

          <Text style={styles.metaLine} numberOfLines={1}>
            {passage.highway}
          </Text>
          <Text style={styles.metaLine} numberOfLines={1}>
            {formatDateTimeDisplay(passage.date)} · {passage.plate} ·{' '}
            {formatPassageIdNumeric(passage.passageId)}
          </Text>
          {passage.dueDate && isPending ? (
            <Text style={styles.metaLine} numberOfLines={1}>
              Vence {formatDateDisplay(passage.dueDate)}
            </Text>
          ) : null}
        </View>
      </Pressable>
      {showDivider ? <GroupedDivider inset={selectable ? spacing.lg + 22 + spacing.md : spacing.lg} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  rowSelected: {
    backgroundColor: 'rgba(91, 46, 140, 0.03)',
  },
  rowPressed: {
    opacity: 0.65,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.quaternaryLabel,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxSelected: {
    borderColor: colors.tint,
    backgroundColor: colors.tint,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  plaza: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
    letterSpacing: -0.2,
  },
  tagLine: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.secondaryLabel,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  amount: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  metaLine: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
    fontVariant: ['tabular-nums'],
  },
});
