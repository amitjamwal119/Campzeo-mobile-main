import { Ionicons } from "@expo/vector-icons";
import { Text, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert, Share, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState, useRef, useEffect } from "react";
import CampaignCard, { Campaign } from "./campaignComponents/campaignCard";
import { useAuth } from "@clerk/clerk-expo";
import { getCampaignsApi, deleteCampaignApi } from "@/api/campaign/campaignApi";
import Svg, { Circle, G } from "react-native-svg";
import Animated, { Easing } from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Campaigns() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "show" | "hide">("all");
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { getToken } = useAuth();

  // Animated Button refs
  const size = 60;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, circumference],
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

  const handleCopy = (c: Campaign) => {};
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
        {/* Animated Button */}
        <View style={{ width: size, height: size, marginRight: 10 }}>
          <Svg width={size} height={size}>
            <G rotation="-90" originX={size / 2} originY={size / 2}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#0284c7"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#00f0ff"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference / 4}, ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>

          <TouchableOpacity
            onPress={() => router.push("/campaigns/createCampaign")}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: size,
              height: size,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: size / 2,
              backgroundColor: "#e0f2fe",
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="#0284c7" />
            <Text
              style={{
                position: "absolute",
                bottom: -18,
                color: "#0284c7",
                fontWeight: "600",
              }}
            >
              New
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput
          value={search}
          onChangeText={(value) => {
            setSearch(value);
            setVisibleCount(5);
          }}
          placeholder="Search campaigns..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white mr-2"
        />

        {/* Share */}
        <TouchableOpacity
          onPress={handleShare}
          className="px-3 py-2 rounded-xl bg-green-100 mr-2"
        >
          <Ionicons name="share-social-outline" size={20} color="#16a34a" />
        </TouchableOpacity>

        {/* Filter */}
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
              className={`py-3 my-2 rounded-xl items-center ${
                isAllVisible ? "bg-red-100" : "bg-blue-100"
              }`}
            >
              <Text
                className={`font-semibold ${
                  isAllVisible ? "text-red-700" : "text-blue-700"
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
