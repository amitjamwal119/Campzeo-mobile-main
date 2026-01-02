import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View as RNView,
} from "react-native";
import { Text, Button, View } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { createPostForCampaignApi } from "@/api/campaign/campaignApi";

interface CampaignPostData {
  subject: string;
  message: string;
  scheduledPostTime: string;
  type: string;
  board?: string | null;
}

interface CampaignFormProps {
  platform: string;
  campaignId?: string;
  onClose?: (newPost?: any) => void;
  onCreatedNavigate?: () => void;
}

export default function CampaignPostForm({
  platform,
  campaignId,
  onClose,
  onCreatedNavigate,
}: CampaignFormProps) {
  const { getToken } = useAuth();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [postDate, setPostDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("");

  const showWhatsAppContent = platform === "WHATSAPP";

  const platformsWithFileOption = [
    "INSTAGRAM",
    "WHATSAPP",
    "FACEBOOK",
    "YOUTUBE",
    "LINKEDIN",
    "PINTEREST",
  ];

  const showFileButton = platformsWithFileOption.includes(platform);

  const handleCreate = async () => {
    if (!subject || !message || !postDate) {
      Alert.alert("⚠️ Please fill in all fields.");
      return;
    }

    if (!campaignId) {
      Alert.alert("Campaign ID missing");
      return;
    }

    const newPostData: CampaignPostData = {
      subject,
      message,
      scheduledPostTime: postDate.toISOString(),
      type: platform,
    };

    if (platform === "PINTEREST") {
      newPostData.board = selectedBoard || null;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const createdPost = await createPostForCampaignApi(
        Number(campaignId),
        newPostData,
        token
      );

      onClose && onClose(createdPost);
      setSubject("");
      setMessage("");
      setPostDate(null);

      onCreatedNavigate ? onCreatedNavigate() : router.back();

      Alert.alert("✅ Post created successfully!");
    } catch (error: any) {
      Alert.alert("Error creating post", error?.message || "Unknown error");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      style={{ flex: 1 }}
    >
      {/* 🔴 ScrollView KEPT — BUT SCROLL DISABLED */}
      <ScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 bg-gray-100">
          {/* SUBJECT */}
          <Text className="font-bold text-black mb-2">Subject</Text>

          <View className="flex-row items-center mb-4">
            <TextInput
              placeholder="Enter subject title"
              value={subject}
              onChangeText={setSubject}
              className="flex-1 border border-gray-300 rounded-l-full px-3 h-12 bg-white"
            />
            <TouchableOpacity
              onPress={() => Alert.alert("AI coming soon")}
              className="bg-blue-500 h-11 px-4 justify-center rounded-r-full"
            >
              <Ionicons name="sparkles" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* MESSAGE */}
          <TextInput
            placeholder={`Enter your ${platform} content...`}
            value={message}
            onChangeText={setMessage}
            multiline
            className="border border-gray-300 rounded-lg p-3 mb-4 min-h-[120px] bg-white text-black"
            style={{ textAlignVertical: "top" }}
          />

          {/* POST TIME */}
          <Text className="font-bold text-black mb-2">Post Time</Text>

          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="border border-gray-300 rounded-full px-4 py-3 bg-white mb-4 flex-row justify-between"
          >
            <Text>
              {postDate ? postDate.toLocaleString() : "Select Date & Time"}
            </Text>
            {postDate && (
              <Ionicons
                name="close-circle"
                size={20}
                color="gray"
                onPress={() => setPostDate(null)}
              />
            )}
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={postDate || new Date()}
              mode="date"
              minimumDate={new Date()}
              onChange={(e, date) => {
                setShowPicker(false);
                if (date) {
                  setPostDate(date);
                  setShowTimePicker(true);
                }
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={postDate || new Date()}
              mode="time"
              onChange={(e, time) => {
                setShowTimePicker(false);
                if (time && postDate) {
                  setPostDate(
                    new Date(
                      postDate.getFullYear(),
                      postDate.getMonth(),
                      postDate.getDate(),
                      time.getHours(),
                      time.getMinutes()
                    )
                  );
                }
              }}
            />
          )}

          {/* SUBMIT */}
          <Button
            onPress={handleCreate}
            className="rounded-full mt-6 mb-10"
            style={{ backgroundColor: "#d55b35" }}
          >
            <Text className="text-white font-bold text-center">
              Create Campaign Post
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
