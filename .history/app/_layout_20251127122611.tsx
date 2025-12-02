import "../global.css";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider config={config}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            {/* Main tabs */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* Modal */}
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />

            {/* Notifications screen */}
            <Stack.Screen
              name="AllNotifications" // ✅ Expo Router will load app/AllNotifications.tsx automatically
              options={{ headerShown: false }} // ✅ hide default header
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
