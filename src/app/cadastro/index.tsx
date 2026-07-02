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
import { PayButton } from '@/components/PayButton';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { GroupedList } from '@/components/ui/GroupedList';
import { REGISTRATION_STEPS } from '@/constants/registrationSteps';
import { useGuestConsult } from '@/context/GuestConsultContext';
import { consultarCpf } from '@/services/cpf/client';
import { CpfApiError } from '@/services/cpf/types';
import {
  birthDateToIso,
  formatBirthDateInput,
  formatCpf,
  formatPhone,
  isoToBirthDateDisplay,
  isValidCpf,
  isValidEmail,
  isValidPhone,
  normalizeCpf,
  normalizePhone,
} from '@/utils/authValidation';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type CadastroStep = 'cpf' | 'confirm' | 'manual';

export default function CadastroDadosScreen() {
  const insets = useSafeAreaInsets();
  const { setRegistrationDraft } = useGuestConsult();
  const [step, setStep] = useState<CadastroStep>('cpf');
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [birthDateIso, setBirthDateIso] = useState('');
  const [birthDateDisplay, setBirthDateDisplay] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loadingCpf, setLoadingCpf] = useState(false);
  const [lookupFailed, setLookupFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLookupCpf() {
    const normalizedCpf = normalizeCpf(cpf);

    if (normalizedCpf.length !== 11) {
      setError('Informe um CPF completo para consultar.');
      return;
    }

    setLoadingCpf(true);
    setError(null);
    setLookupFailed(false);

    try {
      const result = await consultarCpf(normalizedCpf);
      setCpf(formatCpf(result.cpf));
      setName(result.name);
      setBirthDateIso(result.birthDate);
      setBirthDateDisplay(isoToBirthDateDisplay(result.birthDate));
      setStep('confirm');
    } catch (lookupError) {
      setLookupFailed(true);
      if (lookupError instanceof CpfApiError) {
        setError(lookupError.message);
      } else {
        setError('Não foi possível consultar o CPF. Tente novamente.');
      }
    } finally {
      setLoadingCpf(false);
    }
  }

  function handleManualEntry() {
    setStep('manual');
    setError(null);
    setName('');
    setBirthDateIso('');
    setBirthDateDisplay('');
    setEmail('');
    setPhone('');
  }

  function handleBackToLookup() {
    setStep('cpf');
    setLookupFailed(false);
    setError(null);
    setName('');
    setBirthDateIso('');
    setBirthDateDisplay('');
    setEmail('');
    setPhone('');
  }

  function handleResetCpf() {
    setStep('cpf');
    setLookupFailed(false);
    setName('');
    setBirthDateIso('');
    setBirthDateDisplay('');
    setEmail('');
    setPhone('');
    setError(null);
  }

  function handleContinue() {
    const normalizedCpf = normalizeCpf(cpf);
    const normalizedPhone = normalizePhone(phone);
    const isoBirthDate =
      step === 'manual' ? birthDateToIso(birthDateDisplay) : birthDateIso;

    if (!isValidCpf(normalizedCpf)) {
      setError('Informe um CPF válido.');
      return;
    }

    if (name.trim().length < 3) {
      setError('Informe seu nome completo.');
      return;
    }

    if (!isoBirthDate) {
      setError('Informe a data de nascimento no formato DD/MM/AAAA.');
      return;
    }

    if (!isValidPhone(normalizedPhone)) {
      setError('Informe um telefone válido com DDD.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Informe um e-mail válido ou deixe em branco.');
      return;
    }

    setError(null);
    setRegistrationDraft({
      cpf: normalizedCpf,
      name: name.trim(),
      birthDate: isoBirthDate,
      email: email.trim(),
      phone: normalizedPhone,
    });

    router.push('/cadastro/senha' as Href);
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
        <ScreenBackButton label="Resultado" fallback={'/consulta-resultado' as Href} />
        <ScreenTitle title="Criar conta" />
        <FormStepIndicator
          steps={REGISTRATION_STEPS}
          currentStep={1}
          hint={
            step === 'cpf'
              ? 'Informe seu CPF para buscarmos seus dados.'
              : step === 'confirm'
                ? 'Confirme se os dados encontrados estão corretos.'
                : 'Preencha seus dados para continuar o cadastro.'
          }
        />

        {step === 'cpf' ? (
          <GroupedList>
            <FormField
              label="CPF"
              required
              value={cpf}
              onChangeText={(text) => {
                setCpf(formatCpf(text));
                if (lookupFailed) setLookupFailed(false);
              }}
              placeholder="000.000.000-00"
              keyboardType="number-pad"
              maxLength={14}
            />
          </GroupedList>
        ) : step === 'manual' ? (
          <>
            <GroupedList>
              <FormField
                label="CPF"
                required
                value={cpf}
                onChangeText={(text) => setCpf(formatCpf(text))}
                placeholder="000.000.000-00"
                keyboardType="number-pad"
                maxLength={14}
              />
              <FormField
                label="Nome completo"
                required
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
                autoCapitalize="words"
                autoCorrect={false}
              />
              <FormField
                label="Data de nascimento"
                required
                value={birthDateDisplay}
                onChangeText={(text) => setBirthDateDisplay(formatBirthDateInput(text))}
                placeholder="DD/MM/AAAA"
                keyboardType="number-pad"
                maxLength={10}
              />
              <FormField
                label="E-mail (opcional)"
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FormField
                label="Telefone"
                required
                value={phone}
                onChangeText={(text) => setPhone(formatPhone(text))}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                maxLength={15}
              />
            </GroupedList>

            <Pressable onPress={handleBackToLookup} accessibilityRole="button">
              <Text style={styles.changeCpfLink}>Tentar busca automática</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmTitle}>Dados encontrados</Text>
              <Text style={styles.confirmHint}>
                Confirme se estas informações correspondem a você antes de continuar.
              </Text>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>CPF</Text>
                <Text style={styles.confirmValue}>{cpf}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Nome</Text>
                <Text style={styles.confirmValue}>{name}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Nascimento</Text>
                <Text style={styles.confirmValue}>{birthDateDisplay}</Text>
              </View>
            </View>

            <GroupedList>
              <FormField
                label="E-mail (opcional)"
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FormField
                label="Telefone"
                required
                value={phone}
                onChangeText={(text) => setPhone(formatPhone(text))}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                maxLength={15}
              />
            </GroupedList>

            <Pressable onPress={handleResetCpf} accessibilityRole="button">
              <Text style={styles.changeCpfLink}>Usar outro CPF</Text>
            </Pressable>
          </>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {step === 'cpf' && lookupFailed ? (
          <Pressable
            onPress={handleManualEntry}
            accessibilityRole="button"
            style={styles.manualLinkButton}
          >
            <Text style={styles.manualLink}>Preencher manualmente</Text>
          </Pressable>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {step === 'cpf' ? (
          <PayButton
            label="Buscar meus dados"
            loading={loadingCpf}
            disabled={normalizeCpf(cpf).length !== 11}
            onPress={handleLookupCpf}
          />
        ) : (
          <PayButton
            label={step === 'manual' ? 'Continuar' : 'Confirmar e continuar'}
            onPress={handleContinue}
          />
        )}
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
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.groupedBackground,
  },
  confirmCard: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  confirmTitle: {
    ...fonts.semibold,
    fontSize: fontSize.headline,
    color: colors.label,
  },
  confirmHint: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
    marginBottom: spacing.xs,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  confirmLabel: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
    flexShrink: 0,
  },
  confirmValue: {
    ...fonts.medium,
    fontSize: fontSize.subheadline,
    color: colors.label,
    flex: 1,
    textAlign: 'right',
  },
  changeCpfLink: {
    ...fonts.medium,
    fontSize: fontSize.subheadline,
    color: colors.tint,
    textAlign: 'center',
    paddingVertical: spacing.xs,
  },
  manualLinkButton: {
    alignSelf: 'stretch',
  },
  manualLink: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.tint,
    textAlign: 'left',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  error: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.systemRed,
    paddingHorizontal: spacing.sm,
  },
});
