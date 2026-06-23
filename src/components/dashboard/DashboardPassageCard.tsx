import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Calendar, Car, ChevronDown, iconStroke, MapPin, Shield } from '@/components/ui/icons';
import { formatBRL, passageTypeLabels, type Passage } from '@/data/mock';
import { formatDateTimeDisplay } from '@/utils/dateTime';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type DashboardPassageCardProps = {
  passage: Passage;
  selected: boolean;
  onToggleSelect: () => void;
  defaultExpanded?: boolean;
};

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailCell}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={2}>
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
}: DashboardPassageCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isFreeFlow = passage.type === 'free-flow';
  const typeLabel = passageTypeLabels[passage.type];

  function toggleExpanded() {
    setExpanded((current) => !current);
  }

  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <View style={styles.topRow}>
        <Pressable
          onPress={onToggleSelect}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: selected }}
          accessibilityLabel={`Selecionar passagem ${passage.passageId}`}
          hitSlop={8}
          style={[styles.checkbox, selected && styles.checkboxSelected]}
        >
          {selected ? <View style={styles.checkboxInner} /> : null}
        </Pressable>

        <Pressable
          onPress={toggleExpanded}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={`${expanded ? 'Recolher' : 'Expandir'} detalhes da passagem ${passage.passageId}`}
          style={({ pressed }) => [styles.summary, pressed && styles.summaryPressed]}
        >
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              <MapPin size={14} color={colors.tint} strokeWidth={iconStroke} />
              <Text style={styles.plaza} numberOfLines={1}>
                {passage.plaza}
              </Text>
              <View style={[styles.typeBadge, isFreeFlow ? styles.typeFreeFlow : styles.typeManual]}>
                <Text style={[styles.typeText, isFreeFlow ? styles.typeFreeFlowText : styles.typeManualText]}>
                  {typeLabel}
                </Text>
              </View>
              <ChevronDown
                size={16}
                color={colors.tertiaryLabel}
                strokeWidth={iconStroke}
                style={expanded ? styles.chevronExpanded : undefined}
              />
            </View>

            <View style={styles.amountRow}>
              <Text style={styles.amount}>{formatBRL(passage.amount)}</Text>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Pendente</Text>
              </View>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar size={12} color={colors.tertiaryLabel} strokeWidth={iconStroke} />
              <Text style={styles.metaText}>{formatDateTimeDisplay(passage.date)}</Text>
            </View>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText} numberOfLines={1}>
              {passage.concessionaire}
            </Text>
            <Text style={styles.metaDot}>·</Text>
            <View style={styles.metaItem}>
              <Shield size={12} color={colors.tertiaryLabel} strokeWidth={iconStroke} />
              <Text style={styles.metaText}>Vence: {formatDateTimeDisplay(passage.dueDate)}</Text>
            </View>
            <Text style={styles.metaDot}>·</Text>
            <View style={styles.metaItem}>
              <Car size={12} color={colors.tertiaryLabel} strokeWidth={iconStroke} />
              <Text style={styles.metaText}>{passage.plate}</Text>
            </View>
          </View>
        </Pressable>
      </View>

      {expanded ? (
        <View style={styles.details}>
          <View style={styles.detailGrid}>
            <DetailCell label="ID DA PASSAGEM" value={passage.passageId} />
            <DetailCell label="RODOVIA" value={passage.highway.replace('Rod. ', '')} />
            <DetailCell label="QUILÔMETRO" value={passage.km.toLowerCase()} />
          </View>

          <View style={styles.plazaDetail}>
            <Text style={styles.detailLabel}>PRAÇA</Text>
            <Text style={styles.plazaDetailValue}>
              {passage.plaza} — {passage.km.toUpperCase()}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: colors.separator,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.secondaryBackground,
  },
  cardSelected: {
    borderColor: colors.cardSelectedBorder,
    backgroundColor: colors.cardSelectedBg,
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.tertiaryLabel,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxSelected: {
    borderColor: colors.tint,
    backgroundColor: colors.tint,
  },
  checkboxInner: {
    width: 7,
    height: 7,
    borderRadius: 2,
    backgroundColor: colors.onTint,
  },
  summary: {
    flex: 1,
    gap: spacing.xs,
  },
  summaryPressed: {
    opacity: 0.7,
  },
  headerContent: {
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  plaza: {
    ...fonts.semibold,
    flex: 1,
    fontSize: fontSize.footnote,
    color: colors.label,
  },
  typeBadge: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  typeManual: {
    backgroundColor: colors.badgePurpleBg,
  },
  typeFreeFlow: {
    backgroundColor: colors.badgeGreenBg,
  },
  typeText: {
    ...fonts.medium,
    fontSize: fontSize.caption2,
  },
  typeManualText: {
    color: colors.tint,
  },
  typeFreeFlowText: {
    color: colors.systemGreen,
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  amount: {
    ...fonts.bold,
    fontSize: fontSize.headline,
    color: colors.tint,
    letterSpacing: -0.3,
  },
  pendingBadge: {
    backgroundColor: colors.badgeOrangeBg,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  pendingText: {
    ...fonts.medium,
    fontSize: fontSize.caption2,
    color: colors.systemOrange,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: spacing.xs,
    rowGap: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaDot: {
    ...fonts.regular,
    fontSize: fontSize.caption2,
    color: colors.tertiaryLabel,
  },
  metaText: {
    ...fonts.regular,
    fontSize: fontSize.caption2,
    color: colors.secondaryLabel,
  },
  details: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  detailCell: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    ...fonts.medium,
    fontSize: fontSize.caption2,
    color: colors.tertiaryLabel,
    letterSpacing: 0.3,
  },
  detailValue: {
    ...fonts.semibold,
    fontSize: fontSize.caption,
    color: colors.label,
  },
  plazaDetail: {
    gap: 2,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  plazaDetailValue: {
    ...fonts.medium,
    fontSize: fontSize.caption,
    color: colors.label,
  },
});
