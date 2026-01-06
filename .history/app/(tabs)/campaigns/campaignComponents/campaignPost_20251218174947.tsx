import React, { useState } from "react";
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
  const [selected, setSelected] = useState<string | null>(null);

  const route = useRoute();
 const { campaignId, postId } = route.params as {
  campaignId: string;
  postId: string;
};
   
console.log("CampaignPost received:", { campaignId, postId });

  const icons = [
    { name: "mail", label: "EMAIL", library: Ionicons, color: "#f59e0b" },
    { name: "chatbubble-ellipses-outline", label: "SMS", library: Ionicons, color: "#10b981" },
    { name: "instagram", label: "INSTAGRAM", library: FontAwesome, color: "#c13584" },
    { name: "logo-whatsapp", label: "WHATSAPP", library: Ionicons, color: "#25D366" },
    { name: "facebook-square", label: "FACEBOOK", library: FontAwesome, color: "#1877F2" },
    { name: "youtube-play", label: "YOUTUBE", library: FontAwesome, color: "#FF0000" },
    { name: "linkedin-square", label: "LINKEDIN", library: FontAwesome, color: "#0A66C2" },
    { name: "pinterest", label: "PINTEREST", library: FontAwesome, color: "#E60023" },
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
        contentContainerStyle={{
          paddingBottom: 100, // ✅ VERY IMPORTANT
        }}
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
          Create Campaign Post
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
  <View style={{ marginTop: 0, marginBottom: 5 }}>
    <CampaignPostForm
      platform={selected}
      campaignId={campaignId.toString()}
      onClose={() => setSelected(null)}
    />
  </View>
)}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
