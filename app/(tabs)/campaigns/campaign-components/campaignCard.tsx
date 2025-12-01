import React from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Define Campaign type
export interface Campaign {
  id: number;
  details: string;
  dates: string;
  posts: string[];
  show?: boolean;
}

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (c: Campaign) => void;
  onDelete: (c: Campaign) => void;
  onCopy: (c: Campaign) => void;
  onToggleShow: (c: Campaign) => void;
}

export default function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  onCopy,
  onToggleShow,
}: CampaignCardProps) {
  // Delete handler
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${campaign.details}"?`,
      [
        { text: "No", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: () => onDelete(campaign) },
      ],
      { cancelable: true }
    );
  };

  // Navigate to campaignPost.tsx
  const handleAddPost = () => {
    router.push({
      pathname: "/campaigns/campaignPost",
      params: { campaignId: campaign.id.toString() },
    });
  };

  return (
    <View className="bg-white p-4 rounded-xl mb-4 shadow">
      {/* Details + Action Icons */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-bold text-lg">{campaign.details}</Text>
        <View className="flex-row">
          <TouchableOpacity onPress={() => onEdit(campaign)} className="mx-1">
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
      </View>

      {/* Campaign Details */}
      {campaign.show && (
        <View className="mt-2">
          <Text className="font-bold text-gray-900 mb-1">Dates</Text>
          <Text className="text-gray-700 mb-2">{campaign.dates}</Text>

          {/* Posts Section */}
          <View>
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-gray-900 mb-1">Posts</Text>
              <TouchableOpacity
                onPress={handleAddPost}
                className="flex-row items-center space-x-1"
              >
                <Ionicons name="add-circle-outline" size={20} color="#0284c7" />
                <Text className="text-[#0284c7] font-semibold">Post</Text>
              </TouchableOpacity>
            </View>

            {campaign.posts.length === 0 ? (
              <Text className="text-gray-500 mt-1">No posts yet</Text>
            ) : (
              <FlatList
                data={campaign.posts}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text className="text-gray-700 mt-1">• {item}</Text>
                )}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}


// Vik new

// import React from "react";
// import { View, Text, TouchableOpacity, Alert } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";

// // Define Campaign type
// export interface Campaign {
//   id: number;
//   details: string;
//   dates: string;
//   description: string;
//   posts: string[];
//   show?: boolean;
// }

// interface CampaignCardProps {
//   campaign: Campaign;
//   onDelete: (c: Campaign) => void;
//   onCopy: (c: Campaign) => void;
//   onToggleShow: (c: Campaign) => void;
//   showActions?: boolean;       // optional prop to hide action icons
//   showPostButton?: boolean;    // optional prop to hide posts heading & button
//   alwaysExpanded?: boolean;    // optional prop to always show content
//   hidePostsHeading?: boolean;  // optional prop to hide "Posts" heading text
//   postButtonTopRight?: boolean; // optional prop to move Post button to top-right
//   onPressPost?: () => void;     // optional custom handler for Post button
// }

// export default function CampaignCard({
//   campaign,
//   // onEdit,
//   onDelete,
//   onCopy,
//   onToggleShow,
//   showActions = true,
//   showPostButton = true,
//   alwaysExpanded = false,
//   hidePostsHeading = false,
//   postButtonTopRight = false,
//   onPressPost,
// }: CampaignCardProps) {

//   const handleEdit = () => {
//     router.push({
//       pathname: "/campaigns/createCampaign",
//       params: { campaignId: campaign.id.toString() },
//     });
//   };

//   const handleDelete = () => {
//     Alert.alert(
//       "Confirm Delete",
//       `Are you sure you want to delete "${campaign.details}"?`,
//       [
//         { text: "No", style: "cancel" },
//         { text: "Yes", style: "destructive", onPress: () => onDelete(campaign) },
//       ]
//     );
//   };

//   // Default add post behavior if no custom handler is provided
//   const handleAddPost = () => {
//     if (onPressPost) {
//       onPressPost();
//     } else {
//       router.push({
//         pathname: "/campaigns/campaignDetails",
//         params: { campaign: JSON.stringify(campaign) },
//       });
//     }
//   };

//   const isExpanded = alwaysExpanded || campaign.show;

//   return (
//     <View className="bg-white p-4 rounded-xl mb-4 shadow">

//       {/* Title + Actions + Top-right Post button */}
//       <View className="flex-row justify-between items-center mb-2">
//         <Text className="font-bold text-lg">{campaign.details}</Text>

//         <View className="flex-row items-center">
//           {postButtonTopRight && showPostButton && (
//             <TouchableOpacity onPress={handleAddPost} className="flex-row items-center mr-2">
//               <Ionicons name="add-circle-outline" size={22} color="#0284c7" />
//               <Text className="text-[#0284c7] font-semibold ml-1">Post</Text>
//             </TouchableOpacity>
//           )}

//           {showActions && (
//             <View className="flex-row">
//               <TouchableOpacity onPress={handleEdit} className="mx-1">
//                 <Ionicons name="create-outline" size={22} color="#10b981" />
//               </TouchableOpacity>

//               <TouchableOpacity onPress={handleDelete} className="mx-1">
//                 <Ionicons name="trash-outline" size={22} color="#ef4444" />
//               </TouchableOpacity>

//               <TouchableOpacity onPress={() => onCopy(campaign)} className="mx-1">
//                 <Ionicons name="copy-outline" size={22} color="#3b82f6" />
//               </TouchableOpacity>

//               <TouchableOpacity onPress={() => onToggleShow(campaign)} className="mx-1">
//                 <Ionicons
//                   name={campaign.show ? "eye-off-outline" : "eye-outline"}
//                   size={22}
//                   color="#6b7280"
//                 />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Expandable Content */}
//       {isExpanded && (
//         <View>
//           {/* Description */}
//           <Text className="font-bold text-gray-900 mb-1">Description</Text>
//           <Text className="text-gray-700 mb-3">{campaign.description}</Text>

//           {/* Dates */}
//           <Text className="font-bold text-gray-900 mb-1">Dates</Text>
//           <Text className="text-gray-700 mb-3">{campaign.dates}</Text>

//           {/* Posts heading + Add Post button at bottom */}
//           {showPostButton && !postButtonTopRight && (
//             <View className="flex-row justify-between items-center">
//               {!hidePostsHeading && (
//                 <Text className="font-bold text-gray-900">Posts</Text>
//               )}
//               <TouchableOpacity onPress={handleAddPost} className="flex-row items-center">
//                 <Ionicons name="add-circle-outline" size={20} color="#0284c7" />
//                 <Text className="text-[#0284c7] font-semibold ml-1">Post</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       )}
//     </View>
//   );
// }
