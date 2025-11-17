import { Stack } from "expo-router";

export default function AccountsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="Dashboard"
        options={{ title: "Dashboard", headerShown: false }}
      />
      
    </Stack>
  );
}
