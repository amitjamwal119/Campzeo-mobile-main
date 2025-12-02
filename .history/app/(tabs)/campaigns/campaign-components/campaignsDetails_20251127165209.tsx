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
                showActions={false}      // hide edit/copy/delete/show icons
                showPostButton={true}    // show Post button on top right
                alwaysExpanded={true}    // always show description & dates
                onPost={() =>
                    router.push({
                        pathname: "/camp",
                        params: { campaign: JSON.stringify(campaign) },
                    })
                }
            />
        </View>
    );
}
