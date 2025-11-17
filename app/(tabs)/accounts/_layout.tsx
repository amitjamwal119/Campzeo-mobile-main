import { Stack } from "expo-router";

export default function AccountsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="Accounts"
        options={{ title: "Accounts", headerShown: false }}
      />
      
    </Stack>
  );
}
