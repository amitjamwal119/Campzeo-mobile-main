import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CampaignCard, { Campaign } from "./campaignCard";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function CampaignsDetails() {
  const { campaign: campaignStr } = useLocalSearchParams();
  const campaign: Campaign = JSON.parse(campaignStr as string);

  const [tempPosts, setTempPosts] = useState([
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
  ]);

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

  const handleDeletePost = (id: number) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setTempPosts(tempPosts.filter((post) => post.id !== id)),
        },
      ]
    );
  };

  const handleEditPost = (post: any) => {
    router.push({
      pathname: "/campaigns/campaignPost",
      params: { post: JSON.stringify(post) },
    });
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

      {/* POSTS SECTION */}
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

              {/* Edit & Delete Buttons with icons */}
              <View className="flex-row mt-3">
  <TouchableOpacity
    onPress={() => handleEditPost(item)}
    style={{
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FEF3C7", // light yellow
      borderColor: "#FCD34D",
      borderWidth: 1,
    //   paddingVertical: 10,
      borderRadius: 8,
      marginRight: 10, // <-- space between buttons
    }}
  >
    <Ionicons name="create-outline" size={18} color="#D97706" style={{ marginRight: 6 }} />
    <Text style={{ color: "#B45309", fontWeight: "600" }}>Edit</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => handleDeletePost(item.id)}
    style={{
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FEE2E2", // light red
      borderColor: "#FCA5A5",
      borderWidth: 1,
      paddingVertical: 10,
      borderRadius: 8,
    }}
  >
    <Ionicons name="trash-outline" size={18} color="#B91C1C" style={{ marginRight: 6 }} />
    <Text style={{ color: "#B91C1C", fontWeight: "600" }}>Delete</Text>
  </TouchableOpacity>
</View>

            </View>
          ))
        )}
      </View>
    </View>
  );
}
