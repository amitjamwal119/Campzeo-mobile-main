import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CampaignCard, { Campaign } from "./campaignCard";

export default function CampaignsDetails() {
    const { campaign: campaignStr } = useLocalSearchParams();
    const campaign: Campaign = JSON.parse(campaignStr as string);

    // ============================
    // TEMPORARY POST DATA (STATIC)
    // ============================
    const tempPosts = [
        {
            id: 1,
            subject: "New Year Offer Campaign",
            scheduledTime: "2025-01-15 10:00 AM",
            type: "Instagram",
        },
        {
            id: 2,
            subject: "Winter Sale Post",
            scheduledTime: "2025-01-20 2:30 PM",
            type: "Facebook",
        },
    ];

    return (
        <View className="flex-1 p-4 bg-gray-100">

            {/* Campaign Card */}
            <CampaignCard
                campaign={campaign}
                onDelete={() => {}}
                onCopy={() => {}}
                onToggleShow={() => {}}
                showActions={false}
                alwaysExpanded={true}
                postButtonTopRight={true}
                onPressPost={() => router.push("/campaigns/campaignPost")}
                hidePostsHeading={true}
            />

            {/* ======================
                POSTS SECTION BELOW
            ======================= */}
            <View className="mt-4">
                <Text className="text-xl font-bold mb-3">Created Posts</Text>

                {tempPosts.length === 0 ? (
                    <Text className="text-gray-500 text-center">No records found</Text>
                ) : (
                    tempPosts.map((item) => (
                        <View
                            key={item.id}
                            className="bg-white p-4 rounded-lg mb-3 shadow"
                        >
                            <Text className="text-lg font-semibold">{item.subject}</Text>

                            <Text className="text-gray-600 mt-1">
                                <Text className="font-semibold">Schedule Time:</Text> {item.scheduledTime}
                            </Text>

                            <Text className="text-gray-600 mt-1">
                                <Text className="font-semibold">Type:</Text> {item.type}
                            </Text>

                            <View className="mt-3">
                                <TouchableOpacity
                                    onPress={() => router.push("/campaigns/campaign-components/campaignPostView")}
                                    className="bg-blue-600 py-2 px-3 rounded-lg"
                                >
                                    <Text className="text-white text-center font-semibold">View</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </View>
    );
}
