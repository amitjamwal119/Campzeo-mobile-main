import { Stack } from "expo-router";

export default function AccountsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="Logs"
        options={{ title: "Logs", headerShown: false }}
      />
      
    </Stack>
  );
}
