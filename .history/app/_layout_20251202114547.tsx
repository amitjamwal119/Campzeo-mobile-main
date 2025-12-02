import "../global.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { tokenCache } from '@clerk/clerk-expo/token-cache'

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {

  // const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';


  const colorScheme = useColorScheme();

  return (
    <>
      {/* <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}> */}
        <GluestackUIProvider config={config}>
          <SafeAreaProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack screenOptions={{
              headerShown: false, // default: hide headers for all screens
            }}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal", title: "Modal" }}
                />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </SafeAreaProvider>
        </GluestackUIProvider>
      {/* </ClerkProvider> */}
    </>
  );
}
