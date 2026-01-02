import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import CampaignCard, { Campaign } from "./campaignComponents/campaignCard";
import { useAuth } from "@clerk/clerk-expo";
import { getCampaignByIdApi, getPostsByCampaignIdApi } from "@/api/campaign/campaignApi";

// Map type to icon
const platformIcons: Record<string, { Icon: any; color: string; name: string }> = {
  WHATSAPP: { Icon: Ionicons, name: "logo-whatsapp", color: "#25D366" },
  INSTAGRAM: { Icon: FontAwesome, name: "instagram", color: "#C13584" },
  FACEBOOK: { Icon: FontAwesome, name: "facebook-square", color: "#1877F2" },
  YOUTUBE: { Icon: FontAwesome, name: "youtube-play", color: "#FF0000" },
  LINKEDIN: { Icon: FontAwesome, name: "linkedin-square", color: "#0A66C2" },
  PINTEREST: { Icon: FontAwesome, name: "pinterest", color: "#E60023" },
  EMAIL: { Icon: Ionicons, name: "mail", color: "#F59E0B" },
  SMS: { Icon: Ionicons, name: "chatbubble-ellipses-outline", color: "#10B981" },
};

export default function CampaignsDetails() {
  const { getToken } = useAuth();
  const params = useLocalSearchParams();

  /** Safe param parsing */
  const campaignStr = typeof params.campaign === "string" ? params.campaign : null;
  const campaignIdParam = typeof params.campaignId === "string" ? params.campaignId : null;

  /** Try to parse campaign JSON string */
  const initialCampaign = useMemo<Campaign | null>(() => {
    if (!campaignStr) return null;
    try {
      return JSON.parse(campaignStr) as Campaign;
    } catch (e) {
      console.warn("Failed to parse campaign JSON", e);
      return null;
    }
  }, [campaignStr]);

  const [campaign, setCampaign] = useState<Campaign | null>(initialCampaign);
  const [posts, setPosts] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loadingCampaign, setLoadingCampaign] = useState(false);

  /** Determine final campaignId */
  const resolvedCampaignId = useMemo<number | undefined>(() => {
    if (campaign?.id) return campaign.id;

    if (campaignIdParam) {
      const num = Number(campaignIdParam);
      return Number.isFinite(num) ? num : undefined;
    }
    return undefined;
  }, [campaign, campaignIdParam]);

  // ========= FETCH CAMPAIGN DETAILS =========
  useEffect(() => {
    const fetchCampaign = async () => {
      if (campaign || !resolvedCampaignId) return;

      setLoadingCampaign(true);
      try {
        const token = await getToken();
        if (!token) throw new Error("Token missing");

        const data = await getCampaignByIdApi(resolvedCampaignId, token);
        if (!data) return;

        const mapped: Campaign = {
          id: Number(data.id ?? data._id ?? resolvedCampaignId),
          details: data.name ?? "Untitled Campaign",
          dates: `${(data.startDate || "").split("T")[0]} - ${(data.endDate || "").split("T")[0]}`,
          description: data.description ?? "",
          posts: data.posts ?? [],
          show: true,
        };

        setCampaign(mapped);
      } catch (error) {
        console.log("CAMPAIGN LOAD ERROR", error);
      } finally {
        setLoadingCampaign(false);
      }
    };

    fetchCampaign();
  }, [campaign, resolvedCampaignId]);

  // ========= FETCH POSTS =========
  const fetchPosts = useCallback(async () => {
    if (!resolvedCampaignId) return;
    try {
      const token = await getToken();
      if (!token) throw new Error("Token missing");

      const res = await getPostsByCampaignIdApi(resolvedCampaignId, token);
      const apiPosts = res?.posts ?? res?.data?.posts ?? [];
      setPosts(apiPosts);
    } catch (error) {
      console.log("POSTS LOAD ERROR:", error);
      setPosts([]);
    }
  }, [resolvedCampaignId, getToken]);

  // UseFocusEffect ensures posts refresh when navigating back
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  // ========= POST ACTIONS =========
  const handleEditPost = (post: any) => {
    if (!campaign) return;

    router.push({
      pathname: "/campaigns/campaignComponents/campaignPost",
      params: {
        platform: post.type,
        editPostId: String(post.id),
        campaignId: campaign.id?.toString(),
      },
    });
  };

  const handleDeletePost = (postId: number) => {
    Alert.alert("Delete Post?", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updated = posts.filter((p) => p.id !== postId);
          setPosts(updated);
          if (visibleCount > updated.length) setVisibleCount(updated.length);
        },
      },
    ]);
  };

  // ========= RENDER POST =========
  const renderPostItem = ({ item }: { item: any }) => {
    const platform = platformIcons[item.type];

    return (
      <View className="bg-white p-4 rounded-xl mb-4 shadow relative">
        <View className="absolute top-3 right-3 flex-row space-x-2">
          <TouchableOpacity onPress={() => handleEditPost(item)} className="mx-1">
            <Ionicons name="create-outline" size={22} color="#10b981" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeletePost(item.id)} className="mx-1">
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>

        import { Ionicons } from "@expo/vector-icons";

<View className="flex-row items-center mb-2">
  <Ionicons name="information-circle-outline" size={18} color="#9ca3af" />
  <Text className="ml-1 text-gray-500 italic">No subject available</Text>
</View>


        <Text className="font-semibold mb-1">Schedule</Text>
        <Text className="mb-2">
          {item.scheduledPostTime
            ? new Date(item.scheduledPostTime).toLocaleString()
            : "No schedule"}
        </Text>

        <View className="flex-row items-center">
          <Text className="font-semibold mr-2">Type</Text>
          {platform ? (
            <platform.Icon name={platform.name} size={22} color={platform.color} />
          ) : (
            <Text>{item.type}</Text>
          )}
        </View>
      </View>
    );
  };

  const visiblePosts = posts.slice(0, visibleCount);
  const isAllVisible = visibleCount >= posts.length;

  if (!campaign) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" />
        <Text className="mt-3">Loading campaign...</Text>
      </View>
    );
  }

  return (  
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-xl font-bold mb-3">Campaign Details</Text>

      <CampaignCard
        campaign={campaign}
        showActions={false}
        alwaysExpanded={true}
        postButtonTopRight={true}
        hidePostsHeading={true}
        onDelete={() => { }}
        onCopy={() => { }}
        onToggleShow={() => { }}
        onPressPost={() =>
          router.push({
            pathname: "/campaigns/campaignComponents/campaignPost",
            params: { campaignId: String(campaign.id) },
          })
        }
      />

      {/* POSTS */}
      <View className="mt-4 flex-1">
        <Text className="text-xl font-bold mb-3">Created Posts</Text>

        {posts.length === 0 ? (
          <Text className="text-gray-500 text-center">No records found</Text>
        ) : (
          <FlatList
            data={visiblePosts}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderPostItem}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              posts.length > 5 ? (
                <TouchableOpacity
                  onPress={isAllVisible ? () => setVisibleCount(5) : () => setVisibleCount((v) => v + 5)}
                  className={`py-3 my-2 rounded-xl items-center ${isAllVisible ? "bg-red-100" : "bg-blue-100"
                    }`}
                >
                  <Text className={`font-semibold ${isAllVisible ? "text-red-700" : "text-blue-700"}`}>
                    {isAllVisible ? "Show Less" : "Load More"}
                  </Text>
                </TouchableOpacity>
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
}
