import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PassageTypeBadge } from '@/components/PassageTypeBadge';
import { PayButton } from '@/components/PayButton';
import { ReceiptActions } from '@/components/ReceiptActions';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { generateReceiptId } from '@/utils/receiptHtml';
import { formatBRL, passageTypeLabels, type Passage } from '@/data/mock';
import { formatDateTimeDisplay } from '@/utils/dateTime';
import { formatPassageIdNumeric } from '@/utils/passageId';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

type PassageDetailContentProps = {
  passage: Passage;
};

export function PassageDetailContent({ passage }: PassageDetailContentProps) {
  const insets = useSafeAreaInsets();
  const isPending = passage.status === 'pending';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenBackButton label="Histórico" />

      <View style={styles.header}>
        <Text style={styles.title}>{passage.plaza}</Text>
        <Text style={styles.subtitle}>{passage.highway}</Text>
        <PassageTypeBadge type={passage.type} />
      </View>

      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Valor da passagem</Text>
        <Text style={styles.amount}>{formatBRL(passage.amount)}</Text>
        <Text
          style={[
            styles.status,
            isPending ? styles.statusPending : styles.statusPaid,
          ]}
        >
          {isPending ? 'Pendente' : 'Pago'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Identificação</Text>
        <View style={styles.card}>
          <DetailRow label="ID da passagem" value={formatPassageIdNumeric(passage.passageId)} />
          <View style={styles.divider} />
          <DetailRow label="Placa" value={passage.plate} />
          <View style={styles.divider} />
          <DetailRow label="Veículo" value={passage.vehicleModel} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Local da passagem</Text>
        <View style={styles.card}>
          <DetailRow label="Tipo" value={passageTypeLabels[passage.type]} />
          <View style={styles.divider} />
          <DetailRow label="Concessionária" value={passage.concessionaire} />
          <View style={styles.divider} />
          <DetailRow label="Quilometragem" value={passage.km} />
          <View style={styles.divider} />
          <DetailRow label="Sentido" value={passage.direction} />
          {passage.lane ? (
            <>
              <View style={styles.divider} />
              <DetailRow label="Faixa" value={passage.lane} />
            </>
          ) : null}
          {passage.gantry ? (
            <>
              <View style={styles.divider} />
              <DetailRow label="Pórtico" value={passage.gantry} />
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datas</Text>
        <View style={styles.card}>
          <DetailRow label="Passagem" value={formatDateTimeDisplay(passage.date)} />
          {passage.dueDate ? (
            <>
              <View style={styles.divider} />
              <DetailRow label="Vencimento" value={formatDateTimeDisplay(passage.dueDate)} />
            </>
          ) : null}
          {passage.paidAt ? (
            <>
              <View style={styles.divider} />
              <DetailRow label="Pagamento" value={formatDateTimeDisplay(passage.paidAt)} />
            </>
          ) : null}
          {passage.paymentMethod ? (
            <>
              <View style={styles.divider} />
              <DetailRow label="Forma de pagamento" value={passage.paymentMethod} />
            </>
          ) : null}
          {passage.receiptId || !isPending ? (
            <>
              <View style={styles.divider} />
              <DetailRow
                label="Nº do comprovante"
                value={passage.receiptId ?? generateReceiptId(passage.passageId)}
              />
            </>
          ) : null}
        </View>
      </View>

      {isPending ? (
        <PayButton
          label="Pagar esta passagem"
          onPress={() =>
            router.push({
              pathname: '/pagar-forma',
              params: { selected: passage.id },
            })
          }
        />
      ) : (
        <ReceiptActions passage={passage} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: colors.groupedBackground,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    letterSpacing: -0.3,
  },
  subtitle: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
  },
  amountCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  amountLabel: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
  },
  amount: {
    ...fonts.bold,
    fontSize: fontSize.largeTitle,
    color: colors.tint,
    letterSpacing: -0.5,
  },
  status: {
    ...fonts.medium,
    fontSize: fontSize.footnote,
    marginTop: spacing.xs,
  },
  statusPending: {
    color: colors.systemOrange,
  },
  statusPaid: {
    color: colors.systemGreen,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...fonts.semibold,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: spacing.xs,
  },
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  detailRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 2,
  },
  detailLabel: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
  },
  detailValue: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.label,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  pressed: {
    opacity: 0.6,
  },
});
