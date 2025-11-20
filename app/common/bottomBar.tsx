import { Tabs } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
// import { useColorScheme } from "@/hooks/use-color-scheme";

export default function BottomBar() {
  // const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#D55B35',
            tabBarInactiveTintColor: '#777777ff',
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={29} name="chart.bar" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="logs"
          options={{
            title: "Logs",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={29} name="doc.text" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="campaigns"
          options={{
            title: "Campaigns",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={29} name="map" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="contacts"
          options={{
            title: "Contacts",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={29} name="envelope" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="accounts"
          options={{
            title: "Accounts",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={29} name="book" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
