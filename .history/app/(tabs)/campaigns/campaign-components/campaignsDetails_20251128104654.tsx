import React from "react";
import { View, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CampaignCard, { Campaign } from "./campaignCard";
import CampaignPostView from "./campaignPostView";

export default function CampaignsDetails() {
    const { campaign: campaignStr, post: postStr } = useLocalSearchParams();

    const campaign: Campaign = JSON.parse(campaignStr as string);

    // Parse the post only if received
    const post = postStr ? JSON.parse(postStr as string) : null;

    return (
        <ScrollView className="flex-1 p-4 bg-gray-100">

            {/* ---- Main Campaign Card ---- */}
            <CampaignCard
                campaign={campaign}
                onDelete={() => {}}
                onCopy={() => {}}
                onToggleShow={() => {}}
                showActions={false}               // hide all icons
                alwaysExpanded={true}             // expand description and dates
                postButtonTopRight={true}         // show Post button at top right
                onPressPost={() => router.push("/campaigns/campaignPost")} 
                hidePostsHeading={true}           // hide "Posts" heading
            />

            {/* ---- Show Created Post Here ---- */}
            <CampaignPostView post={post} />

        </ScrollView>
    );
}
