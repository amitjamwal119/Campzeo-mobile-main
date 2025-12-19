import {
  View,
  Text,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import Carousel from "react-native-reanimated-carousel";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VStack } from "@gluestack-ui/themed";
import { ThemedView } from "@/components/themed-view";
import { getRefreshLog } from "@/api/logsApi";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

type LogsCardProps = {
  record: any;
  platformLabel: string | null;
};

export default function LogsCard({ record, platformLabel }: LogsCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const recordPostId = record?.id;
  const isDeleted = record?.insight?.isDeleted === true;
  const media = record?.mediaUrls;

  const hasMultipleImages = Array.isArray(media) && media.length > 1;
  const hasSingleImage =
    typeof media === "string" || (Array.isArray(media) && media.length === 1);

  const singleImageUrl = typeof media === "string" ? media : media?.[0];

  const handleRefreshClick = async () => {
    if (!platformLabel) {
      Alert.alert("Error", "Platform not available for refresh");
      return;
    }

    if (isDeleted) {
      Alert.alert(
        "Post Deleted",
        "This post has been deleted from the platform."
      );
      return;
    }

    try {
      console.log("Refreshing logs for:", platformLabel);
      await getRefreshLog(platformLabel);
      Alert.alert("Success", "Log refreshed successfully");
    } catch (error) {
      console.log("Error refreshing log:", error);
      Alert.alert("Error", "Failed to refresh log");
    }
  };

  const handleBlockedAction = () => {
    console.log("type of post id is:", typeof recordPostId);

    Alert.alert(
      "Post Deleted",
      "This post has been deleted from the platform."
    );
  };

  return (
    <View
      style={{
        backgroundColor: isDark ? "#020617" : "#ffffff",
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? "#1e293b" : "transparent",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      {/* ---------- MEDIA ---------- */}

      {hasSingleImage && (
        <View
          style={{ marginBottom: 12, borderRadius: 10, overflow: "hidden" }}
        >
          <Image
            source={{ uri: singleImageUrl }}
            style={{ width: "100%", height: 200 }}
            resizeMode="cover"
          />

          {isDeleted && (
            <>
              <BlurView
                intensity={50}
                tint="dark"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  inset: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#f87171", fontSize: 16, fontWeight: "600" }}
                >
                  Post Deleted
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      {hasMultipleImages && (
        <View
          style={{ marginBottom: 12, borderRadius: 10, overflow: "hidden" }}
        >
          <Carousel
            width={width - 32}
            height={200}
            data={media}
            pagingEnabled
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width: "100%", height: 200 }}
                resizeMode="cover"
              />
            )}
          />
        </View>
      )}

      {/* ---------- MESSAGE ---------- */}

      <Text
        style={{
          fontSize: 14,
          color: isDeleted ? "#dc2626" : isDark ? "#e5e7eb" : "#111827",
          textDecorationLine: isDeleted ? "line-through" : "none",
          marginBottom: 6,
        }}
      >
        {record.message}
      </Text>

      {isDeleted && (
        <Text style={{ color: "#dc2626", fontSize: 12, fontWeight: "600" }}>
          This post has been deleted
        </Text>
      )}

      {/* ---------- INSIGHTS ---------- */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <Text style={{ fontSize: 12 }}>
          Likes: {isDeleted ? "-" : record.insight?.likes || "-"}
        </Text>
        <Text style={{ fontSize: 12 }}>
          Comments: {isDeleted ? "-" : record.insight?.comments || "-"}
        </Text>
        <Text style={{ fontSize: 12 }}>
          Engagement: {isDeleted ? "-" : record.insight?.engagementRate || "-"}
        </Text>
      </View>

      {/* ---------- ACTIONS ---------- */}

      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        {/* Refresh */}
        <VStack alignItems="center">
          <TouchableOpacity disabled={isDeleted} onPress={handleRefreshClick}>
            <Ionicons
              name="refresh"
              size={20}
              color={isDark ? "#e5e7eb" : "#374151"}
            />
          </TouchableOpacity>
          <Text style={{ color: "#2563eb", fontSize: 13 }}>Refresh</Text>
        </VStack>

        {/* Analytics */}
        <VStack alignItems="center">
          <TouchableOpacity
            onPress={() => {
              // handleBlockedAction();
              router.push({
                pathname: "/(tabs)/logs/postAnalytics",
                params: { postId: Number(recordPostId) },
              });
            }}
          >
            <Ionicons
              name="stats-chart"
              size={20}
              color={isDark ? "#e5e7eb" : "#374151"}
            />
          </TouchableOpacity>
          <Text style={{ color: "#2563eb", fontSize: 13 }}>Analytics</Text>
        </VStack>
      </ThemedView>
    </View>
  );
}
