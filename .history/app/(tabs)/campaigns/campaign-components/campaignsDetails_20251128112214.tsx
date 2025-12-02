import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CampaignCard, { Campaign } from "./campaignCard";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Pagination from "../../contacts/contactComponents/pagination";

// Map type to icon
const platformIcons: Record<string, { Icon: any; color: string; name: string }> = {
  Whatsapp: { Icon: Ionicons, name: "logo-whatsapp", color: "#25D366" },
  Instagram: { Icon: FontAwesome, name: "instagram", color: "#C13584" },
  Facebook: { Icon: FontAwesome, name: "facebook-square", color: "#1877F2" },
  YouTube: { Icon: FontAwesome, name: "youtube-play", color: "#FF0000" },
  LinkedIn: { Icon: FontAwesome, name: "linkedin-square", color: "#0A66C2" },
  Pinterest: { Icon: FontAwesome, name: "pinterest", color: "#E60023" },
  Email: { Icon: Ionicons, name: "mail", color: "#F59E0B" },
  SMS: { Icon: Ionicons, name: "chatbubble-ellipses-outline", color: "#10B981" },
};

export default function CampaignsDetails() {
  const { campaign: campaignStr } = useLocalSearchParams();
  const campaign: Campaign = JSON.parse(campaignStr as string);

  // ============================
  // TEMPORARY POST DATA (STATIC)
  // ============================
  const tempPosts = [
    { id: 1, subject: "New Year Offer Campaign", scheduledTime: "2025-01-15 10:00 AM", type: "Whatsapp" },
    { id: 2, subject: "Winter Sale Post", scheduledTime: "2025-01-20 2:30 PM", type: "YouTube" },
    { id: 3, subject: "Spring Launch Post", scheduledTime: "2025-02-05 11:00 AM", type: "Instagram" },
    { id: 4, subject: "Summer Promo", scheduledTime: "2025-02-10 3:00 PM", type: "Facebook" },
    { id: 5, subject: "Autumn Campaign", scheduledTime: "2025-03-01 1:00 PM", type: "LinkedIn" },
    { id: 6, subject: "Winter Discount", scheduledTime: "2025-03-05 4:00 PM", type: "Pinterest" },
    { id: 7, subject: "Flash Sale", scheduledTime: "2025-03-10 12:00 PM", type: "SMS" },
    { id: 8, subject: "Email Blast", scheduledTime: "2025-03-12 9:00 AM", type: "Email" },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const totalPages = Math.ceil(tempPosts.length / postsPerPage);
  const currentPosts = tempPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handleEditPost = (post: any) => {
    router.push({
      pathname: "/campaigns/campaignPost",
      params: { platform: post.type, editPostId: post.id.toString() },
    });
  };

  const handleDeletePost = (postId: number) => {
    alert(`Delete post with id: ${postId}`);
  };

  const renderPostItem = ({ item }: { item: any }) => {
    const platform = platformIcons[item.type];
    return (
      <View className="bg-white p-4 rounded-lg mb-3 shadow relative">
        {/* Top-right icons */}
        <View className="absolute top-3 right-3 flex-row space-x-2">
          {/* Edit Icon */}
          <TouchableOpacity
            onPress={() => handleEditPost(item)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#FEF3C7",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="create-outline" size={18} color="#D97706" />
          </TouchableOpacity>

          {/* Delete Icon */}
          <TouchableOpacity
            onPress={() => handleDeletePost(item.id)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#FEE2E2",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="trash-outline" size={18} color="#B91C1C" />
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-semibold">{item.subject}</Text>
        <Text className="text-gray-600 mt-1">
          <Text className="font-semibold">Schedule Time: </Text> {item.scheduledTime}
        </Text>

        {/* Platform Icon */}
        <View className="flex-row items-center mt-1">
          <Text className="font-semibold mr-2">Type:</Text>
          {platform ? (
            <platform.Icon name={platform.name as any} size={20} color={platform.color} />
          ) : (
            <Text>{item.type}</Text>
          )}
        </View>
      </View>
    );
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
      <View className="mt-4 flex-1">
        <Text className="text-xl font-bold mb-3">Created Posts</Text>

        {tempPosts.length === 0 ? (
          <Text className="text-gray-500 text-center">No records found</Text>
        ) : (
          <FlatList
            data={currentPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPostItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            ListFooterComponent={
              <View className="mt-4">
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={(page: number) => setCurrentPage(page)}
                />
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
