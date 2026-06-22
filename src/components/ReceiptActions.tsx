import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Download, iconSize, iconStroke, Share2 } from '@/components/ui/icons';
import type { Passage } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';
import {
  downloadReceiptPdf,
  reportReceiptActionError,
  shareReceiptPdf,
} from '@/utils/receiptPdf';

type ReceiptActionsProps = {
  passage: Passage;
};

export function ReceiptActions({ passage }: ReceiptActionsProps) {
  const [loadingAction, setLoadingAction] = useState<'share' | 'download' | null>(null);

  async function handleShare() {
    try {
      setLoadingAction('share');
      await shareReceiptPdf(passage);
    } catch (error) {
      reportReceiptActionError(
        'Erro ao compartilhar',
        error instanceof Error ? error.message : 'Tente novamente em instantes.',
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleDownload() {
    try {
      setLoadingAction('download');
      await downloadReceiptPdf(passage);
    } catch (error) {
      reportReceiptActionError(
        'Erro ao baixar',
        error instanceof Error ? error.message : 'Tente novamente em instantes.',
      );
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Comprovante</Text>
      <Text style={styles.subtitle}>
        {passage.receiptId ? `Nº ${passage.receiptId}` : 'Pagamento confirmado'}
      </Text>

      <View style={styles.actions}>
        <Pressable
          onPress={handleShare}
          disabled={loadingAction !== null}
          accessibilityRole="button"
          accessibilityLabel="Compartilhar comprovante em PDF"
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          {loadingAction === 'share' ? (
            <ActivityIndicator color={colors.tint} />
          ) : (
            <>
              <Share2 size={iconSize.sm} color={colors.tint} strokeWidth={iconStroke} />
              <Text style={styles.actionText}>Compartilhar PDF</Text>
            </>
          )}
        </Pressable>

        <Pressable
          onPress={handleDownload}
          disabled={loadingAction !== null}
          accessibilityRole="button"
          accessibilityLabel="Baixar comprovante em PDF"
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          {loadingAction === 'download' ? (
            <ActivityIndicator color={colors.tint} />
          ) : (
            <>
              <Download size={iconSize.sm} color={colors.tint} strokeWidth={iconStroke} />
              <Text style={styles.actionText}>Baixar PDF</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
  },
  subtitle: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.tint,
    backgroundColor: 'rgba(91, 46, 140, 0.04)',
    paddingHorizontal: spacing.sm,
  },
  actionText: {
    ...fonts.semibold,
    fontSize: fontSize.footnote,
    color: colors.tint,
  },
  pressed: {
    opacity: 0.6,
  },
});
