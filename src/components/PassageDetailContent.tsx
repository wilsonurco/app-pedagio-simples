import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { RpvActions } from '@/components/RpvActions';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { GroupedDivider, GroupedList, GroupedSection } from '@/components/ui/GroupedList';
import { generateReceiptId } from '@/utils/receiptHtml';
import { generateRpvId } from '@/utils/rpvHtml';
import { formatBRL, passageTypeLabels, type Passage } from '@/data/mock';
import { formatDateDisplay, formatDateTimeDisplay } from '@/utils/dateTime';
import { formatPassageIdNumeric } from '@/utils/passageId';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

function DetailRow({ label, value }: { label: string; value: string }) {
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

  const identificationRows = [
    { label: 'ID da passagem', value: formatPassageIdNumeric(passage.passageId) },
    { label: 'Placa', value: passage.plate },
    { label: 'Veículo', value: passage.vehicleModel },
  ];

  const locationRows = [
    { label: 'Tipo', value: passageTypeLabels[passage.type] },
    { label: 'Concessionária', value: passage.concessionaire },
    { label: 'Quilometragem', value: passage.km },
    { label: 'Sentido', value: passage.direction },
    ...(passage.lane ? [{ label: 'Faixa', value: passage.lane }] : []),
    ...(passage.gantry ? [{ label: 'Pórtico', value: passage.gantry }] : []),
  ];

  const dateRows = [
    { label: 'Passagem', value: formatDateTimeDisplay(passage.date) },
    ...(passage.dueDate
      ? [{ label: 'Vencimento', value: formatDateDisplay(passage.dueDate) }]
      : []),
    ...(passage.paidAt ? [{ label: 'Pagamento', value: formatDateTimeDisplay(passage.paidAt) }] : []),
    ...(passage.paymentMethod ? [{ label: 'Forma de pagamento', value: passage.paymentMethod }] : []),
    ...(passage.receiptId || !isPending
      ? [{ label: 'Nº do comprovante', value: passage.receiptId ?? generateReceiptId(passage.passageId) }]
      : []),
    ...(passage.rpvId || !isPending
      ? [{ label: 'Nº do RPV', value: passage.rpvId ?? generateRpvId(passage.passageId) }]
      : []),
    ...(passage.fiscalProtocol
      ? [{ label: 'Protocolo de confirmação', value: passage.fiscalProtocol }]
      : []),
  ];

  function renderRows(rows: { label: string; value: string }[]) {
    return rows.map((row, index) => (
      <View key={row.label}>
        {index > 0 ? <GroupedDivider /> : null}
        <DetailRow label={row.label} value={row.value} />
      </View>
    ));
  }

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
        <Text style={styles.subtitle}>
          {passage.highway} · {passageTypeLabels[passage.type]}
        </Text>
      </View>

      <GroupedList>
        <View style={styles.amountRow}>
          <View>
            <Text style={styles.amountLabel}>Valor</Text>
            <Text style={styles.amount}>{formatBRL(passage.amount)}</Text>
          </View>
          <Text style={[styles.status, isPending ? styles.statusPending : styles.statusPaid]}>
            {isPending ? 'Pendente' : 'Pago'}
          </Text>
        </View>
      </GroupedList>

      <GroupedSection title="Identificação">{renderRows(identificationRows)}</GroupedSection>
      <GroupedSection title="Local">{renderRows(locationRows)}</GroupedSection>
      <GroupedSection title="Datas">{renderRows(dateRows)}</GroupedSection>

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
        <RpvActions passage={passage} />
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
    letterSpacing: -0.4,
  },
  subtitle: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  amountLabel: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    marginBottom: 2,
  },
  amount: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  status: {
    ...fonts.medium,
    fontSize: fontSize.subheadline,
  },
  statusPending: {
    color: colors.systemOrange,
  },
  statusPaid: {
    color: colors.systemGreen,
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
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.label,
  },
});
