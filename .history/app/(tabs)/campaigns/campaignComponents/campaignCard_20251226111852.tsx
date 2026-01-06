import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Define Campaign type
export interface Campaign {
  id: number;
  details: string;
  dates: string;
  description: string;
  posts: string[];
  show?: boolean;
  contactsCount?: number;
  contacts?: any[];
  status?: "Completed" | "Scheduled";
}

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: (c: Campaign) => void;
  onCopy: (c: Campaign) => void;
  onToggleShow: (c: Campaign) => void;
  showActions?: boolean;
  showPostButton?: boolean;
  alwaysExpanded?: boolean;
  hidePostsHeading?: boolean;
  postButtonTopRight?: boolean;
  onPressPost?: () => void;
  onEdit?: (campaign: Campaign) => void;
}

export default function CampaignCard({
  campaign,
  onDelete,
  onCopy,
  onToggleShow,
  showActions = true,
  showPostButton = true,
  alwaysExpanded = false,
  hidePostsHeading = false,
  postButtonTopRight = false,
  onPressPost,
  onEdit,
}: CampaignCardProps) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(campaign);
    } else {
      router.push({
        pathname: "/campaigns/createCampaign",
        params: {
          campaign: JSON.stringify(campaign),
        },
      });
    }
  };

  const handleDelete = () => {
    onDelete(campaign);
  };

  const handleAddPost = () => {
    if (onPressPost) {
      onPressPost();
    } else {
      router.push({
        pathname: "/campaigns/campaignsDetails",
        params: { campaign: JSON.stringify(campaign) },
      });
    }
  };

  const isExpanded = alwaysExpanded || campaign.show;

  return (
    <View className="bg-gray-200 p-4 rounded-xl mb-4 shadow">
      {/* Title + Actions + Top-right Post button */}
      <View className="flex-row mb-2 items-start">
        <View className="flex-1 pr-10">
          <Text
            className="font-bold text-lg"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {campaign.details ?? "Untitled Campaign"}
          </Text>
        </View>

        <View className="flex-row items-start w-28 justify-end">
          {postButtonTopRight && showPostButton && (
            <TouchableOpacity
              onPress={handleAddPost}
              className="flex-row items-center px-4 py-2 rounded-full"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={22} color="#3b82f6" />
              <Text className="ml-2 text-blue-500 font-semibold text-base">
                Post
              </Text>
            </TouchableOpacity>
          )}

          {showActions && (
            <View className="flex-row">
              <TouchableOpacity onPress={handleEdit} className="mx-1">
                <Ionicons name="create-outline" size={24} color="#10b981" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} className="mx-1">
                <Ionicons name="trash-outline" size={24} color="#ef4444" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onCopy(campaign)} className="mx-1">
                <Ionicons name="copy-outline" size={24} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onToggleShow(campaign)}
                className="mx-1"
              >
                <Ionicons
                  name={campaign.show ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Expandable Content */}
      {isExpanded && (
        <View>
          <Text className="font-bold text-gray-900 mb-1">Description</Text>
          <Text className="text-gray-700 mb-3" style={{ textAlign: "justify" }}>
            {campaign.description ?? "No description available"}
          </Text>

          {/* Duration + Contacts + Status + Post Button */}
          <View className="flex-row items-center mb-3">
            {/* Left side: Duration + Contacts */}
            <View className="flex-1">
              <Text className="font-bold text-gray-900 mb-1 text-base">Duration</Text>
              <Text className="text-gray-700 text-base">
                {campaign.dates ?? "Date not available"}
              </Text>

              <View className="flex-row items-center mt-2">
                <Ionicons name="people-outline" size={18} color="#4b5563" />
                <Text className="ml-2 text-gray-700 text-base">
                  {campaign.contactsCount ?? 0} Contacts
                </Text>

                <View
                  className={`ml-auto px-4 py-1 rounded-full ${
                    campaign.status === "Completed" ? "bg-gray-300" : "bg-green-200"
                  }`}
                >
                  <Text
                    className={`text-base font-semibold ${
                      campaign.status === "Completed"
                        ? "text-gray-700"
                        : "text-green-700"
                    }`}
                  >
                    {campaign.status ?? "Scheduled"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Post button */}
            {showPostButton && !postButtonTopRight && (
              <TouchableOpacity
                onPress={handleAddPost}
                className="flex-row items-center px-4 py-2 rounded-full ml-3"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                activeOpacity={0.8}
              >
                <Ionicons name="add-circle-outline" size={22} color="#3b82f6" />
                <Text className="ml-2 text-blue-500 font-semibold text-base">
                  Post
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
