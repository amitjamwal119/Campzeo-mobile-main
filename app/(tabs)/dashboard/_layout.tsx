import TopBar from "@/app/common/topBar";
import { Stack } from "expo-router";

export default function AccountsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="Dashboard"
        options={{ header: () => <TopBar />, }}
      />
      
    </Stack>
  );
}
