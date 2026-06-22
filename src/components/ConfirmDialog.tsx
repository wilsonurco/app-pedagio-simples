import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onCancel} accessibilityRole="button" accessibilityLabel="Fechar" />
      <View style={styles.dialog} accessibilityRole="alert">
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.actions}>
          <Pressable
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
            style={({ pressed }) => [styles.actionBtn, styles.cancelBtn, pressed && styles.pressed]}
          >
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </Pressable>

          <Pressable
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
            style={({ pressed }) => [
              styles.actionBtn,
              destructive ? styles.destructiveBtn : styles.confirmBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.confirmText, destructive && styles.destructiveText]}>
              {confirmLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    zIndex: 1,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)' }
      : null),
  },
  title: {
    ...fonts.bold,
    fontSize: fontSize.title3,
    color: colors.label,
    textAlign: 'center',
  },
  message: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  cancelBtn: {
    backgroundColor: colors.fill,
  },
  confirmBtn: {
    backgroundColor: colors.tint,
  },
  destructiveBtn: {
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
  },
  cancelText: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
  },
  confirmText: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.onTint,
  },
  destructiveText: {
    color: colors.systemRed,
  },
  pressed: {
    opacity: 0.75,
  },
});
