import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CampaignCard, { Campaign } from "./campaignCard";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

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
    {
      id: 3,
      subject: "WhatsApp Promotion",
      scheduledTime: "2025-01-22 5:00 PM",
      type: "Whatsapp",
    },
  ];

  // Function to get the icon for a platform
  const getPlatformIcon = (type: string) => {
    switch (type) {
      case "Email":
        return <Ionicons name="mail" size={20} color="#f59e0b" />;
      case "SMS":
        return <Ionicons name="chatbubble-ellipses-outline" size={20} color="#10b981" />;
      case "Instagram":
        return <FontAwesome name="instagram" size={20} color="#c13584" />;
      case "Whatsapp":
        return <Ionicons name="logo-whatsapp" size={20} color="#25D366" />;
      case "Facebook":
        return <FontAwesome name="facebook-square" size={20} color="#1877F2" />;
      case "YouTube":
        return <FontAwesome name="youtube-play" size={20} color="#FF0000" />;
      case "LinkedIn":
        return <FontAwesome name="linkedin-square" size={20} color="#0A66C2" />;
      case "Pinterest":
        return <FontAwesome name="pinterest" size={20} color="#E60023" />;
      default:
        return <Text>{type}</Text>;
    }
  };

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

              <View className="flex-row items-center mt-1">
                <Text className="font-semibold mr-2">Type:</Text>
                {getPlatformIcon(item.type)}
              </View>

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
