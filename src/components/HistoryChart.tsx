import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArrowUpRight, iconSize, iconStroke } from '@/components/ui/icons';
import { type HistoryPoint } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type HistoryChartProps = {
  data: HistoryPoint[];
  selectedMonth?: string;
  onSelectMonth?: (label: string) => void;
  showTitle?: boolean;
  onPressDetail?: () => void;
};

const CHART_HEIGHT = 110;

export function HistoryChart({
  data,
  selectedMonth,
  onSelectMonth,
  showTitle = true,
  onPressDetail,
}: HistoryChartProps) {
  const max = Math.max(...data.map((point) => point.value), 1);
  const fallbackIndex = data.reduce(
    (maxIdx, point, idx) => (point.value > data[maxIdx].value ? idx : maxIdx),
    0,
  );
  const activeLabel = selectedMonth ?? data[fallbackIndex]?.label;

  return (
    <View style={styles.card}>
      {showTitle ? (
        <View style={styles.header}>
          <Text style={styles.title}>Histórico</Text>
          {onPressDetail ? (
            <Pressable
              onPress={onPressDetail}
              accessibilityRole="button"
              accessibilityLabel="Ver histórico completo"
              hitSlop={8}
              style={({ pressed }) => [styles.detailBtn, pressed && styles.pressed]}
            >
              <ArrowUpRight size={iconSize.sm} color={colors.tint} strokeWidth={iconStroke} />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <View
        style={styles.chart}
        accessibilityRole="adjustable"
        accessibilityLabel="Gráfico de gastos mensais. Toque em um mês para ver as passagens."
      >
        {data.map((point) => {
          const isActive = point.label === activeLabel;
          const hasValue = point.value > 0;
          const barHeight = hasValue ? Math.max((point.value / max) * CHART_HEIGHT, 6) : 6;

          const column = (
            <>
              <View
                style={[
                  styles.bar,
                  { height: barHeight },
                  isActive && hasValue ? styles.barActive : styles.barInactive,
                  !hasValue && styles.barEmpty,
                ]}
              />
              <Text style={[styles.barLabel, isActive && hasValue && styles.barLabelActive]}>
                {point.label}
              </Text>
            </>
          );

          if (onSelectMonth && hasValue) {
            return (
              <Pressable
                key={point.label}
                onPress={() => onSelectMonth(point.label)}
                accessibilityRole="button"
                accessibilityLabel={`Ver passagens de ${point.label}`}
                accessibilityState={{ selected: isActive }}
                style={({ pressed }) => [styles.column, pressed && styles.pressed]}
              >
                {column}
              </Pressable>
            );
          }

          return (
            <View key={point.label} style={styles.column}>
              {column}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
  pressed: {
    opacity: 0.6,
  },
  bar: {
    width: 16,
    borderRadius: radius.pill,
  },
  barActive: {
    backgroundColor: colors.tint,
  },
  barInactive: {
    backgroundColor: colors.barInactive,
  },
  barEmpty: {
    opacity: 0.35,
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
