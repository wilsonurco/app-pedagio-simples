import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PayButton } from '@/components/PayButton';
import { Check, iconSize, iconStrokeActive } from '@/components/ui/icons';
import { useAuth } from '@/context/AuthContext';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export function RegistrationSuccessView() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const firstName = user?.name.trim().split(/\s+/)[0] ?? 'Bem-vindo';

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.icon}>
            <Check size={iconSize.xl} color={colors.onTint} strokeWidth={iconStrokeActive} />
          </View>
          <Text style={styles.title}>Cadastro concluído</Text>
          <Text style={styles.subtitle}>
            {firstName}, sua conta foi criada com sucesso. Agora você pode consultar débitos e pagar
            passagens de pedágio pelo app.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <PayButton label="Ir para o início" onPress={() => router.replace('/(tabs)' as Href)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...fonts.bold,
    fontSize: fontSize.title2,
    color: colors.label,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  subtitle: {
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.secondaryLabel,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
});
