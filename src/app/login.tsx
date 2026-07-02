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
import { GroupedList } from '@/components/ui/GroupedList';
import { useAuth } from '@/context/AuthContext';
import { AuthApiError } from '@/services/auth/types';
import { formatCpf, normalizeCpf } from '@/utils/authValidation';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      await login(normalizeCpf(cpf), password);
      router.replace('/(tabs)');
    } catch (loginError) {
      const message =
        loginError instanceof AuthApiError
          ? loginError.message
          : 'Não foi possível entrar. Tente novamente.';
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
        <ScreenBackButton label="Início" fallback={'/splash' as Href} />
        <ScreenTitle title="Entrar" subtitle="Use seu CPF e senha cadastrados" />

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
            label="Senha"
            required
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha"
            secureTextEntry
            maxLength={32}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </GroupedList>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PayButton label="Entrar" loading={loading} onPress={handleLogin} />
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
  error: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.systemRed,
    paddingHorizontal: spacing.sm,
  },
});
