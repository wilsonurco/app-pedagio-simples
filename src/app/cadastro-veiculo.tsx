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
import { type Vehicle } from '@/data/mock';
import {
  isCompletePlate,
  lookupVehicleByPlate,
  normalizePlate,
  simulatedPlateExamples,
} from '@/services/lookupVehicleByPlate';
import { navigateBack } from '@/utils/navigation';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Status = 'idle' | 'saving' | 'success';
type LookupStatus = 'idle' | 'loading' | 'found' | 'not_found' | 'duplicate';

function formatPlate(value: string) {
  return normalizePlate(value).slice(0, 7);
}

export default function VehicleRegistrationScreen() {
  const insets = useSafeAreaInsets();
  const { addVehicle, hasVehicle } = useVehicles();
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>('idle');
  const [registeredVehicle, setRegisteredVehicle] = useState<Vehicle | null>(null);

  const isReady = lookupStatus === 'found' && model.trim().length >= 2;

  useEffect(() => {
    if (status === 'success' || status === 'saving') return;

    if (!isCompletePlate(plate)) {
      setModel('');
      setLookupStatus('idle');
      return;
    }

    const normalizedPlate = normalizePlate(plate);

    if (hasVehicle(normalizedPlate)) {
      setModel('');
      setLookupStatus('duplicate');
      return;
    }

    let cancelled = false;
    setLookupStatus('loading');
    setModel('');

    lookupVehicleByPlate(normalizedPlate).then((result) => {
      if (cancelled) return;

      if (result.found) {
        setModel(result.model);
        setLookupStatus('found');
        return;
      }

      setLookupStatus('not_found');
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
          <LookupFeedback status={lookupStatus} />
          <GroupedDivider />
          <FormField
            label="Modelo"
            value={model}
            editable={false}
            placeholder="Preenchido automaticamente"
            autoCorrect={false}
          />
        </GroupedList>

        <Text style={styles.hintTitle}>Placas de exemplo na simulação</Text>
        <Text style={styles.hintText}>{simulatedPlateExamples.join(' • ')}</Text>
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

function LookupFeedback({ status }: { status: LookupStatus }) {
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

  return (
    <Text style={styles.feedbackError}>
      Placa não encontrada. Verifique os dados ou tente uma placa de exemplo.
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
  hintTitle: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: spacing.xs,
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
  hintText: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.tertiaryLabel,
    lineHeight: 20,
    paddingHorizontal: spacing.xs,
    marginTop: -spacing.sm,
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
