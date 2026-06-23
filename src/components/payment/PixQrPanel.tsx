import { useEffect, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Copy, iconStroke, iconStrokeActive, QrCode, Share2 } from '@/components/ui/icons';
import { formatBRL, merchantPix } from '@/data/mock';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { formatDurationHms } from '@/utils/dateTime';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type PixQrPanelProps = {
  emvCode: string;
  amount: number;
  expiresInSeconds?: number;
  onRegenerate?: () => void;
};

export function PixQrPanel({
  emvCode,
  amount,
  expiresInSeconds = 900,
  onRegenerate,
}: PixQrPanelProps) {
  const [secondsLeft, setSecondsLeft] = useState(expiresInSeconds);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSecondsLeft(expiresInSeconds);
    const timer = setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [emvCode, expiresInSeconds]);

  const isExpired = secondsLeft === 0;

  async function handleCopy() {
    const success = await copyToClipboard(emvCode);
    if (!success) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    await Share.share({
      message: `Pagamento de pedágio — ${formatBRL(amount)}\n\nCódigo Pix Copia e Cola:\n${emvCode}`,
    });
  }

  const timerLabel = formatDurationHms(secondsLeft);

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <View style={styles.infoIcon}>
          <QrCode size={22} color={colors.tint} strokeWidth={iconStrokeActive} />
        </View>
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>Como pagar</Text>
          <Text style={styles.infoBody}>
            Gere o código abaixo e pague pelo app do banco. Se quem vai pagar não for você, compartilhe
            o QR Code ou o Copia e Cola.
          </Text>
        </View>
      </View>

      <View style={styles.qrCard}>
        <Text style={styles.qrTitle}>QR Code</Text>
        <Text style={styles.qrSubtitle}>
          Peça para escanear em outro celular ou abra o app do banco neste aparelho
        </Text>

        <View style={styles.qrWrapper}>
          {isExpired ? (
            <View style={styles.expiredBox}>
              <Text style={styles.expiredText}>Código expirado</Text>
            </View>
          ) : (
            <QRCode value={emvCode} size={200} color={colors.label} backgroundColor={colors.secondaryBackground} />
          )}
        </View>

        <Text style={[styles.timer, isExpired && styles.timerExpired]}>
          {isExpired ? 'Gere um novo código para continuar' : `Código válido por ${timerLabel}`}
        </Text>

        {isExpired && onRegenerate ? (
          <Pressable
            onPress={onRegenerate}
            style={({ pressed }) => [styles.regenerateBtn, pressed && styles.regenerateBtnPressed]}
          >
            <Text style={styles.regenerateLabel}>Gerar novo código</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.codeCard}>
        <Text style={styles.codeLabel}>Pix Copia e Cola</Text>
        <Text style={styles.codeHint}>Cole este código no app do banco para pagar {formatBRL(amount)}</Text>
        <Text style={styles.codeValue} numberOfLines={4} selectable>
          {emvCode}
        </Text>
        <View style={styles.actions}>
          <Pressable
            onPress={handleCopy}
            disabled={isExpired}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.actionBtnPrimary,
              isExpired && styles.actionBtnDisabled,
              pressed && !isExpired && styles.actionBtnPressed,
            ]}
          >
            <Copy size={18} color={colors.tint} strokeWidth={iconStroke} />
            <Text style={styles.actionLabelPrimary}>{copied ? 'Copiado!' : 'Copiar código'}</Text>
          </Pressable>
          <Pressable
            onPress={handleShare}
            disabled={isExpired}
            style={({ pressed }) => [
              styles.actionBtn,
              isExpired && styles.actionBtnDisabled,
              pressed && !isExpired && styles.actionBtnPressed,
            ]}
          >
            <Share2 size={18} color={colors.tint} strokeWidth={iconStroke} />
            <Text style={styles.actionLabel}>Compartilhar</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.merchantHint}>Recebedor: {merchantPix.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    gap: spacing.xs,
  },
  infoTitle: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
  },
  infoBody: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    lineHeight: 20,
  },
  qrCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  qrTitle: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
  },
  qrSubtitle: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
    textAlign: 'center',
    lineHeight: 21,
  },
  qrWrapper: {
    marginVertical: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.secondaryBackground,
    minHeight: 232,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiredBox: {
    width: 200,
    height: 200,
    borderRadius: radius.md,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiredText: {
    ...fonts.medium,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
    textAlign: 'center',
  },
  timer: {
    ...fonts.medium,
    fontSize: fontSize.footnote,
    color: colors.systemOrange,
  },
  timerExpired: {
    color: colors.systemRed,
  },
  regenerateBtn: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(91, 46, 140, 0.08)',
  },
  regenerateBtnPressed: {
    opacity: 0.85,
  },
  regenerateLabel: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.tint,
  },
  codeCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  codeLabel: {
    ...fonts.semibold,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  codeHint: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    lineHeight: 18,
  },
  codeValue: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.label,
    lineHeight: 18,
    backgroundColor: colors.fill,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: colors.fill,
  },
  actionBtnPrimary: {
    backgroundColor: 'rgba(91, 46, 140, 0.08)',
  },
  actionBtnDisabled: {
    opacity: 0.45,
  },
  actionBtnPressed: {
    opacity: 0.85,
  },
  actionLabel: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.tint,
  },
  actionLabelPrimary: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.tint,
  },
  merchantHint: {
    ...fonts.regular,
    fontSize: fontSize.caption,
    color: colors.tertiaryLabel,
    textAlign: 'center',
  },
});
