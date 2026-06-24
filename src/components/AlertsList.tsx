import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GroupedDivider, GroupedList } from '@/components/ui/GroupedList';
import { ChevronRight, iconStroke } from '@/components/ui/icons';
import { alerts, type AlertItem } from '@/data/mock';
import { formatDateTimeDisplay } from '@/utils/dateTime';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type AlertsListProps = {
  data?: AlertItem[];
};

const TYPE_LABEL: Record<AlertItem['type'], string> = {
  info: 'Informação',
  warning: 'Atenção',
  danger: 'Urgente',
};

export function AlertsList({ data = alerts }: AlertsListProps) {
  function handlePress(item: AlertItem) {
    if (item.passageId) {
      router.push(`/passagem/${item.passageId}`);
      return;
    }
    if (item.type === 'warning') {
      router.push('/pagar');
    }
  }

  return (
    <GroupedList>
      {data.map((item, index) => {
        const isInteractive = Boolean(item.passageId) || item.type === 'warning';

        const content = (
          <>
            <View style={styles.itemText}>
              <Text style={styles.itemEyebrow}>{TYPE_LABEL[item.type]}</Text>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemDate}>{formatDateTimeDisplay(item.date)}</Text>
            </View>
            {isInteractive ? (
              <ChevronRight size={16} color={colors.quaternaryLabel} strokeWidth={iconStroke} />
            ) : null}
          </>
        );

        if (!isInteractive) {
          return (
            <View key={item.id}>
              {index > 0 ? <GroupedDivider /> : null}
              <View style={styles.item}>{content}</View>
            </View>
          );
        }

        return (
          <View key={item.id}>
            {index > 0 ? <GroupedDivider /> : null}
            <Pressable
              onPress={() => handlePress(item)}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            >
              {content}
            </Pressable>
          </View>
        );
      })}
    </GroupedList>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  pressed: {
    opacity: 0.65,
  },
  itemText: {
    flex: 1,
    gap: 2,
  },
  itemEyebrow: {
    ...fonts.medium,
    fontSize: fontSize.caption2,
    color: colors.tertiaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  itemTitle: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
  },
  itemDescription: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    lineHeight: 18,
  },
  itemDate: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
});
