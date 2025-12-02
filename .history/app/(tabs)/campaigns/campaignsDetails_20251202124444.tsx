import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import Pagination from "../contacts/contactComponents/pagination";
import CampaignCard, { Campaign } from "./campaign-components/campaignCard";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState(campaign.posts || []); // each campaign has its own posts

  const postsPerPage = 5;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Add a new post to this campaign
  const handleAddPost = (newPost: any) => {
    setPosts((prev) => [...prev, newPost]);
  };

  // Edit post
  const handleEditPost = (post: any) => {
    router.push({
      pathname: "/campaigns/campaign-components/campaignPost",
      params: { platform: post.type, editPostId: post.id.toString(), campaign: JSON.stringify(campaign) },
    });
  };

  // Delete post
  const handleDeletePost = (postId: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setPosts(posts.filter((p) => p.id !== postId));
          },
        },
      ]
    );
  };

  // Render a single post item
  const renderPostItem = ({ item }: { item: any }) => {
    const platform = platformIcons[item.type];

    return (
      <View className="bg-white p-4 rounded-xl mb-4 shadow relative">
        {/* Top-right edit/delete icons */}
        <View className="absolute top-3 right-3 flex-row space-x-2">
          <TouchableOpacity onPress={() => handleEditPost(item)} className="mx-1">
            <Ionicons name="create-outline" size={22} color="#10b981" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeletePost(item.id)} className="mx-1">
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Subject */}
        <Text className="text-lg font-bold mb-2">{item.subject}</Text>

        {/* Description */}
        <Text className="text-black font-semibold mb-1">Description</Text>
        <Text className="text-gray-900 mb-2">{item.description}</Text>

        {/* Schedule */}
        <Text className="text-black font-semibold mb-1">Schedule</Text>
        <Text className="text-gray-900 mb-2">{item.scheduledTime}</Text>

        {/* Platform */}
        <View className="flex-row items-center">
          <Text className="font-semibold mr-2">Type</Text>
          {platform ? (
            <platform.Icon name={platform.name as any} size={22} color={platform.color} />
          ) : (
            <Text>{item.type}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-xl font-bold mb-3">Campaign Details</Text>

      {/* Campaign Card */}
      <CampaignCard
        campaign={campaign}
        onDelete={() => {}}
        onCopy={() => {}}
        onToggleShow={() => {}}
        showActions={false}
        alwaysExpanded={true}
        postButtonTopRight={true}
        onPressPost={() =>
          router.push({
            pathname: "/campaigns/campaign-components/campaignPost",
            params: { campaign: JSON.stringify(campaign) }, // pass campaign to post page
          })
        }
        hidePostsHeading={true}
      />

      {/* Posts */}
      <View className="mt-4 flex-1">
        <Text className="text-xl font-bold mb-3">Created Posts</Text>

        {posts.length === 0 ? (
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
