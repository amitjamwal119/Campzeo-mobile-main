import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router"; // correct hook
import CampaignCard, { Campaign } from "./campaignCard";

export default function CampaignsDetails() {
  const { campaign: campaignStr } = useLocalSearchParams();
  const campaign: Campaign = JSON.parse(campaignStr as string); // parse string back to object

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <CampaignCard
        campaign={campaign}
        onDelete={() => {}}
        // onCopy={() => {}}
        onToggleShow={() => {}}
      />
    </View>
  );
}
