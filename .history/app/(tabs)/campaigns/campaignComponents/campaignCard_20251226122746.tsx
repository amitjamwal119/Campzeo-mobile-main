import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Define Campaign type
export interface Campaign {
  id: number;
  details: string;
  dates: string; // format: "YYYY-MM-DD - YYYY-MM-DD"
  description: string;
  posts: string[];
  show?: boolean;
  contactsCount?: number;
  contacts?: any[];
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

  /* ---------------- STATUS LOGIC ---------------- */
  const getStatus = () => {
    if (!campaign.dates) return "Scheduled";

    const [startStr, endStr] = campaign.dates.split("-").map(s => s.trim());
    if (!startStr) return "Scheduled";

    const startDate = new Date(startStr);
    const endDate = endStr ? new Date(endStr) : startDate;
    const today = new Date();
    today.setHours(0,0,0,0);

    if (today < startDate) return "Scheduled";
    if (today >= startDate && today <= endDate) return "Ongoing";
    return "Completed";
  };

  const status = getStatus();

  /* Correct contacts count */
  const contactsCount = Array.isArray(campaign.contacts)
    ? campaign.contacts.length
    : campaign.contactsCount ?? 0;

  /* ---------------- HANDLERS ---------------- */
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

      {/* Title + Actions */}
      <View className="flex-row mb-2 items-start">
        <View className="flex-1 pr-10">
          <Text className="font-bold text-lg" numberOfLines={1} ellipsizeMode="tail">
            {campaign.details ?? "Untitled Campaign"}
          </Text>
        </View>

        {/* Action buttons */}
        <View className="flex-row items-start w-24 justify-end">
          {postButtonTopRight && showPostButton && (
            <TouchableOpacity
              onPress={handleAddPost}
              className="flex-row items-center px-4 py-2 rounded-full"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
              <Text className="ml-2 text-blue-500 font-semibold">Post</Text>
            </TouchableOpacity>
          )}

          {showActions && (
            <View className="flex-row">
              <TouchableOpacity onPress={handleEdit} className="mx-1">
                <Ionicons name="create-outline" size={22} color="#10b981" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete} className="mx-1">
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onCopy(campaign)} className="mx-1">
                <Ionicons name="copy-outline" size={22} color="#3b82f6" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onToggleShow(campaign)} className="mx-1">
                <Ionicons
                  name={campaign.show ? "eye-off-outline" : "eye-outline"}
                  size={22}
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

          <View className="mb-3">
            {/* Duration */}
            <Text className="font-bold text-gray-900 mb-1">Duration</Text>
            <Text className="text-gray-700">
              {campaign.dates ?? "Date not available"}
            </Text>

            {/* Contacts | Status | Post */}
            <View className="flex-row items-center mt-3 w-full">

              {/* Left: Contacts */}
              <View className="flex-1 flex-row items-center">
                <Ionicons name="people-outline" size={18} color="#4b5563" />
                <Text className="ml-2 text-gray-700 text-base">
                  {campaign.contactsCount} Contacts
                </Text>
              </View>

              {/* Center: Status */}
              <View className="flex-1 items-center">
                <View
                  className={`px-2.5 py-1 rounded-full ${status === "Completed" ? "bg-gray-300" : status === "Ongoing" ? "bg-yellow-200" : "bg-green-200"}`}
                >
                  <Text
                    className={`text-[12px] font-semibold ${
                      status === "Completed"
                        ? "text-gray-700"
                        : status === "Ongoing"
                        ? "text-yellow-700"
                        : "text-green-700"
                    }`}
                  >
                    {status}
                  </Text>
                </View>
              </View>

              {/* Right: Post */}
              <View className="flex-1 items-end">
                {showPostButton && !postButtonTopRight && (
                  <TouchableOpacity
                    onPress={handleAddPost}
                    className="flex-row items-center px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: "rgba(59, 130, 246, 0.18)" }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add-circle-outline" size={16} color="#3b82f6" />
                    <Text className="ml-1.5 text-[12px] text-blue-500 font-semibold">
                      Post
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

            </View>
          </View>

        </View>
      )}
    </View>
  );
}
