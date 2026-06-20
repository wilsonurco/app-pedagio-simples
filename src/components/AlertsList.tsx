import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { alertIcons, iconSize, iconStroke } from '@/components/ui/icons';
import { alerts, type AlertItem } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type AlertsListProps = {
  data?: AlertItem[];
};

const ICON_COLORS: Record<AlertItem['type'], string> = {
  info: colors.systemBlue,
  warning: colors.systemOrange,
  danger: colors.systemRed,
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
    <View style={styles.card}>
      <Text style={styles.title}>Alertas</Text>

      <View>
        {data.map((item, index) => {
          const Icon = alertIcons[item.type];
          const isInteractive = Boolean(item.passageId) || item.type === 'warning';

          const content = (
            <>
              <View style={[styles.iconWrap, { backgroundColor: `${ICON_COLORS[item.type]}18` }]}>
                <Icon size={iconSize.sm} color={ICON_COLORS[item.type]} strokeWidth={iconStroke} />
              </View>
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemDate}>{item.date}</Text>
              </View>
            </>
          );

          if (!isInteractive) {
            return (
              <View
                key={item.id}
                style={[styles.item, index < data.length - 1 && styles.itemDivider]}
              >
                {content}
              </View>
            );
          }

          return (
            <Pressable
              key={item.id}
              onPress={() => handlePress(item)}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              style={({ pressed }) => [
                styles.item,
                index < data.length - 1 && styles.itemDivider,
                pressed && styles.pressed,
              ]}
            >
              {content}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  itemDivider: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
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
  },
});
