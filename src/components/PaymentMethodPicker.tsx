import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GroupedDivider, GroupedList } from '@/components/ui/GroupedList';
import { Circle, CircleCheck, iconStroke, iconStrokeActive, paymentMethodIcons } from '@/components/ui/icons';
import { paymentMethods } from '@/data/mock';
import { usePaymentProfile } from '@/context/PaymentProfileContext';
import { formatCardSummary } from '@/utils/cardFormat';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PaymentMethodPickerProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function PaymentMethodPicker({ selectedId, onSelect }: PaymentMethodPickerProps) {
  const { savedCard } = usePaymentProfile();

  function getDetail(methodId: string, fallback: string) {
    if (methodId === 'card' && savedCard) {
      return formatCardSummary(savedCard.brand, savedCard.last4);
    }
    return fallback;
  }

  return (
    <GroupedList>
      {paymentMethods.map((method, index) => {
        const isActive = method.id === selectedId;
        const MethodIcon = paymentMethodIcons[method.icon];
        const detail = getDetail(method.id, method.detail);

        return (
          <View key={method.id}>
            {index > 0 ? <GroupedDivider inset={spacing.lg + 22 + spacing.md} /> : null}
            <Pressable
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
              <MethodIcon
                size={20}
                color={isActive ? colors.tint : colors.secondaryLabel}
                strokeWidth={isActive ? iconStrokeActive : iconStroke}
              />
              <View style={styles.methodText}>
                <Text style={styles.methodLabel}>{method.label}</Text>
                <Text style={styles.methodDetail}>{detail}</Text>
              </View>
              {isActive ? (
                <CircleCheck size={20} color={colors.tint} strokeWidth={iconStrokeActive} />
              ) : (
                <Circle size={20} color={colors.quaternaryLabel} strokeWidth={iconStroke} />
              )}
            </Pressable>
          </View>
        );
      })}
    </GroupedList>
  );
}

const styles = StyleSheet.create({
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 44,
  },
  methodActive: {
    backgroundColor: 'rgba(91, 46, 140, 0.03)',
  },
  methodPressed: {
    opacity: 0.65,
  },
  methodText: {
    flex: 1,
    gap: 2,
  },
  methodLabel: {
    ...fonts.medium,
    fontSize: fontSize.body,
    color: colors.label,
  },
  methodDetail: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
});
