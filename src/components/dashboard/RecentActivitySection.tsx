import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Calendar, ChevronDown, iconStroke } from '@/components/ui/icons';
import { alerts } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export function RecentActivitySection() {
  const [expanded, setExpanded] = useState(false);
  const eventCount = alerts.length;
  const hasAlert = alerts.some((a) => a.type === 'warning' || a.type === 'danger');

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          if (expanded) {
            setExpanded(false);
          } else {
            router.push('/alertas');
          }
        }}
        accessibilityRole="button"
        accessibilityLabel="Atividade recente"
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
      >
        <View style={styles.left}>
          <Calendar size={18} color={colors.tint} strokeWidth={iconStroke} />
          <Text style={styles.title}>Atividade recente</Text>
          {hasAlert ? (
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>Alerta</Text>
            </View>
          ) : null}
          <Text style={styles.eventCount}>
            {eventCount} {eventCount === 1 ? 'evento' : 'eventos'}
          </Text>
        </View>
        <ChevronDown size={18} color={colors.tertiaryLabel} strokeWidth={iconStroke} />
      </Pressable>

      {expanded ? (
        <View style={styles.list}>
          {alerts.map((alert) => (
            <View key={alert.id} style={styles.item}>
              <Text style={styles.itemTitle}>{alert.title}</Text>
              <Text style={styles.itemDesc}>{alert.description}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  headerPressed: {
    backgroundColor: colors.fill,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    flexWrap: 'wrap',
  },
  title: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.label,
  },
  alertBadge: {
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  alertBadgeText: {
    ...fonts.semibold,
    fontSize: fontSize.caption2,
    color: colors.systemRed,
  },
  eventCount: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
  },
  list: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  item: {
    gap: 2,
    paddingTop: spacing.sm,
  },
  itemTitle: {
    ...fonts.medium,
    fontSize: fontSize.footnote,
    color: colors.label,
  },
  itemDesc: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.secondaryLabel,
  },
});
