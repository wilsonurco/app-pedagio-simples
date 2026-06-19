import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type FormFieldProps = TextInputProps & {
  label: string;
};

export function FormField({ label, style, ...props }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.tertiaryLabel}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  label: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  input: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.label,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
});
