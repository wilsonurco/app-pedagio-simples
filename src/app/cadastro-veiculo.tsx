import { useMemo, useState } from 'react';
import {
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
import { GroupedList } from '@/components/ui/GroupedList';
import { useVehicles } from '@/context/VehiclesContext';
import { isFiscalTechEnabled } from '@/config/dataSource';
import { usePassages } from '@/context/PassagesContext';
import { AuthApiError } from '@/services/auth/types';
import { type Vehicle } from '@/data/mock';
import {
  getInvalidPlateMessage,
  isCompletePlate,
  isValidBrazilianPlate,
  normalizePlate,
} from '@/services/lookupVehicleByPlate';
import { navigateBack } from '@/utils/navigation';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Status = 'idle' | 'saving' | 'success';
type PlateStatus = 'incomplete' | 'invalid_format' | 'duplicate' | 'ready';

function formatPlate(value: string) {
  return normalizePlate(value).slice(0, 7);
}

function getPlateStatus(plate: string, hasVehicle: (plate: string) => boolean): PlateStatus {
  if (!isCompletePlate(plate)) return 'incomplete';
  const normalized = normalizePlate(plate);
  if (!isValidBrazilianPlate(normalized)) return 'invalid_format';
  if (hasVehicle(normalized)) return 'duplicate';
  return 'ready';
}

export default function VehicleRegistrationScreen() {
  const insets = useSafeAreaInsets();
  const { addVehicle, hasVehicle } = useVehicles();
  const { refreshDebts } = usePassages();
  const [plate, setPlate] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [registeredVehicle, setRegisteredVehicle] = useState<Vehicle | null>(null);

  const plateStatus = useMemo(() => getPlateStatus(plate, hasVehicle), [plate, hasVehicle]);
  const isReady = plateStatus === 'ready';

  function handlePlateChange(text: string) {
    setSubmitError(undefined);
    setPlate(formatPlate(text));
  }

  async function handleSubmit() {
    if (!isReady) return;

    const normalizedPlate = normalizePlate(plate);
    const vehicle: Vehicle = { plate: normalizedPlate, model: '' };

    setStatus('saving');
    setSubmitError(undefined);

    try {
      const added = await addVehicle(vehicle);
      if (!added) {
        setStatus('idle');
        return;
      }

      setRegisteredVehicle(vehicle);
      setStatus('success');

      if (isFiscalTechEnabled()) {
        void refreshDebts([normalizedPlate], {
          vehicleModels: { [normalizedPlate]: normalizedPlate },
        }).catch(() => undefined);
      }
    } catch (error) {
      if (error instanceof AuthApiError) {
        setSubmitError(error.message);
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Não foi possível salvar o veículo. Tente novamente.');
      }
      setStatus('idle');
    }
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
          Placa {registeredVehicle.plate} foi adicionada à sua conta.
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
        <ScreenTitle title="Novo veículo" subtitle="Informe a placa do veículo" />

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
          <PlateFeedback status={plateStatus} plate={plate} />
        </GroupedList>

        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PayButton
          label="Cadastrar veículo"
          loading={status === 'saving'}
          disabled={!isReady}
          onPress={handleSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function PlateFeedback({ status, plate }: { status: PlateStatus; plate: string }) {
  if (status === 'incomplete') return null;

  if (status === 'ready') {
    return (
      <View style={styles.feedbackRow}>
        <Check size={16} color={colors.systemGreen} strokeWidth={iconStroke} />
        <Text style={styles.feedbackSuccess}>Placa válida</Text>
      </View>
    );
  }

  if (status === 'duplicate') {
    return <Text style={styles.feedbackError}>Esta placa já está cadastrada na sua conta.</Text>;
  }

  return (
    <Text style={styles.feedbackError}>
      {getInvalidPlateMessage(normalizePlate(plate))}
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
  submitError: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.systemRed,
    paddingHorizontal: spacing.sm,
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
