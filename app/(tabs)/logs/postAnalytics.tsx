import { getAnalytics, getRefreshLog } from "@/api/logsApi";
import { Ionicons } from "@expo/vector-icons";
import { HStack, VStack, Pressable, Text, Box } from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  useColorScheme,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function PostAnalytics() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { postId } = useLocalSearchParams();

  const id = Number(postId);

  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalytics(id);
        setAnalytics(res);
      } catch (error) {
        console.log("Error fetching analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  const post = analytics?.post;
  const insight = post?.insight;
  const media = post?.mediaUrls;

  const isMultipleImages = Array.isArray(media) && media.length > 1;
  const isSingleImage = typeof media === "string";

  const handleRefreshClick = async () => {
    if (!id) {
      Alert.alert("Error", "Platform not available for refresh");
      return;
    }

    // if (isDeleted) {
    //   Alert.alert(
    //     "Post Deleted",
    //     "This post has been deleted from the platform."
    //   );
    //   return;
    // }

    try {
      await getAnalytics(id);
      Alert.alert("Success", "Post refreshed successfully");
    } catch (error) {
      console.log("Error refreshing Post:", error);
      Alert.alert("Error", "Failed to refresh Post");
    }
  };

  return (
    <VStack space="md" className="flex-1 px-4 py-3">
      {/* Back */}
      <HStack alignItems="center">
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="arrow-back-outline"
            size={22}
            color={colorScheme === "dark" ? "#ffffff" : "#020617"}
          />
        </Pressable>

        <Text>Post Insights</Text>
      </HStack>
      {/* Platform */}
      <Text className="text-base font-medium">Platform: {post?.platform}</Text>

      {/* Message */}
      <Text className="text-base font-medium">{post?.message}</Text>

      {/* Published Date */}
      <Text className="text-xs text-gray-500">
        Published on {new Date(post?.publishedAt).toDateString()}
      </Text>
      {/* Updated Date */}
      <Text className="text-xs text-gray-500">
        Updated on {new Date(post?.updatedAt).toDateString()}
      </Text>

      {/* Media */}
      {isMultipleImages && (
        <Carousel
          width={width - 32}
          height={220}
          data={media}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          )}
        />
      )}

      {isSingleImage && (
        <Image
          source={{ uri: media }}
          className="w-full h-[220px] rounded-lg"
          resizeMode="cover"
        />
      )}

      {/* Insights */}
      <HStack
        justifyContent="space-between"
        className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-3"
      >
        <VStack>
          <Text className="text-xs text-gray-500">Likes</Text>
          <Text className="font-semibold">{insight?.likes ?? 0}</Text>
        </VStack>

        <VStack>
          <Text className="text-xs text-gray-500">Comments</Text>
          <Text className="font-semibold">{insight?.comments ?? 0}</Text>
        </VStack>

        <VStack>
          <Text className="text-xs text-gray-500">Impressions</Text>
          <Text className="font-semibold">{insight?.impressions ?? 0}</Text>
        </VStack>

        <VStack>
          <Text className="text-xs text-gray-500">Reach</Text>
          <Text className="font-semibold">{insight?.reach ?? 0}</Text>
        </VStack>
        {/* Refresh */}
        <VStack alignItems="center">
          <TouchableOpacity onPress={handleRefreshClick}>
            <Ionicons
              name="refresh"
              size={20}
              color={isDark ? "#e5e7eb" : "#374151"}
            />
          </TouchableOpacity>
          <Text style={{ color: "#2563eb", fontSize: 13 }}>Refresh</Text>
        </VStack>
      </HStack>
    </VStack>
  );
}
