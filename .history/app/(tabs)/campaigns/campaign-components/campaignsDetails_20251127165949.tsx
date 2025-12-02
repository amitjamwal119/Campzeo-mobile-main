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
                onDelete={() => { }}
                onCopy={() => { }}
                onToggleShow={() => { }}
                showActions={false}             // hide all icons
                showPostButton={true}           // show Post button
                alwaysExpanded={true}           // always show description & dates
                hidePostsHeading={true}         // hide "Posts" heading
                onPressPost={() => router.push("/campaigns/campaignPost")} // navigate to campaignPost
            />

        </View>
    );
}
