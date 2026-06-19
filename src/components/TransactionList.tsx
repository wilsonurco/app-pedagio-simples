import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { formatBRL, transactions, type Transaction } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type TransactionListProps = {
  data?: Transaction[];
  title?: string;
};

export function TransactionList({ data = transactions, title = 'Passagens' }: TransactionListProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View>
        {data.map((item, index) => (
          <View
            key={item.id}
            style={[styles.item, index < data.length - 1 && styles.itemDivider]}
          >
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name="boom-gate-outline" size={20} color={colors.tint} />
            </View>

            <View style={styles.info}>
              <Text style={styles.plaza}>{item.plaza}</Text>
              <Text style={styles.highway}>
                {item.highway} • {item.date}
              </Text>
            </View>

            <View style={styles.right}>
              <Text style={styles.amount}>{formatBRL(item.amount)}</Text>
              <Text style={[styles.status, item.status === 'pending' && styles.statusPending]}>
                {item.status === 'pending' ? 'Pendente' : 'Pago'}
              </Text>
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
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  plaza: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.label,
  },
  highway: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amount: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.label,
  },
  status: {
    ...fonts.medium,
    fontSize: fontSize.caption,
    color: colors.tint,
  },
  statusPending: {
    color: colors.systemOrange,
  },
});
