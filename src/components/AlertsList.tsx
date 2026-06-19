import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { alerts, type AlertItem } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type AlertsListProps = {
  data?: AlertItem[];
};

const ICONS: Record<AlertItem['type'], keyof typeof MaterialIcons.glyphMap> = {
  info: 'info-outline',
  warning: 'warning-amber',
  danger: 'error-outline',
};

const ICON_COLORS: Record<AlertItem['type'], string> = {
  info: colors.systemBlue,
  warning: colors.systemOrange,
  danger: colors.systemRed,
};

export function AlertsList({ data = alerts }: AlertsListProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Alertas</Text>

      <View>
        {data.map((item, index) => (
          <View
            key={item.id}
            style={[styles.item, index < data.length - 1 && styles.itemDivider]}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${ICON_COLORS[item.type]}18` }]}>
              <MaterialIcons name={ICONS[item.type]} size={20} color={ICON_COLORS[item.type]} />
            </View>
            <View style={styles.itemText}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
          </View>
        ))}
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
