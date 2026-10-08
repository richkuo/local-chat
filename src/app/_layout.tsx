import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ModelsProvider } from '@/models/ModelsProvider';
import { useTheme } from '@/theme';

export default function RootLayout() {
  const theme = useTheme();

  return (
    <ModelsProvider>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.secondary,
          tabBarStyle: { backgroundColor: theme.background, borderTopColor: theme.separator },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Chat',
            tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="models"
          options={{
            title: 'Models',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cloud-download" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ModelsProvider>
  );
}
