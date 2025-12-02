import React from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CampaignCard, { Campaign } from "./campaignCard";

export default function CampaignsDetails() {
    const { campaign: campaignStr } = useLocalSearchParams();
    const campaign: Campaign = JSON.parse(campaignStr as string);

    return (
        <View className="flex-1 p-4 bg-gray-100">
            <CampaignCard
  campaign={campaign}
  onDelete={() => {}}
  onCopy={() => {}}
  onToggleShow={() => {}}
  showActions={false}               // hide all icons
  alwaysExpanded={true}             // always show description & dates
  postButtonTopRight={true}         // show Post button at top right
  onPressPost={() => router.push("/campaigns/campaignPost")} // navigate to campaignPost
  hidePostsHeading={true}           // hide bottom "Posts" heading
/>

        </View>
    );
}
