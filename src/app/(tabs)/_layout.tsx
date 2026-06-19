import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

function TabIcon({
  name,
  sfSymbol,
  color,
  focused,
}: {
  name: keyof typeof MaterialIcons.glyphMap;
  sfSymbol: string;
  color: string;
  focused: boolean;
}) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name={sfSymbol as never}
        size={24}
        tintColor={color}
        weight={focused ? 'semibold' : 'regular'}
      />
    );
  }
  return <MaterialIcons name={name} color={color} size={24} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tertiaryLabel,
        tabBarLabelStyle: { ...fonts.medium, fontSize: 10 },
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.94)' : colors.surface,
          borderTopColor: colors.separator,
        },
        sceneStyle: { backgroundColor: colors.groupedBackground },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" sfSymbol="house.fill" color={String(color)} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="receipt-long" sfSymbol="list.bullet.rectangle" color={String(color)} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="notifications-none" sfSymbol="bell" color={String(color)} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person-outline" sfSymbol="person.circle" color={String(color)} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
