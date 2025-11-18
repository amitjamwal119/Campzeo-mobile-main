import { Stack } from "expo-router";

export default function CampaignsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="campaigns"
        options={{ title: "Campaigns", headerShown: false }}
      />
      <Stack.Screen
        name="CampaignsDetails"
        options={{ title: "Back to campaign list" }}
        // Campaign Details
      />
      <Stack.Screen
        name="CampaignPost"
        options={{ title: "Create New Campaign" }}
      />
    </Stack>
  );
}
