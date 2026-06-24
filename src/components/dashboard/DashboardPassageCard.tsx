import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Check, ChevronDown, iconStroke } from '@/components/ui/icons';
import { formatBRL, passageTypeLabels, type Passage } from '@/data/mock';
import { formatDateDisplay, formatDateTimeDisplay } from '@/utils/dateTime';
import { formatPassageIdNumeric } from '@/utils/passageId';
import { colors, fontSize, radius, shadow, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type DashboardPassageCardProps = {
  passage: Passage;
  selected: boolean;
  onToggleSelect: () => void;
  defaultExpanded?: boolean;
  showDivider?: boolean;
};

function DetailCell({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View style={styles.detailCell}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        style={[styles.detailValue, mono && styles.detailValueMono]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {value}
      </Text>
    </View>
  );
}

export function DashboardPassageCard({
  passage,
  selected,
  onToggleSelect,
  defaultExpanded = false,
  showDivider = true,
}: DashboardPassageCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const typeLabel = passageTypeLabels[passage.type];

  function toggleExpanded() {
    setExpanded((current) => !current);
  }

  return (
    <View style={[styles.wrapper, selected && styles.wrapperSelected]}>
      <View style={styles.row}>
        <Pressable
          onPress={onToggleSelect}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: selected }}
          accessibilityLabel={`Selecionar passagem ${passage.passageId}`}
          hitSlop={8}
          style={[styles.checkbox, selected && styles.checkboxSelected]}
        >
          {selected ? <Check size={12} color={colors.onTint} strokeWidth={2.5} /> : null}
        </Pressable>

        <Pressable
          onPress={toggleExpanded}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={`${expanded ? 'Recolher' : 'Expandir'} detalhes da passagem ${passage.passageId}`}
          style={({ pressed }) => [styles.content, pressed && styles.contentPressed]}
        >
          <View style={styles.headerRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.plaza} numberOfLines={1}>
                {passage.plaza}
              </Text>
              <View style={styles.tagRow}>
                <Text style={styles.typeTag}>{typeLabel}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.statusTag}>Pendente</Text>
              </View>
            </View>

            <View style={styles.trailing}>
              <Text style={styles.amount}>{formatBRL(passage.amount)}</Text>
              <ChevronDown
                size={15}
                color={colors.quaternaryLabel}
                strokeWidth={iconStroke}
                style={expanded ? styles.chevronExpanded : undefined}
              />
            </View>
          </View>

          <View style={styles.metaBlock}>
            <Text style={styles.metaLine} numberOfLines={1}>
              {formatDateTimeDisplay(passage.date)} · {passage.concessionaire}
            </Text>
            <Text style={styles.metaLine} numberOfLines={1}>
              Vence {formatDateDisplay(passage.dueDate)} · {passage.plate} ·{' '}
              {formatPassageIdNumeric(passage.passageId)}
            </Text>
          </View>
        </Pressable>
      </View>

      {expanded ? (
        <View style={styles.details}>
          <View style={styles.detailGrid}>
            <DetailCell label="ID" value={formatPassageIdNumeric(passage.passageId)} mono />
            <DetailCell label="Rodovia" value={passage.highway.replace('Rod. ', '')} />
            <DetailCell label="Km" value={passage.km.toLowerCase()} />
          </View>
          <Text style={styles.plazaDetail}>
            {passage.plaza} — {passage.km.toUpperCase()}
          </Text>
        </View>
      ) : null}

      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.secondaryBackground,
  },
  wrapperSelected: {
    backgroundColor: 'rgba(91, 46, 140, 0.03)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
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
    gap: spacing.sm,
  },
  contentPressed: {
    opacity: 0.65,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  plaza: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
    letterSpacing: -0.2,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  typeTag: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.secondaryLabel,
  },
  statusTag: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.systemOrange,
  },
  metaDot: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.quaternaryLabel,
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
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  metaBlock: {
    gap: 2,
  },
  metaLine: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
    fontVariant: ['tabular-nums'],
  },
  details: {
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.groupedBackground,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  detailCell: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    ...fonts.medium,
    fontSize: fontSize.caption2,
    color: colors.tertiaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    ...fonts.medium,
    fontSize: fontSize.footnote,
    color: colors.label,
  },
  detailValueMono: {
    fontVariant: ['tabular-nums'],
  },
  plazaDetail: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    lineHeight: 20,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
    marginLeft: spacing.lg + 22 + spacing.md,
  },
});
