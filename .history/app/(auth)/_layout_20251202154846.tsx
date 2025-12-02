import { Stack, Redirect } from "expo-router";
// import { useAuth } from "@clerk/clerk-expo";
import React from "react";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  // If user is signed in → redirect away from auth screens
  if (isSignedIn) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="sign-in" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}
