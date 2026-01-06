import React from "react";
import { View, Text, TouchableOpacity, Alert, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
 
const SCREEN_WIDTH = Dimensions.get("window").width;

// Define Campaign type
export interface Campaign {
  id: number;
  details: string;
  dates: string;
  description: string;
  posts: string[];
  show?: boolean;
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
        params: { campaign: JSON.stringify({}) },
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
    <View className="bg-white p-4 rounded-xl mb-4 shadow">
 
      {/* TITLE + ACTIONS */}
      <View className="flex-row justify-between items-start mb-2">
        
        {/* ✅ HARD WIDTH LIMIT (FINAL FIX) */}
        <Text
          className="font-bold text-lg"
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{ maxWidth: SCREEN_WIDTH * 0.65 }}
        >
          {campaign.details}
        </Text>
 
        {/* ACTION ICONS */}
        <View className="flex-row items-center">
          {postButtonTopRight && showPostButton && (
            <TouchableOpacity onPress={handleAddPost} className="flex-row items-center mr-2">
              <Ionicons name="add-circle-outline" size={22} color="#0284c7" />
              <Text className="text-[#0284c7] font-semibold ml-1">Post</Text>
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
 
      {/* EXPANDABLE CONTENT */}
      {isExpanded && (
        <View>
          <Text className="font-bold text-gray-900 mb-1">Description</Text>
          <Text className="text-gray-700 mb-3">{campaign.description}</Text>
 
          <Text className="font-bold text-gray-900 mb-1">Dates</Text>
          <Text className="text-gray-700 mb-3">{campaign.dates}</Text>
 
          {showPostButton && !postButtonTopRight && (
            <View className="flex-row justify-between items-center">
              {!hidePostsHeading && (
                <Text className="font-bold text-gray-900">Posts</Text>
              )}
              <TouchableOpacity onPress={handleAddPost} className="flex-row items-center">
                <Ionicons name="add-circle-outline" size={20} color="#0284c7" />
                <Text className="text-[#0284c7] font-semibold ml-1">Post</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
