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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, iconSize, iconStroke } from '@/components/ui/icons';

import { FormField } from '@/components/FormField';
import { PayButton } from '@/components/PayButton';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { GroupedDivider, GroupedList } from '@/components/ui/GroupedList';
import { useVehicles } from '@/context/VehiclesContext';
import { isFiscalTechEnabled } from '@/config/dataSource';
import { usePassages } from '@/context/PassagesContext';
import { type Vehicle } from '@/data/mock';
import {
  getInvalidPlateMessage,
  isCompletePlate,
  isValidBrazilianPlate,
  lookupVehicleByPlate,
  normalizePlate,
} from '@/services/lookupVehicleByPlate';
import { navigateBack } from '@/utils/navigation';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Status = 'idle' | 'saving' | 'success';
type LookupStatus = 'idle' | 'loading' | 'found' | 'not_found' | 'duplicate' | 'invalid_format' | 'lookup_error';

function formatPlate(value: string) {
  return normalizePlate(value).slice(0, 7);
}

export default function VehicleRegistrationScreen() {
  const insets = useSafeAreaInsets();
  const { addVehicle, hasVehicle } = useVehicles();
  const { refreshDebts } = usePassages();
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle');
  const [lookupMessage, setLookupMessage] = useState<string | undefined>();
  const [registeredVehicle, setRegisteredVehicle] = useState<Vehicle | null>(null);

  const isReady = lookupStatus === 'found' && model.trim().length >= 2;

  useEffect(() => {
    if (status === 'success' || status === 'saving') return;

    if (!isCompletePlate(plate)) {
      setModel('');
      setLookupStatus('idle');
      setLookupMessage(undefined);
      return;
    }

    const normalizedPlate = normalizePlate(plate);

    if (!isValidBrazilianPlate(normalizedPlate)) {
      setModel('');
      setLookupStatus('invalid_format');
      setLookupMessage(getInvalidPlateMessage(normalizedPlate));
      return;
    }

    if (hasVehicle(normalizedPlate)) {
      setModel('');
      setLookupStatus('duplicate');
      setLookupMessage(undefined);
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
          setLookupStatus('found');
          setLookupMessage(undefined);
          return;
        }

        if (result.reason === 'invalid_format') {
          setLookupStatus('invalid_format');
          setLookupMessage(result.message);
          return;
        }

        if (result.reason === 'api_error') {
          setLookupStatus('lookup_error');
          setLookupMessage(result.message);
          return;
        }

        setLookupStatus('not_found');
        setLookupMessage(undefined);
      })
      .catch(() => {
        if (cancelled) return;
        setLookupStatus('lookup_error');
        setLookupMessage('Não foi possível consultar a placa. Tente novamente.');
      });

    return () => {
      cancelled = true;
    };
  }, [plate, hasVehicle, status]);

  function handlePlateChange(text: string) {
    setPlate(formatPlate(text));
  }

  function handleSubmit() {
    if (!isReady) return;

    const normalizedPlate = normalizePlate(plate);
    const vehicle = { plate: normalizedPlate, model: model.trim() };
    const added = addVehicle(vehicle);

    if (!added) {
      setLookupStatus('duplicate');
      return;
    }

    setRegisteredVehicle(vehicle);
    setStatus('saving');

    if (isFiscalTechEnabled()) {
      refreshDebts([normalizedPlate], { vehicleModels: { [normalizedPlate]: vehicle.model } })
        .catch(() => undefined)
        .finally(() => setStatus('success'));
      return;
    }

    setTimeout(() => setStatus('success'), 900);
  }

  function handleFinish() {
    navigateBack({ fallback: '/veiculos' });
  }

  if (status === 'success' && registeredVehicle) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <View style={styles.successIcon}>
          <Check size={iconSize.xl} color={colors.onTint} strokeWidth={iconStroke} />
        </View>
        <Text style={styles.successTitle}>Veículo cadastrado</Text>
        <Text style={styles.successSubtitle}>
          {registeredVehicle.model} • {registeredVehicle.plate} foi adicionado à sua conta.
        </Text>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <PayButton label="Concluir" onPress={handleFinish} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.sm, paddingBottom: spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenBackButton label="Meus veículos" fallback="/veiculos" />
        <ScreenTitle
          title="Novo veículo"
          subtitle="Informe a placa para buscar os dados automaticamente"
        />

        <GroupedList>
          <FormField
            label="Placa"
            value={plate}
            onChangeText={handlePlateChange}
            placeholder="ABC1D23"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={7}
          />
          <LookupFeedback status={lookupStatus} message={lookupMessage} />
          <GroupedDivider />
          <FormField
            label="Modelo"
            value={model}
            editable={false}
            placeholder="Preenchido automaticamente"
            autoCorrect={false}
          />
        </GroupedList>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PayButton
          label="Cadastrar veículo"
          loading={status === 'saving' || lookupStatus === 'loading'}
          disabled={!isReady}
          onPress={handleSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function LookupFeedback({ status, message }: { status: LookupStatus; message?: string }) {
  if (status === 'idle') return null;

  if (status === 'loading') {
    return (
      <View style={styles.feedbackRow}>
        <ActivityIndicator size="small" color={colors.tint} />
        <Text style={styles.feedbackLoading}>Consultando placa...</Text>
      </View>
    );
  }

  if (status === 'found') {
    return (
      <View style={styles.feedbackRow}>
        <Check size={16} color={colors.systemGreen} strokeWidth={iconStroke} />
        <Text style={styles.feedbackSuccess}>Veículo identificado</Text>
      </View>
    );
  }

  if (status === 'duplicate') {
    return <Text style={styles.feedbackError}>Este veículo já está cadastrado na sua conta.</Text>;
  }

  if (status === 'invalid_format') {
    return (
      <Text style={styles.feedbackError}>
        {message ?? 'Formato inválido. Use Mercosul (ABC1D23) ou antigo (ABC1234).'}
      </Text>
    );
  }

  if (status === 'lookup_error') {
    return (
      <Text style={styles.feedbackError}>
        {message ?? 'Não foi possível consultar a placa. Tente novamente.'}
      </Text>
    );
  }

  return (
    <Text style={styles.feedbackError}>
      Placa não encontrada. Verifique os dados e tente novamente.
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    marginTop: -spacing.xs,
  },
  feedbackLoading: {
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
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.groupedBackground,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  successTitle: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
    textAlign: 'center',
    lineHeight: 24,
  },
});
