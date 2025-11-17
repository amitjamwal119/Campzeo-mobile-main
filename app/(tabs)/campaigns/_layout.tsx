import { Stack } from "expo-router";

export default function CampaignsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="campaigns"
        options={{ title: "Campaigns", headerShown: false }}
      />
      <Stack.Screen
        name="campaignsDetails"
        options={{ title: "Back to campaign list" }}
        // Campaign Details
      />
      <Stack.Screen
        name="campaignPost"
        options={{ title: "Create New Campaign" }}
      />
      <Stack.Screen
        name="campaignsDetails"
        options={{ title: "Back to campaign list" }}
        // Campaign Details
      />
    </Stack>
  );
}
