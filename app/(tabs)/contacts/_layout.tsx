import { Stack } from "expo-router";

export default function ContactsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="Contacts"
        options={{ title: "Contacts", headerShown: false }}
      />
      
    </Stack>
  );
}
