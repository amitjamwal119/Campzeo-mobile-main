import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  Share,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CampaignCard, { Campaign } from "./campaignComponents/campaignCard";
import Pagination from "./campaignComponents/pagination";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Add new campaign from CreateCampaign screen
  const handleCreateCampaign = (form: any) => {
    const newItem: Campaign = {
      id: Date.now(),
      details: form.name,
      dates: `${form.startDate} - ${form.endDate}`,
      description: form.description, // ✅ ADDED mapping
      posts: [],
      show: true,
    };

    setCampaigns((prev) => [newItem, ...prev]);
  };

  // Delete campaign
  const handleDelete = (c: Campaign) => {
    setCampaigns((prev) => prev.filter((item) => item.id !== c.id));
  };

  // Copy campaign
  const handleCopy = (c: Campaign) => {
    const copy = {
      ...c,
      id: Date.now(),
      details: c.details + " (Copy)",
    };
    setCampaigns((prev) => [copy, ...prev]);
  };

  // Toggle Show / Hide
  const handleToggleShow = (c: Campaign) => {
    setCampaigns((prev) =>
      prev.map((item) =>
        item.id === c.id ? { ...item, show: !item.show } : item
      )
    );
  };

  // Share
  const handleShare = async (c: Campaign) => {
    try {
      await Share.share({
        message: `Campaign: ${c.details}\nDates: ${c.dates}\nDescription: ${c.description}`,
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share content.");
    }
  };

  // Filters
  const filtered = campaigns.filter((c) => {
    const matchesSearch =
      c.details.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "show"
        ? c.show
        : !c.show;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <View className="flex-1 bg-gray-100 p-4">

      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <ThemedText className="text-2xl font-bold">Campaigns</ThemedText>

        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() =>
            router.push({
              pathname: "/campaigns/createCampaign",
              params: { onCreate: "local" },
            })
          }
        >
          <Text className="text-white font-semibold">+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View className="flex-row items-center bg-white px-3 py-2 rounded-xl mb-3 shadow">
        <Ionicons name="search-outline" size={20} color="#6b7280" />
        <TextInput
          placeholder="Search campaigns"
          className="ml-2 flex-1"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View className="flex-row justify-around mb-4">
        {["all", "show", "hide"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setStatusFilter(item)}
            className={`px-4 py-2 rounded-xl ${
              statusFilter === item ? "bg-blue-500" : "bg-white"
            }`}
          >
            <Text
              className={`font-semibold ${
                statusFilter === item ? "text-white" : "text-gray-700"
              }`}
            >
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Campaign List */}
      <FlatList
        data={paginated}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CampaignCard
            campaign={item}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onToggleShow={handleToggleShow}
          />
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">
            No campaigns found
          </Text>
        }
      />

      {/* Pagination */}
      {filtered.length > pageSize && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </View>
  );
}
