import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Circle,
  CircleCheck,
  iconStroke,
  iconStrokeActive,
  paymentMethodIcons,
} from '@/components/ui/icons';
import { paymentMethods } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PaymentMethodPickerProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function PaymentMethodPicker({ selectedId, onSelect }: PaymentMethodPickerProps) {
  return (
    <View style={styles.methods}>
      {paymentMethods.map((method) => {
        const isActive = method.id === selectedId;
        const MethodIcon = paymentMethodIcons[method.icon];

        return (
          <Pressable
            key={method.id}
            onPress={() => onSelect(method.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={method.label}
            style={({ pressed }) => [
              styles.method,
              isActive && styles.methodActive,
              pressed && styles.methodPressed,
            ]}
          >
            <View style={styles.methodIcon}>
              <MethodIcon
                size={22}
                color={isActive ? colors.tint : colors.secondaryLabel}
                strokeWidth={isActive ? iconStrokeActive : iconStroke}
              />
            </View>
            <View style={styles.methodText}>
              <Text style={styles.methodLabel}>{method.label}</Text>
              <Text style={styles.methodDetail}>{method.detail}</Text>
            </View>
            {isActive ? (
              <CircleCheck size={22} color={colors.tint} strokeWidth={iconStrokeActive} />
            ) : (
              <Circle size={22} color={colors.tertiaryLabel} strokeWidth={iconStroke} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  methods: {
    gap: spacing.md,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  methodActive: {
    backgroundColor: 'rgba(91, 46, 140, 0.08)',
  },
  methodPressed: {
    opacity: 0.9,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodText: {
    flex: 1,
    gap: 2,
  },
  methodLabel: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
  },
  methodDetail: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
});
