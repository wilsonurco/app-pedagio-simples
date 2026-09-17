import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormField } from '@/components/FormField';
import { PayButton } from '@/components/PayButton';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { usePassages } from '@/context/PassagesContext';
import {
  getInvalidPlateMessage,
  isCompletePlate,
  isValidBrazilianPlate,
  normalizePlate,
} from '@/services/lookupVehicleByPlate';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

function formatPlate(value: string) {
  return normalizePlate(value).slice(0, 7);
}

export default function ConsultaPlacaScreen() {
  const insets = useSafeAreaInsets();
  const { refreshDebts } = usePassages();
  const [plate, setPlate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalized = normalizePlate(plate);
  const isValid = isCompletePlate(normalized) && isValidBrazilianPlate(normalized);
  const formatError =
    isCompletePlate(normalized) && !isValidBrazilianPlate(normalized)
      ? getInvalidPlateMessage(normalized)
      : null;

  async function handleConsult() {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await refreshDebts([normalized], { vehicleModels: { [normalized]: normalized } });
      router.push('/consulta-resultado' as Href);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Não foi possível consultar os débitos. Tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.sm, paddingBottom: spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenBackButton label="Início" fallback="/" />
        <ScreenTitle
          title="Consulta de débitos"
          subtitle="Informe a placa para consultar a API Fiscaltech. Não é preciso cadastrar o veículo antes."
        />

        <View style={styles.card}>
          <FormField
            label="Placa"
            value={plate}
            onChangeText={(text) => {
              setError(null);
              setPlate(formatPlate(text));
            }}
            placeholder="ABC1D23"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={7}
          />
        </View>

        {formatError ? <Text style={styles.error}>{formatError}</Text> : null}
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <PayButton
          label="Consultar débitos"
          loading={isSubmitting}
          disabled={!isValid}
          onPress={handleConsult}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  error: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.systemRed,
    paddingHorizontal: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.groupedBackground,
  },
});
