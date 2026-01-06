import React, { useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
  Image,
  View as RNView,
} from "react-native";
import { Text, Button, View } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import {
  createPostForCampaignApi,
  generateAIContentApi,
  generateAIImageApi,
  updateCampaignPostApi, // ✅ make sure this exists
} from "@/api/campaign/campaignApi";

export default function CampaignPostForm({
  platform,
  campaignId,
  postData,
  onClose,
  onCreatedNavigate,
}: {
  platform: string;
  campaignId?: string;
  postData?: any;
  onClose?: (newPost?: any) => void;
  onCreatedNavigate?: () => void;
}) {
  const { getToken } = useAuth();
  const isEditMode = !!postData;

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [postDate, setPostDate] = useState<Date | null>(null);

  /* 🔥 PREFILL WHEN EDIT */
  useEffect(() => {
    if (postData) {
      setSubject(postData.subject || "");
      setMessage(postData.message || "");
      setPostDate(new Date(postData.scheduledPostTime));
    }
  }, [postData]);

  const handleCreateOrUpdate = async () => {
    if (!subject || !message || !postDate) {
      Alert.alert("⚠️ Please fill in all fields.");
      return;
    }

    const payload = {
      subject,
      message,
      scheduledPostTime: postDate.toISOString(),
      type: platform,
    };

    try {
      const token = await getToken();
      if (!token) throw new Error("Token missing");

      let result;
      if (isEditMode) {
        result = await updateCampaignPostApi(
          Number(campaignId),
          postData.id,
          payload,
          token
        );
      } else {
        result = await createPostForCampaignApi(
          Number(campaignId),
          payload,
          token
        );
      }

      onClose?.(result);
      onCreatedNavigate ? onCreatedNavigate() : router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Something went wrong");
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView>
        <TextInput
          value={subject}
          onChangeText={setSubject}
          placeholder="Subject"
          className="border rounded-full px-3 h-12 mb-4 bg-white"
        />

        <TextInput
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder={`Enter ${platform} content`}
          className="border rounded-lg p-3 mb-4 min-h-[120px] bg-white"
        />

        <TouchableOpacity
          onPress={() => setPostDate(new Date())}
          className="border rounded-full px-3 py-3 bg-white mb-4"
        >
          <Text>
            {postDate ? postDate.toLocaleString() : "Select Date & Time"}
          </Text>
        </TouchableOpacity>

        <Button
          onPress={handleCreateOrUpdate}
          style={{ backgroundColor: "#dc2626", borderRadius: 50 }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {isEditMode ? "Update Campaign Post" : "Create Campaign Post"}
          </Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
