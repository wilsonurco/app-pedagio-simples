import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect, router, useSegments, type Href } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/tokens';

export function useAuthGuard() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isBootstrapping || isAuthenticated) return;

    const inProtectedArea =
      segments[0] === '(tabs)' ||
      segments[0] === 'pagar' ||
      segments[0] === 'pagar-forma' ||
      segments[0] === 'pagar-pix' ||
      segments[0] === 'pagar-cartao' ||
      segments[0] === 'veiculos' ||
      segments[0] === 'veiculo' ||
      segments[0] === 'cadastro-veiculo' ||
      segments[0] === 'formas-pagamento' ||
      segments[0] === 'cadastro-cartao' ||
      segments[0] === 'passagem';

    if (inProtectedArea) {
      router.replace('/splash' as Href);
    }
  }, [isAuthenticated, isBootstrapping, segments]);
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  useAuthGuard();

  if (isBootstrapping) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href={'/splash' as Href} />;
  }

  return children;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.groupedBackground,
  },
});
