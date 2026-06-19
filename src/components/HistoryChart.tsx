import { StyleSheet, Text, View } from 'react-native';

import { history, type HistoryPoint } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type HistoryChartProps = {
  data?: HistoryPoint[];
};

const CHART_HEIGHT = 110;

export function HistoryChart({ data = history }: HistoryChartProps) {
  const max = Math.max(...data.map((point) => point.value), 1);
  const highlightedIndex = data.reduce(
    (maxIdx, point, idx) => (point.value > data[maxIdx].value ? idx : maxIdx),
    0,
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Histórico</Text>

      <View
        style={styles.chart}
        accessibilityRole="image"
        accessibilityLabel="Gráfico de barras do histórico de gastos dos últimos seis meses"
      >
        {data.map((point, index) => {
          const isActive = index === highlightedIndex;
          const barHeight = Math.max((point.value / max) * CHART_HEIGHT, 6);
          return (
            <View key={point.label} style={styles.column}>
              <View
                style={[
                  styles.bar,
                  { height: barHeight },
                  isActive ? styles.barActive : styles.barInactive,
                ]}
              />
              <Text style={[styles.barLabel, isActive && styles.barLabelActive]}>
                {point.label}
              </Text>
            </View>
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
    gap: spacing.md,
  },
  title: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
  },
  chart: {
    height: CHART_HEIGHT + 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  bar: {
    width: 16,
    borderRadius: radius.sm,
  },
  barActive: {
    backgroundColor: colors.tint,
  },
  barInactive: {
    backgroundColor: colors.barInactive,
  },
  barLabel: {
    ...fonts.regular,
    fontSize: fontSize.caption2,
    color: colors.tertiaryLabel,
  },
  barLabelActive: {
    ...fonts.semibold,
    color: colors.label,
  },
});
