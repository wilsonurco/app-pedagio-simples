import { useState } from 'react';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { FormField } from '@/components/FormField';
import { PayButton } from '@/components/PayButton';
import { ScreenBackButton } from '@/components/ScreenBackButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { vehicleCategories } from '@/data/mock';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Status = 'idle' | 'saving' | 'success';

function formatPlate(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 7);
}

export default function VehicleRegistrationScreen() {
  const insets = useSafeAreaInsets();
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [categoryId, setCategoryId] = useState(vehicleCategories[0].id);
  const [status, setStatus] = useState<Status>('idle');

  const isValid = plate.length >= 7 && model.trim().length >= 2;

  function handleSubmit() {
    if (!isValid) return;
    setStatus('saving');
    setTimeout(() => setStatus('success'), 1200);
  }

  if (status === 'success') {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <View style={styles.successIcon}>
          <MaterialIcons name="check" size={44} color={colors.onTint} />
        </View>
        <Text style={styles.successTitle}>Veículo cadastrado</Text>
        <Text style={styles.successSubtitle}>
          {model.trim()} • {plate} foi adicionado à sua conta.
        </Text>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <PayButton label="Concluir" onPress={() => router.back()} />
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
        <ScreenBackButton label="Meus veículos" />
        <ScreenTitle
          title="Novo veículo"
          subtitle="Cadastre um veículo na sua conta"
        />

        <View style={styles.card}>
          <FormField
            label="Placa"
            value={plate}
            onChangeText={(text) => setPlate(formatPlate(text))}
            placeholder="ABC1D23"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={7}
          />
          <View style={styles.divider} />
          <FormField
            label="Modelo"
            value={model}
            onChangeText={setModel}
            placeholder="Ex.: Honda Civic"
            autoCorrect={false}
          />
        </View>

        <Text style={styles.sectionTitle}>Categoria</Text>
        <View style={styles.card}>
          {vehicleCategories.map((category, index) => {
            const isActive = category.id === categoryId;
            return (
              <Pressable
                key={category.id}
                onPress={() => setCategoryId(category.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={category.label}
                style={({ pressed }) => [
                  styles.categoryRow,
                  index < vehicleCategories.length - 1 && styles.divider,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>
                  {category.label}
                </Text>
                {isActive ? (
                  <MaterialIcons name="check" size={20} color={colors.tint} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <PayButton
          label="Cadastrar veículo"
          loading={status === 'saving'}
          disabled={!isValid}
          onPress={handleSubmit}
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
  scroll: {
    flex: 1,
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
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  sectionTitle: {
    ...fonts.semibold,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: -spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 44,
  },
  categoryLabel: {
    flex: 1,
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.label,
  },
  categoryLabelActive: {
    ...fonts.semibold,
    color: colors.tint,
  },
  pressed: {
    opacity: 0.6,
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
