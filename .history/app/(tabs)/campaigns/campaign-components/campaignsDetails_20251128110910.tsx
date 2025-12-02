import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CampaignCard, { Campaign } from "./campaignCard";
import { Ionicons } from "@expo/vector-icons";

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
      type: "Whatsapp",
    },
    {
      id: 2,
      subject: "Winter Sale Post",
      scheduledTime: "2025-01-20 2:30 PM",
      type: "YouTube",
    },
    {
      id: 3,
      subject: "Spring Launch Post",
      scheduledTime: "2025-02-05 11:00 AM",
      type: "Instagram",
    },
  ];

  const handleEditPost = (post: any) => {
    // Navigate to CampaignPost and pre-select the platform for editing
    router.push({
      pathname: "/campaigns/campaignPost",
      params: { platform: post.type, editPostId: post.id.toString() },
    });
  };

  const handleDeletePost = (postId: number) => {
    alert(`Delete post with id: ${postId}`);
  };

  const renderPostItem = ({ item }: { item: any }) => (
    <View className="bg-white p-4 rounded-lg mb-3 shadow">
      <Text className="text-lg font-semibold">{item.subject}</Text>
      <Text className="text-gray-600 mt-1">
        <Text className="font-semibold">Schedule Time: </Text> {item.scheduledTime}
      </Text>
      <Text className="text-gray-600 mt-1">
        <Text className="font-semibold">Type: </Text> {item.type}
      </Text>

      <View className="flex-row mt-3">
        <TouchableOpacity
          onPress={() => handleEditPost(item)}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FEF3C7",
            borderColor: "#FCD34D",
            borderWidth: 1,
            paddingVertical: 10,
            borderRadius: 8,
            marginRight: 10,
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
            backgroundColor: "#FEE2E2",
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
  );

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
      <View className="mt-4 flex-1">
        <Text className="text-xl font-bold mb-3">Created Posts</Text>

        {tempPosts.length === 0 ? (
          <Text className="text-gray-500 text-center">No records found</Text>
        ) : (
          <FlatList
            data={tempPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPostItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
