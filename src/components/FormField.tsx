import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { iconStroke } from '@/components/ui/icons';
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
  secureTextEntry = false,
  ...props
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const hasValue = String(value ?? '').length > 0;
  const showAccentBorder = isFocused || hasValue;
  const showPasswordToggle = secureTextEntry;
  const hidePassword = secureTextEntry && !isPasswordVisible;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <View style={styles.inputWrap}>
        <TextInput
          placeholderTextColor={colors.tertiaryLabel}
          style={[
            styles.input,
            showPasswordToggle && styles.inputWithToggle,
            showAccentBorder && styles.inputAccent,
            style,
          ]}
          value={value}
          secureTextEntry={hidePassword}
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
        {showPasswordToggle ? (
          <Pressable
            onPress={() => setIsPasswordVisible((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={8}
            style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={colors.secondaryLabel} strokeWidth={iconStroke} />
            ) : (
              <Eye size={20} color={colors.secondaryLabel} strokeWidth={iconStroke} />
            )}
          </Pressable>
        ) : null}
      </View>
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
  inputWrap: {
    position: 'relative',
    alignSelf: 'stretch',
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
  inputWithToggle: {
    paddingRight: spacing.xxl + spacing.sm,
  },
  toggle: {
    position: 'absolute',
    right: spacing.sm,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
  },
  togglePressed: {
    opacity: 0.6,
  },
});
