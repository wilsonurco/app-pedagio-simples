import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { CardBrandIcon, CARD_BRANDS_DISPLAY } from '@/components/payment/CardBrandIcon';
import { detectCardBrand, type CardBrand } from '@/utils/cardFormat';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type CardNumberFieldProps = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBrandChange?: (brand: CardBrand) => void;
};

export function CardNumberField({
  label = 'Número do cartão',
  value,
  onChangeText,
  onBrandChange,
  ...props
}: CardNumberFieldProps) {
  const brand = detectCardBrand(value);
  const hasDigits = value.replace(/\D/g, '').length > 0;
  const showDetectedBrand = hasDigits && brand !== 'Outro';

  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {!showDetectedBrand ? (
          <View style={styles.brandsRow}>
            {CARD_BRANDS_DISPLAY.map((item) => (
              <CardBrandIcon key={item} brand={item} size={24} faded />
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            onBrandChange?.(detectCardBrand(text));
          }}
          placeholderTextColor={colors.tertiaryLabel}
          style={styles.input}
          placeholder="0000 0000 0000 0000"
          keyboardType="number-pad"
          maxLength={19}
          {...props}
        />
        {showDetectedBrand ? (
          <View style={styles.brandBadge}>
            <CardBrandIcon brand={brand} size={32} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  label: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  brandsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.label,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  brandBadge: {
    paddingLeft: spacing.xs,
  },
});
