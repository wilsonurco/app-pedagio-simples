import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type FormFieldProps = TextInputProps & {
  label: string;
  required?: boolean;
};

export function FormField({
  label,
  required = false,
  style,
  value,
  onFocus,
  onBlur,
  ...props
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = String(value ?? '').length > 0;
  const showAccentBorder = isFocused || hasValue;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <TextInput
        placeholderTextColor={colors.tertiaryLabel}
        style={[styles.input, showAccentBorder && styles.inputAccent, style]}
        value={value}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    alignSelf: 'stretch',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  label: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  required: {
    color: colors.systemRed,
  },
  input: {
    ...fonts.regular,
    alignSelf: 'stretch',
    width: '100%',
    fontSize: fontSize.body,
    color: colors.label,
    minHeight: 44,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.separator,
    borderRadius: radius.md,
    backgroundColor: colors.secondaryBackground,
    outlineStyle: 'none',
    outlineWidth: 0,
  },
  inputAccent: {
    borderColor: colors.tint,
  },
});
