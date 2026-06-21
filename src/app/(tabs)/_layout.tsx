import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { iconSize, iconStroke, iconStrokeActive, tabIcons } from '@/components/ui/icons';
import { colors, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

function TabIcon({
  name,
  color,
  focused,
}: {
  name: keyof typeof tabIcons;
  color: string;
  focused: boolean;
}) {
  const Icon = tabIcons[name];

  return (
    <Icon
      size={iconSize.md}
      color={color}
      strokeWidth={focused ? iconStrokeActive : iconStroke}
    />
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const webTabBarInset = Platform.OS === 'web' ? Math.max(insets.bottom, spacing.sm) : 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tertiaryLabel,
        tabBarLabelStyle: { ...fonts.medium, fontSize: 10 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          ...(Platform.OS === 'web'
            ? {
                paddingBottom: webTabBarInset,
                height: 56 + webTabBarInset,
              }
            : {}),
        },
        sceneStyle: { backgroundColor: colors.groupedBackground },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={String(color)} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="history" color={String(color)} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="alerts" color={String(color)} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="profile" color={String(color)} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
