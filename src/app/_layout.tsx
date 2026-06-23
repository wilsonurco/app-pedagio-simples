import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PassagesProvider } from '@/context/PassagesContext';
import { PaymentProfileProvider } from '@/context/PaymentProfileContext';
import { VehiclesProvider } from '@/context/VehiclesContext';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <PassagesProvider>
      <PaymentProfileProvider>
      <VehiclesProvider>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.groupedBackground },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="pagar"
          options={{
            presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
          }}
        />
        <Stack.Screen
          name="pagar-forma"
          options={{
            presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="pagar-pix"
          options={{
            presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="pagar-cartao"
          options={{
            presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen name="formas-pagamento" options={{ presentation: 'card', gestureEnabled: true }} />
        <Stack.Screen name="cadastro-cartao" options={{ presentation: 'card', gestureEnabled: true }} />
        <Stack.Screen name="veiculos" options={{ presentation: 'card', gestureEnabled: true }} />
        <Stack.Screen name="veiculo/[plate]" options={{ presentation: 'card', gestureEnabled: true }} />
        <Stack.Screen name="cadastro-veiculo" options={{ presentation: 'card', gestureEnabled: true }} />
        <Stack.Screen name="notificacoes" options={{ presentation: 'card', gestureEnabled: true }} />
        <Stack.Screen name="ajuda" options={{ presentation: 'card', gestureEnabled: true }} />
        <Stack.Screen name="passagem/[id]" options={{ presentation: 'card', gestureEnabled: true }} />
      </Stack>
      </VehiclesProvider>
      </PaymentProfileProvider>
      </PassagesProvider>
    </SafeAreaProvider>
  );
}
