import { useState } from "react";
import { FlatList, TextInput, TouchableOpacity, Share } from "react-native";
import { View, Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import CampaignCard, { Campaign } from "./campaign-components/campaignCard";
import Pagination from "../contacts/contactComponents/pagination";
import { router } from "expo-router";

export default function Campaigns() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "show" | "hide">("all");

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      details: "New Year Offer",
      dates: "01 Jan 2025 - 10 Jan 2025",
      description: "Celebrate the new year with amazing discounts!",
      posts: [],
      show: true,
    },
    {
      id: 2,
      details: "Summer Promo",
      dates: "15 Jun 2025 - 30 Jun 2025",
      description: "Hot summer deals on all products.",
      posts: [],
      show: true,
    },
    {
      id: 3,
      details: "Holiday Sale",
      dates: "20 Dec 2025 - 31 Dec 2025",
      description: "End-of-year holiday sale for all customers.",
      posts: [],
      show: true,
    },
    {
      id: 4,
      details: "Winter Fest",
      dates: "01 Dec 2025 - 15 Dec 2025",
      description: "Warm up your winter with festive offers.",
      posts: [],
      show: true,
    },
    {
      id: 5,
      details: "Spring Offer",
      dates: "01 Mar 2025 - 15 Mar 2025",
      description: "Fresh spring collection discounts.",
      posts: [],
      show: true,
    },
    {
      id: 6,
      details: "Black Friday",
      dates: "25 Nov 2025 - 30 Nov 2025",
      description: "Massive Black Friday deals for limited time.",
      posts: [],
      show: true,
    },
  ]);

  const pageLimit = 5;

  // Filter + Search
  let filtered = campaigns.filter((c) =>
    c.details.toLowerCase().includes(search.toLowerCase())
  );
  if (filter === "show") filtered = filtered.filter((c) => c.show);
  else if (filter === "hide") filtered = filtered.filter((c) => !c.show);

  const totalPages = Math.ceil(filtered.length / pageLimit);
  const currentCampaigns = filtered.slice(
    (page - 1) * pageLimit,
    page * pageLimit
  );

  // Handlers
  const handleDelete = (c: Campaign) =>
    setCampaigns((prev) => prev.filter((x) => x.id !== c.id));

  const handleCopy = (c: Campaign) => {
    const newCampaign = {
      ...c,
      id: campaigns.length + 1,
      details: c.details + " (Copy)",
      posts: [],
      description: c.description,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
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
    const next = filter === "all" ? "show" : filter === "show" ? "hide" : "all";
    setFilter(next);
    setPage(1);
  };

  // Navigate to Campaign Post page
  const handleAddPost = (campaign: Campaign) => {
    router.push({
      pathname: "/campaigns/campaign-components/campaignPost",
      params: { campaign: JSON.stringify(campaign) },
    });
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {/* Top Controls */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          onPress={() => router.push("/campaigns/createCampaign")}
          className="flex-row items-center justify-center px-3 py-2 rounded-xl bg-blue-100 mr-2"
        >
          <Ionicons name="add-circle" size={20} color="#0284c7" />
          <Text className="ml-2 font-semibold text-blue-700">New</Text>
        </TouchableOpacity>

        <TextInput
          value={search}
          onChangeText={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search campaigns..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white mr-2"
        />

        <TouchableOpacity
          onPress={handleShare}
          className="px-3 py-2 rounded-xl bg-green-100 mr-2"
        >
          <Ionicons name="share-social" size={20} color="#16a34a" />
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

      {/* Campaign List with Pagination as Footer */}
      <FlatList
        data={currentCampaigns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CampaignCard
            campaign={item}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onToggleShow={handleToggleShow}
            showActions={true}         // Show edit/copy/delete/toggle icons
            showPostButton={true}      // Show Post button
            alwaysExpanded={true}      // Always show description & dates
            onPressPost={() => handleAddPost(item)} // Navigate to campaignPost.tsx
          />
        )}
        ListFooterComponent={
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        }
      />
    </View>
  );
}
