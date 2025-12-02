import React from "react";
import { View } from "react-native";
import { useSearchParams } from "expo-router";
import CampaignCard, { Campaign } from "./campaignCard";

export default function CampaignsDetails() {
  const { campaign: campaignStr } = useSearchParams();
  const campaign: Campaign = JSON.parse(campaignStr as string);

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <CampaignCard
        campaign={campaign}
        onDelete={() => {}}
        onCopy={() => {}}
        onToggleShow={() => {}}
      />
    </View>
  );
}
