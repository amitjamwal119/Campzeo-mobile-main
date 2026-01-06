import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

/* ---------------- TYPES ---------------- */
export interface Campaign {
  id: number;
  details: string;
  dates: string;
  description: string;
  posts?: string[];
  postsCount?: number;
  show?: boolean;
  contactsCount?: number;
  contacts?: any[];
}

interface CampaignCardProps {
  campaign: Campaign;
  postsCount?: number;
  onDelete: (c: Campaign) => void;
  onCopy: (c: Campaign) => void;
  onToggleShow: (c: Campaign) => void;
  onEdit?: (campaign: Campaign) => void;
}

/* ---------------- COMPONENT ---------------- */
export default function CampaignCard({
  campaign,
  postsCount = 0,
  onDelete,
  onCopy,
  onToggleShow,
  onEdit,
}: CampaignCardProps) {
  const getStatus = () => {
    const [startStr, endStr] = campaign.dates.split(" - ");
    const today = new Date();

    const start = new Date(startStr);
    const end = new Date(endStr);

    if (today < start) return "Scheduled";
    if (today > end) return "Completed";
    return "Active";
  };

  const status = getStatus();

  return (
    <View className="bg-gray-200 p-4 rounded-xl mb-4">
      <View className="flex-row justify-between">
        <Text className="font-bold text-lg">{campaign.details}</Text>

        <View className="flex-row">
          <TouchableOpacity onPress={() => onEdit?.(campaign)} className="mx-1">
            <Ionicons name="create-outline" size={22} color="#10b981" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDelete(campaign)} className="mx-1">
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onToggleShow(campaign)} className="mx-1">
            <Ionicons
              name={campaign.show ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-gray-700 mt-2">{campaign.description}</Text>

      <View className="flex-row justify-between mt-3">
        <Text>{campaign.contactsCount ?? 0} Contacts</Text>
        <Text>{postsCount} Posts</Text>
        <Text>{status}</Text>
      </View>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/campaigns/campaignsDetails",
            params: { id: campaign.id.toString() },
          })
        }
        className="mt-3 bg-blue-100 py-2 rounded-lg"
      >
        <Text className="text-center text-blue-600 font-semibold">
          View / Create Post
        </Text>
      </TouchableOpacity>
    </View>
  );
}
