import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  ScrollView,
  View as RNView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { View, Text } from "@gluestack-ui/themed";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import CampaignPostForm from "./campaignPostForm";
import { useRoute } from "@react-navigation/native";

export default function CampaignPost() {
  const route = useRoute();

  const { campaignId, postId, type } = route.params as {
    campaignId: string;
    postId?: string;
    type?: string;
  };

  // ✅ Auto-select platform if coming from Edit
  const [selected, setSelected] = useState<string | null>(type ?? null);

  useEffect(() => {
    if (!campaignId || !postId) return;

    const fetchPostDetails = async () => {
      try {
        const url = `https://campzeo-v1-oym2.vercel.app/api/campaigns/${campaignId}/posts/${postId}`;
        console.log("Fetching post details from:", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("Post details API response:", data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
  }, [campaignId, postId]);

  console.log("CampaignPost received:", { campaignId, postId, type });

  const icons = [
    { name: "mail", label: "EMAIL", library: Ionicons, color: "#f59e0b" },
    {
      name: "chatbubble-ellipses-outline",
      label: "SMS",
      library: Ionicons,
      color: "#10b981",
    },
    {
      name: "instagram",
      label: "INSTAGRAM",
      library: FontAwesome,
      color: "#c13584",
    },
    {
      name: "logo-whatsapp",
      label: "WHATSAPP",
      library: Ionicons,
      color: "#25D366",
    },
    {
      name: "facebook-square",
      label: "FACEBOOK",
      library: FontAwesome,
      color: "#1877F2",
    },
    {
      name: "youtube-play",
      label: "YOUTUBE",
      library: FontAwesome,
      color: "#FF0000",
    },
    {
      name: "linkedin-square",
      label: "LINKEDIN",
      library: FontAwesome,
      color: "#0A66C2",
    },
    {
      name: "pinterest",
      label: "PINTEREST",
      library: FontAwesome,
      color: "#E60023",
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        className="flex-1 bg-gray-100 p-4"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 12,
            color: "black",
          }}
        >
          {postId ? "Edit Campaign Post" : "Create Campaign Post"}
        </Text>

        {/* ---------- ICON SECTION ---------- */}
        <View className="flex-row flex-wrap justify-between mb-4">
          {icons.map((icon, index) => {
            const IconComponent = icon.library;
            const isSelected = selected === icon.label;

            return (
              <View key={index} className="w-1/4 mb-6 items-center">
                <RNView
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: icon.color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: isSelected ? 0.5 : 0,
                    shadowRadius: isSelected ? 12 : 0,
                    elevation: isSelected ? 12 : 0,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setSelected(icon.label)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 2,
                      borderColor: isSelected ? icon.color : "#d1d5db",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <IconComponent
                      name={icon.name as any}
                      size={28}
                      color={icon.color}
                    />
                  </TouchableOpacity>
                </RNView>

                <Text
                  style={{
                    marginTop: 8,
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  {icon.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ---------- FORM ---------- */}
        {selected && (
          <View style={{ marginBottom: 10 }}>
            <CampaignPostForm
              platform={selected}
              campaignId={campaignId}
              postId={postId} // ✅ tells form it's EDIT mode
              onClose={() => setSelected(null)}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
