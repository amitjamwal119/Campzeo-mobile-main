import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { Text, Button, View } from "@gluestack-ui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import {
  createPostForCampaignApi,
  updatePostForCampaignApi,
  generateAIImageApi, // ✅ ADDED
} from "@/api/campaign/campaignApi";
import { Ionicons } from "@expo/vector-icons";

// ================= TYPES =================
interface CampaignPostData {
  senderEmail?: string;
  subject: string;
  message: string;
  scheduledPostTime: string;
  type: string;
  attachments?: { uri: string; name: string; type: string }[];
}

interface Attachment {
  uri: string;
  name: string;
  type: string;
}

// ================= COMPONENT =================
export default function CampaignPostForm({
  platform,
  campaignId,
  onClose,
  onCreatedNavigate,
  existingPost,
}: {
  platform: string;
  campaignId?: string;
  onClose?: (newPost?: any) => void;
  onCreatedNavigate?: () => void;
  existingPost?: any;
}) {
  const { getToken } = useAuth();

  const [senderEmail, setSenderEmail] = useState(existingPost?.senderEmail || "");
  const [subject, setSubject] = useState(existingPost?.subject || "");
  const [message, setMessage] = useState(existingPost?.message || "");
  const [postDate, setPostDate] = useState(
    existingPost?.scheduledPostTime
      ? new Date(existingPost.scheduledPostTime)
      : null
  );
  const [attachments, setAttachments] = useState<Attachment[]>(
    existingPost?.attachments || []
  );

  // ✅ AI IMAGE STATES (ADDED)
  const [imagePrompt, setImagePrompt] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // ================= AI IMAGE =================
  const handleGenerateAIImage = async () => {
    if (!imagePrompt.trim()) {
      Alert.alert("Enter image prompt");
      return;
    }

    setLoadingImage(true);
    try {
      const token = await getToken();
      const res = await generateAIImageApi({ prompt: imagePrompt }, token!);

      const imageUrl = res?.imageUrl || "https://picsum.photos/400";

      setAttachments((prev) => [
        ...prev,
        {
          uri: imageUrl,
          name: "ai-image.jpg",
          type: "image/jpeg",
        },
      ]);
    } catch (e: any) {
      Alert.alert("Image Error", e.message);
    } finally {
      setLoadingImage(false);
    }
  };

  // ================= HANDLE ATTACHMENTS =================
  const handleAddAttachment = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple: false,
    });

    if (result.canceled) return;

    const file = result.assets?.[0];
    if (!file) return;

    setAttachments((prev) => [
      ...prev,
      {
        uri: file.uri,
        name: file.name ?? "attachment",
        type: file.mimeType ?? "application/octet-stream",
      },
    ]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= CREATE OR EDIT POST =================
  const handleSubmit = async () => {
    if (!subject || !message || !postDate || (platform === "EMAIL" && !senderEmail)) {
      Alert.alert("⚠️ Please fill in all fields.");
      return;
    }

    if (!campaignId) {
      Alert.alert("Campaign ID missing");
      return;
    }

    const postData: CampaignPostData = {
      senderEmail: senderEmail || undefined,
      subject,
      message,
      scheduledPostTime: postDate.toISOString(),
      type: platform,
      attachments,
    };

    try {
      const token = await getToken();
      let response;

      if (existingPost?.id) {
        response = await updatePostForCampaignApi(
          Number(campaignId),
          Number(existingPost.id),
          postData,
          token
        );
      } else {
        response = await createPostForCampaignApi(
          Number(campaignId),
          postData,
          token
        );
      }

      onClose?.(response);
      onCreatedNavigate ? onCreatedNavigate() : router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-gray-100 p-4">

          {/* SUBJECT */}
          <TextInput
            placeholder="Enter subject/title"
            value={subject}
            onChangeText={setSubject}
            className="border border-gray-300 rounded-full px-3 h-12 mb-2 bg-white"
          />

          {/* ✅ AI IMAGE (AFTER SUBJECT) */}
          <TextInput
            placeholder="Describe image for AI"
            value={imagePrompt}
            onChangeText={setImagePrompt}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-2 bg-white"
          />

          <Button onPress={handleGenerateAIImage} disabled={loadingImage}>
            <Text>{loadingImage ? "Generating..." : "Generate Image (AI)"}</Text>
          </Button>

          {/* MESSAGE */}
          <TextInput
            placeholder={`Enter your ${platform} content here...`}
            value={message}
            onChangeText={setMessage}
            multiline
            className="border border-gray-300 rounded-lg p-3 mt-3 bg-white min-h-[120px]"
          />

          {/* ATTACHMENTS */}
          <FlatList
            data={attachments}
            horizontal
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item, index }) => (
              <View className="flex-row items-center mr-2 mt-3">
                {item.type.startsWith("image/") && (
                  <Image
                    source={{ uri: item.uri }}
                    style={{ width: 60, height: 60, borderRadius: 8 }}
                  />
                )}
                <TouchableOpacity onPress={() => handleRemoveAttachment(index)}>
                  <Ionicons name="close-circle" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
            ListHeaderComponent={
              <TouchableOpacity onPress={handleAddAttachment}>
                <Ionicons name="add-circle" size={40} color="#2563eb" />
              </TouchableOpacity>
            }
          />

          <Button onPress={handleSubmit} className="mt-6" bg="$red600">
            <Text color="white">
              {existingPost ? "Update Campaign Post" : "Create Campaign Post"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
