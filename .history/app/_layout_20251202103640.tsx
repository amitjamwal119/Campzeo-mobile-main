// app/_layout.tsx
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ClerkProvider } from "@clerk/clerk-expo";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)", // default anchor for your tabs
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ClerkProvider>
      <GluestackUIProvider config={config}>
        <SafeAreaProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack
              screenOptions={{
                headerShown: false, // default: hide headers for all screens
              }}
            >
              {/* Main tab layout */}
              <Stack.Screen name="(tabs)" />

              {/* Modal screen */}
              <Stack.Screen
                name="modal"
                options={{
                  presentation: "modal",
                  headerShown: true,
                  title: "Modal",
                }}
              />
            </Stack>

            <StatusBar style="auto" />
          </ThemeProvider>
        </SafeAreaProvider>
      </GluestackUIProvider>
    </ClerkProvider>
  );
}
