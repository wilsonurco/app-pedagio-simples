import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormStepIndicator } from '@/components/FormStepIndicator';
import { FormField } from '@/components/FormField';
import { PasswordRequirements } from '@/components/PasswordRequirements';
import { PayButton } from '@/components/PayButton';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { GroupedList } from '@/components/ui/GroupedList';
import { Check, iconStroke } from '@/components/ui/icons';
import { REGISTRATION_STEPS } from '@/constants/registrationSteps';
import { useAuth } from '@/context/AuthContext';
import { useGuestConsult } from '@/context/GuestConsultContext';
import { usePassages } from '@/context/PassagesContext';
import { useVehicles } from '@/context/VehiclesContext';
import { AuthApiError } from '@/services/auth/types';
import { normalizePlate } from '@/services/lookupVehicleByPlate';
import { validatePasswordClient } from '@/utils/authValidation';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export default function CadastroSenhaScreen() {
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const { registrationDraft, consultedPlate, lookupResult, clearRegistrationDraft, clearConsult } =
    useGuestConsult();
  const { addVehicle } = useVehicles();
  const { refreshDebts } = usePassages();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerVehicle, setRegisterVehicle] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!registrationDraft) {
    router.replace('/cadastro' as Href);
    return null;
  }

  const canRegisterVehicle =
    consultedPlate &&
    lookupResult &&
    lookupResult.found === true &&
    normalizePlate(consultedPlate) === normalizePlate(lookupResult.plate);

  async function handleSubmit() {
    const draft = registrationDraft;
    if (!draft) return;

    const passwordError = validatePasswordClient(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const vehicle =
        registerVehicle && canRegisterVehicle && lookupResult?.found
          ? {
              plate: normalizePlate(lookupResult.plate),
              model: lookupResult.model,
            }
          : undefined;

      await register({
        cpf: draft.cpf,
        name: draft.name,
        birthDate: draft.birthDate,
        email: draft.email || undefined,
        phone: draft.phone,
        password,
        vehicle,
      });

      if (vehicle) {
        addVehicle(vehicle);
        await refreshDebts([vehicle.plate], {
          vehicleModels: { [vehicle.plate]: vehicle.model },
        }).catch(() => undefined);
      }

      clearRegistrationDraft();
      clearConsult();
      router.replace('/(tabs)');
    } catch (submitError) {
      const message =
        submitError instanceof AuthApiError
          ? submitError.message
          : 'Não foi possível concluir o cadastro. Tente novamente.';
      setError(message);
    } finally {
      setLoading(false);
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
        <ScreenBackButton label="Dados pessoais" fallback={'/cadastro' as Href} />
        <ScreenTitle title="Defina sua senha" />
        <FormStepIndicator
          steps={REGISTRATION_STEPS}
          currentStep={2}
          hint="Crie uma senha segura seguindo os requisitos abaixo."
        />

        <GroupedList>
          <FormField
            label="Senha"
            required
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError(null);
            }}
            placeholder="Crie sua senha"
            secureTextEntry
            maxLength={32}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FormField
            label="Confirmar senha"
            required
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (error) setError(null);
            }}
            placeholder="Repita a senha"
            secureTextEntry
            maxLength={32}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </GroupedList>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PasswordRequirements password={password} />

        {canRegisterVehicle ? (
          <Pressable
            onPress={() => setRegisterVehicle((current) => !current)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: registerVehicle }}
            style={({ pressed }) => [styles.checkboxRow, pressed && styles.pressed]}
          >
            <View style={[styles.checkbox, registerVehicle && styles.checkboxChecked]}>
              {registerVehicle ? (
                <Check size={14} color={colors.onTint} strokeWidth={iconStroke} />
              ) : null}
            </View>
            <View style={styles.checkboxText}>
              <Text style={styles.checkboxTitle}>Cadastrar veículo consultado</Text>
              <Text style={styles.checkboxSubtitle}>
                {lookupResult?.model} • {consultedPlate}
              </Text>
            </View>
          </Pressable>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PayButton label="Concluir cadastro" loading={loading} onPress={handleSubmit} />
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.separator,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryBackground,
  },
  checkboxChecked: {
    backgroundColor: colors.tint,
    borderColor: colors.tint,
  },
  checkboxText: {
    flex: 1,
    gap: 2,
  },
  checkboxTitle: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.label,
  },
  checkboxSubtitle: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.groupedBackground,
  },
  error: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.systemRed,
    paddingHorizontal: spacing.sm,
    marginTop: -spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
});
