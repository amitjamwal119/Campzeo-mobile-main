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
  generateAIContentApi,   // 🔹 AI ADDITION
  generateAIImageApi,     // 🔹 AI ADDITION
} from "@/api/campaign/campaignApi";
import { Ionicons } from "@expo/vector-icons";

/* ================= TYPES ================= */

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

/* ================= COMPONENT ================= */

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

  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  /* ================= AI STATES (ADDED) ================= */

  const [loadingAIText, setLoadingAIText] = useState(false);
  const [loadingAIImage, setLoadingAIImage] = useState(false);

  /* ================= ATTACHMENTS ================= */

  const handleAddAttachment = async () => {
    try {
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
    } catch (error) {
      console.error("Document picker error:", error);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= AI TEXT (ADDED) ================= */

  const handleGenerateAIText = async () => {
    if (!subject) {
      Alert.alert("Enter subject first");
      return;
    }

    setLoadingAIText(true);
    try {
      const token = await getToken();
      const response = await generateAIContentApi(
        {
          prompt: subject,
          context: { platform },
          mode: "single",
        },
        token!
      );

      setMessage(response.content);
    } catch (e: any) {
      Alert.alert("AI Error", e.message);
    } finally {
      setLoadingAIText(false);
    }
  };

  /* ================= AI IMAGE (ADDED) ================= */

  const handleGenerateAIImage = async () => {
    if (!subject) {
      Alert.alert("Enter subject first");
      return;
    }

    setLoadingAIImage(true);
    try {
      const token = await getToken();
      const response = await generateAIImageApi(
        { prompt: subject },
        token!
      );

      const imageUrl =
        response.imagePrompt || "https://picsum.photos/300";

      setAttachments((prev) => [
        ...prev,
        {
          uri: imageUrl,
          name: "AI Image",
          type: "image/jpeg",
        },
      ]);
    } catch (e: any) {
      Alert.alert("Image Error", e.message);
    } finally {
      setLoadingAIImage(false);
    }
  };

  /* ================= SUBMIT ================= */

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
      if (!token) throw new Error("Authentication token missing");

      const response = existingPost?.id
        ? await updatePostForCampaignApi(
            Number(campaignId),
            Number(existingPost.id),
            postData,
            token
          )
        : await createPostForCampaignApi(Number(campaignId), postData, token);

      onClose?.(response);
      onCreatedNavigate ? onCreatedNavigate() : router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Something went wrong");
    }
  };

  /* ================= RENDER ================= */

  const renderAttachmentItem = ({ item, index }: { item: Attachment; index: number }) => (
    <View className="flex-row items-center bg-gray-200 rounded-lg px-2 py-1 mr-2 mb-2">
      {item.type.startsWith("image/") && (
        <Image
          source={{ uri: item.uri }}
          style={{ width: 50, height: 50, borderRadius: 5, marginRight: 5 }}
        />
      )}
      <Text numberOfLines={1} style={{ maxWidth: 80 }}>
        {item.name}
      </Text>
      <TouchableOpacity onPress={() => handleRemoveAttachment(index)}>
        <Ionicons name="close-circle" size={20} color="#dc2626" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View className="bg-gray-100 p-4">

          {platform === "EMAIL" && (
            <TextInput
              placeholder="Sender Email"
              value={senderEmail}
              onChangeText={setSenderEmail}
              className="border rounded-full p-3 mb-3 bg-white"
            />
          )}

          <TextInput
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
            className="border rounded-full p-3 mb-2 bg-white"
          />

          {/* 🔹 AI BUTTONS ADDED (NO UI REMOVED) */}
          <View className="flex-row mb-3">
            <Button onPress={handleGenerateAIText} mr="$2" isDisabled={loadingAIText}>
              <Text>AI Text</Text>
            </Button>
            <Button onPress={handleGenerateAIImage} isDisabled={loadingAIImage}>
              <Text>AI Image</Text>
            </Button>
          </View>

          <TextInput
            placeholder={`Enter your ${platform} content here...`}
            value={message}
            onChangeText={setMessage}
            multiline
            className="border rounded-lg p-3 mb-3 bg-white min-h-[120px]"
          />

          <FlatList
            data={attachments}
            horizontal
            keyExtractor={(_, index) => String(index)}
            renderItem={renderAttachmentItem}
            ListHeaderComponent={
              <TouchableOpacity
                onPress={handleAddAttachment}
                className="flex-row items-center justify-center bg-blue-100 rounded-lg px-4 py-2 mr-2"
              >
                <Ionicons name="add" size={24} color="#2563eb" />
              </TouchableOpacity>
            }
          />

          <Button onPress={handleSubmit} mt="$6" bg="$red600">
            <Text color="white">
              {existingPost ? "Update Campaign Post" : "Create Campaign Post"}
            </Text>
          </Button>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
