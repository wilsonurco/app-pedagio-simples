import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FormField } from '@/components/FormField';
import { CardBrandIcon } from '@/components/payment/CardBrandIcon';
import { CardNumberField } from '@/components/payment/CardNumberField';
import { CreditCard, iconStrokeActive } from '@/components/ui/icons';
import { type SavedCreditCard } from '@/context/PaymentProfileContext';
import {
  detectCardBrand,
  digitsOnly,
  formatCardNumber,
  formatCardSummary,
  formatExpiry,
  getCvvMaxLength,
  isValidCardNumber,
  isValidCvv,
  isValidExpiry,
} from '@/utils/cardFormat';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type CreditCardFormProps = {
  initialCard?: SavedCreditCard | null;
  onSubmit: (card: SavedCreditCard) => void;
  submitLabel?: string;
};

export function CreditCardForm({
  initialCard,
  onSubmit,
  submitLabel = 'Salvar cartão',
}: CreditCardFormProps) {
  const [holderName, setHolderName] = useState(initialCard?.holderName ?? '');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState(initialCard?.expiry ?? '');
  const [cvv, setCvv] = useState('');

  const brand = detectCardBrand(number || `0000${initialCard?.last4 ?? ''}`);
  const digits = digitsOnly(number);
  const isValid =
    holderName.trim().length >= 3 &&
    (initialCard ? true : isValidCardNumber(number)) &&
    isValidExpiry(expiry) &&
    isValidCvv(cvv, brand);

  function handleSubmit() {
    if (!isValid) return;

    const last4 = initialCard?.last4 ?? digits.slice(-4);
    onSubmit({
      holderName: holderName.trim(),
      brand,
      last4,
      expiry,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <View style={styles.previewIcon}>
          <CreditCard size={22} color={colors.tint} strokeWidth={iconStrokeActive} />
        </View>
        <View style={styles.previewText}>
          <Text style={styles.previewLabel}>Cartão</Text>
          <Text style={styles.previewValue}>
            {digits.length >= 4 || initialCard
              ? formatCardSummary(brand, initialCard?.last4 ?? digits.slice(-4).padStart(4, '0'))
              : 'Informe os dados abaixo'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <CardNumberField
          value={number}
          onChangeText={(text) => {
            const nextBrand = detectCardBrand(text);
            setNumber(formatCardNumber(text, nextBrand));
          }}
        />
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.half}>
            <FormField
              label="Validade"
              value={expiry}
              onChangeText={(text) => setExpiry(formatExpiry(text))}
              placeholder="MM/AA"
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>
          <View style={styles.half}>
            <FormField
              label="CVV"
              value={cvv}
              onChangeText={(text) => setCvv(digitsOnly(text).slice(0, getCvvMaxLength(brand)))}
              placeholder={brand === 'Amex' ? '1234' : '123'}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={getCvvMaxLength(brand)}
            />
          </View>
        </View>
        <View style={styles.divider} />
        <FormField
          label="Nome no cartão"
          value={holderName}
          onChangeText={setHolderName}
          placeholder="Como impresso no cartão"
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      <Text style={styles.hint}>
        Seus dados são simulados nesta versão de demonstração. Nenhuma cobrança real será feita.
      </Text>

      <Pressable
        onPress={handleSubmit}
        disabled={!isValid}
        style={({ pressed }) => [
          styles.submit,
          !isValid && styles.submitDisabled,
          pressed && isValid && styles.submitPressed,
        ]}
      >
        <Text style={styles.submitLabel}>{submitLabel}</Text>
      </Pressable>
    </View>
  );
}

type SavedCardSummaryProps = {
  card: SavedCreditCard;
  onChangeCard?: () => void;
};

export function SavedCardSummary({ card, onChangeCard }: SavedCardSummaryProps) {
  return (
    <View style={styles.savedCard}>
      <View style={styles.previewIcon}>
        <CardBrandIcon brand={card.brand} size={36} />
      </View>
      <View style={styles.previewText}>
        <Text style={styles.previewLabel}>{formatCardSummary(card.brand, card.last4)}</Text>
        <Text style={styles.savedDetail}>
          {card.holderName} • Validade {card.expiry}
        </Text>
      </View>
      {onChangeCard ? (
        <Pressable onPress={onChangeCard} hitSlop={8}>
          <Text style={styles.changeLink}>Alterar</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    flex: 1,
    gap: 2,
  },
  previewLabel: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  previewValue: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.label,
  },
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  row: {
    flexDirection: 'row',
  },
  half: {
    flex: 1,
  },
  hint: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
    lineHeight: 20,
    paddingHorizontal: spacing.xs,
  },
  submit: {
    backgroundColor: colors.tint,
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  submitDisabled: {
    opacity: 0.45,
  },
  submitPressed: {
    backgroundColor: colors.tintPressed,
  },
  submitLabel: {
    ...fonts.semibold,
    fontSize: fontSize.body,
    color: colors.onTint,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  savedDetail: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  changeLink: {
    ...fonts.semibold,
    fontSize: fontSize.footnote,
    color: colors.tint,
  },
});
