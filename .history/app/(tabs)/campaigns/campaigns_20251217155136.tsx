import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "@gluestack-ui/themed";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Share,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import CampaignCard, { Campaign } from "./campaignComponents/campaignCard";
import { useAuth } from "@clerk/clerk-expo";
import {
  getCampaignsApi,
  deleteCampaignApi,
  updateCampaignApi,
} from "@/api/campaign/campaignApi";

export default function Campaigns() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "show" | "hide">("all");
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { getToken } = useAuth();

  // Rotating border animation ref
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found");

      const res = await getCampaignsApi(token, 1, 50, search);
      const campaignsArray = res?.campaigns ?? [];

      if (!campaignsArray.length) {
        setCampaigns([]);
        return;
      }

      const mapped = campaignsArray.map((item: any) => ({
        id: item.id,
        details: item.name,
        dates: `${item.startDate?.split("T")[0]} - ${item.endDate?.split("T")[0]}`,
        description: item.description,
        posts: item.posts ?? [],
        show: true,
      }));

      setCampaigns(mapped);
    } catch (err) {
      console.log("GET CAMPAIGNS ERROR:", err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCampaigns();
    }, [search])
  );

  // Filter + Search
  let filtered = campaigns.filter((c) =>
    c.details.toLowerCase().includes(search.toLowerCase())
  );
  if (filter === "show") filtered = filtered.filter((c) => c.show);
  else if (filter === "hide") filtered = filtered.filter((c) => !c.show);

  const visibleCampaigns = filtered.slice(0, visibleCount);
  const isAllVisible = visibleCount >= filtered.length;

  // Delete
  const handleDelete = async (c: Campaign) => {
    Alert.alert(
      "Delete Campaign?",
      "Are you sure you want to delete this campaign?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await getToken();
              if (!token) throw new Error("Authentication token missing");

              await deleteCampaignApi(c.id, token);
              setCampaigns((prev) => prev.filter((x) => x.id !== c.id));
            } catch (error: any) {
              console.error("Error deleting campaign:", error);
              Alert.alert(
                "Failed to delete campaign",
                error?.message || "Unknown error"
              );
            }
          },
        },
      ]
    );
  };

  const handleCopy = (c: Campaign) => {
    // disabled for now
  };

  const handleToggleShow = (c: Campaign) =>
    setCampaigns((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, show: !x.show } : x))
    );

  const handleShare = async () => {
    if (!campaigns.length) return;
    const header = "Details\tDates\tDescription\n";
    const message =
      header +
      campaigns
        .map((c) => `${c.details}\t${c.dates}\t${c.description}`)
        .join("\n");

    try {
      await Share.share({ message });
    } catch (e) {
      console.log(e);
    }
  };

  const toggleFilter = () => {
    const next =
      filter === "all" ? "show" : filter === "show" ? "hide" : "all";
    setFilter(next);
    setVisibleCount(5);
  };

  const handleLoadMore = () => setVisibleCount((prev) => prev + 5);
  const handleShowLess = () => setVisibleCount(5);

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {loading && (
        <View className="absolute inset-0 justify-center items-center bg-black/10 z-10">
          <ActivityIndicator size="large" />
        </View>
      )}

      {/* Top Controls */}
      <View className="flex-row items-center mb-4">
        <Animated.View
          style={[
            styles.animatedBorder,
            { transform: [{ rotate }] },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.push("/campaigns/createCampaign")}
            className="flex-row items-center justify-center px-3 py-2 rounded-xl bg-blue-100 mr-2"
          >
            <Ionicons name="add-circle-outline" size={20} color="#0284c7" />
            <Text className="ml-2 font-semibold text-blue-700">New</Text>
          </TouchableOpacity>
        </Animated.View>

        <TextInput
          value={search}
          onChangeText={(value) => {
            setSearch(value);
            setVisibleCount(5);
          }}
          placeholder="Search campaigns..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white mr-2"
        />

        <TouchableOpacity
          onPress={handleShare}
          className="px-3 py-2 rounded-xl bg-green-100 mr-2"
        >
          <Ionicons name="share-social-outline" size={20} color="#16a34a" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleFilter}
          className="flex-row items-center px-3 py-2 rounded-xl bg-yellow-100"
        >
          <Ionicons name="funnel-outline" size={20} color="#f59e0b" />
          <Text className="ml-2 font-semibold text-yellow-700">
            {filter === "all" ? "All" : filter === "show" ? "Show" : "Hide"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Campaign List */}
      <FlatList
        data={visibleCampaigns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CampaignCard
            campaign={item}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onToggleShow={handleToggleShow}
            onEdit={(campaign) =>
              router.push({
                pathname: "/campaigns/createCampaign",
                params: {
                  id: campaign.id.toString(), 
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          loading ? null : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No Campaigns Found
            </Text>
          )
        }
        ListFooterComponent={
          filtered.length > 5 ? (
            <TouchableOpacity
              onPress={isAllVisible ? handleShowLess : handleLoadMore}
              className={`py-3 my-2 rounded-xl items-center ${isAllVisible ? "bg-red-100" : "bg-blue-100"
                }`}
            >
              <Text
                className={`font-semibold ${isAllVisible ? "text-red-700" : "text-blue-700"
                  }`}
              >
                {isAllVisible ? "Show Less" : "Load More"}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animatedBorder: {
    borderWidth: 2,
    borderColor: "#0284c7",
    borderRadius: 14,
  },
});
