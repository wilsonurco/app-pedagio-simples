import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ChevronRight, iconStroke } from '@/components/ui/icons';
import { GroupedDivider, GroupedList } from '@/components/ui/GroupedList';
import { alerts } from '@/data/mock';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export function RecentActivitySection() {
  const [expanded, setExpanded] = useState(false);
  const eventCount = alerts.length;
  const hasAlert = alerts.some((a) => a.type === 'warning' || a.type === 'danger');

  return (
    <GroupedList>
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
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Atividade recente</Text>
          <Text style={styles.subtitle}>
            {eventCount} {eventCount === 1 ? 'evento' : 'eventos'}
            {hasAlert ? ' · atenção necessária' : ''}
          </Text>
        </View>
        <ChevronRight size={16} color={colors.quaternaryLabel} strokeWidth={iconStroke} />
      </Pressable>

      {expanded
        ? alerts.map((alert, index) => (
            <View key={alert.id}>
              <GroupedDivider />
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{alert.title}</Text>
                <Text style={styles.itemDesc}>{alert.description}</Text>
              </View>
            </View>
          ))
        : null}
    </GroupedList>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 44,
  },
  pressed: {
    opacity: 0.65,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
  },
  subtitle: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
  },
  item: {
    gap: 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  itemTitle: {
    ...fonts.medium,
    fontSize: fontSize.subheadline,
    color: colors.label,
  },
  itemDesc: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    lineHeight: 18,
  },
});
