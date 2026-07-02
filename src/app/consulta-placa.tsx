import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { GroupedList } from '@/components/ui/GroupedList';
import { Check, iconStroke } from '@/components/ui/icons';
import { isFiscalTechEnabled } from '@/config/dataSource';
import { useGuestConsult } from '@/context/GuestConsultContext';
import { consultarDebitos } from '@/services/fiscaltech/client';
import { mapDebitosToPassages } from '@/services/fiscaltech/mappers';
import {
  getInvalidPlateMessage,
  isCompletePlate,
  isValidBrazilianPlate,
  lookupVehicleByPlate,
  normalizePlate,
} from '@/services/lookupVehicleByPlate';
import { initialPassages } from '@/data/mock';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type LookupStatus = 'idle' | 'loading' | 'ready' | 'invalid' | 'not_found' | 'error';

function formatPlate(value: string) {
  return normalizePlate(value).slice(0, 7);
}

export default function ConsultaPlacaScreen() {
  const insets = useSafeAreaInsets();
  const { setConsultResult } = useGuestConsult();
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle');
  const [lookupMessage, setLookupMessage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isCompletePlate(plate)) {
      setModel('');
      setLookupStatus('idle');
      setLookupMessage(undefined);
      return;
    }

    const normalizedPlate = normalizePlate(plate);

    if (!isValidBrazilianPlate(normalizedPlate)) {
      setModel('');
      setLookupStatus('invalid');
      setLookupMessage(getInvalidPlateMessage(normalizedPlate));
      return;
    }

    let cancelled = false;
    setLookupStatus('loading');
    setLookupMessage(undefined);
    setModel('');

    lookupVehicleByPlate(normalizedPlate)
      .then((result) => {
        if (cancelled) return;

        if (result.found) {
          setModel(result.model);
          setLookupStatus('ready');
          return;
        }

        if (result.reason === 'invalid_format') {
          setLookupStatus('invalid');
          setLookupMessage(result.message);
          return;
        }

        if (result.reason === 'api_error') {
          setLookupStatus('error');
          setLookupMessage(result.message);
          return;
        }

        setLookupStatus('not_found');
      })
      .catch(() => {
        if (cancelled) return;
        setLookupStatus('error');
        setLookupMessage('Não foi possível consultar a placa. Tente novamente.');
      });

    return () => {
      cancelled = true;
    };
  }, [plate]);

  async function handleConsult() {
    if (lookupStatus !== 'ready') return;

    const normalizedPlate = normalizePlate(plate);
    setIsSubmitting(true);

    try {
      let passages = initialPassages.filter(
        (passage) => passage.status === 'pending' && normalizePlate(passage.plate) === normalizedPlate,
      );

      if (isFiscalTechEnabled()) {
        const response = await consultarDebitos({
          placas: [normalizedPlate],
          placaInternacional: false,
        });
        passages = mapDebitosToPassages(response.resultados ?? [], {
          [normalizedPlate]: model,
        });
      }

      setConsultResult(
        normalizedPlate,
        { found: true, plate: normalizedPlate, model, hasDebts: passages.length > 0 },
        passages.length,
      );

      router.push('/consulta-resultado' as Href);
    } catch {
      setLookupMessage('Não foi possível consultar os débitos. Tente novamente.');
      setLookupStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit = lookupStatus === 'ready' && !isSubmitting;

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
        <ScreenBackButton label="Início" fallback={'/splash' as Href} />
        <ScreenTitle
          title="Consulta gratuita"
          subtitle="Informe a placa para ver quantas pendências existem, sem criar conta"
        />

        <GroupedList>
          <FormField
            label="Placa"
            required
            value={plate}
            onChangeText={(text) => setPlate(formatPlate(text))}
            placeholder="ABC1D23"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={7}
          />
          <LookupFeedback status={lookupStatus} message={lookupMessage} model={model} />
        </GroupedList>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PayButton
          label="Ver débitos"
          loading={isSubmitting}
          disabled={!canSubmit}
          onPress={handleConsult}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function LookupFeedback({
  status,
  message,
  model,
}: {
  status: LookupStatus;
  message?: string;
  model: string;
}) {
  if (status === 'idle') return null;

  if (status === 'loading') {
    return (
      <View style={styles.feedbackRow}>
        <ActivityIndicator size="small" color={colors.tint} />
        <Text style={styles.feedbackMuted}>Consultando placa...</Text>
      </View>
    );
  }

  if (status === 'ready') {
    return (
      <View style={styles.feedbackRow}>
        <Check size={16} color={colors.systemGreen} strokeWidth={iconStroke} />
        <Text style={styles.feedbackSuccess}>
          {model} • Placa identificada
        </Text>
      </View>
    );
  }

  if (status === 'invalid' || status === 'error' || status === 'not_found') {
    return (
      <Text style={styles.feedbackError}>
        {message ??
          (status === 'not_found'
            ? 'Placa não encontrada. Verifique os dados e tente novamente.'
            : 'Não foi possível consultar a placa.')}
      </Text>
    );
  }

  return null;
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
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.groupedBackground,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    marginTop: -spacing.xs,
  },
  feedbackMuted: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  feedbackSuccess: {
    ...fonts.medium,
    fontSize: fontSize.footnote,
    color: colors.systemGreen,
  },
  feedbackError: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.systemRed,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    marginTop: -spacing.xs,
  },
});
