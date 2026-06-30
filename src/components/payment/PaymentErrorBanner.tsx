import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PaymentErrorBannerProps = {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function PaymentErrorBanner({
  title = 'Não foi possível continuar',
  message,
  actionLabel,
  onAction,
}: PaymentErrorBannerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={styles.action}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff4f4',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f5c2c2',
    gap: spacing.xs,
  },
  title: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: '#9b1c1c',
  },
  message: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: '#7f1d1d',
    lineHeight: 20,
  },
  action: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  actionLabel: {
    ...fonts.semibold,
    fontSize: fontSize.footnote,
    color: colors.tint,
  },
});
