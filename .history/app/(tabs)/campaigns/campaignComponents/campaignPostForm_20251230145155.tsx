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

  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // ================= AI TEXT (placeholder) =================
  const handleGenerateAIText = () => {
    if (!subject.trim()) {
      Alert.alert("Enter subject first");
      return;
    }

    // Placeholder AI text (replace with real API later)
    const aiText = `✨ AI suggestion based on "${subject}"\n\n`;

    setMessage((prev) => aiText + prev);
  };

  // ================= HANDLE ATTACHMENTS =================
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

  // ================= RENDER ATTACHMENTS =================
  const renderAttachmentItem = ({ item, index }: { item: Attachment; index: number }) => (
    <View className="flex-row items-center bg-gray-200 rounded-lg px-2 py-1 mr-2 mb-2">
      {item.type.startsWith("image/") && (
        <Image
          source={{ uri: item.uri }}
          style={{ width: 50, height: 50, borderRadius: 5, marginRight: 5 }}
        />
      )}
      <Text className="mr-2 text-gray-700" numberOfLines={1} style={{ maxWidth: 80 }}>
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-gray-100 p-4">

          {/* SENDER EMAIL */}
          {platform === "EMAIL" && (
            <>
              <Text className="mb-2 font-bold text-black ml-1">Sender Email</Text>
              <TextInput
                placeholder="sender@eg.com"
                value={senderEmail}
                onChangeText={setSenderEmail}
                keyboardType="email-address"
                className="border border-gray-300 rounded-full px-3 h-12 mb-4 bg-white"
              />
            </>
          )}

          {/* SUBJECT */}
          <Text className="mb-2 font-bold text-black ml-1">Subject</Text>
          <TextInput
            placeholder="Enter subject/title"
            value={subject}
            onChangeText={setSubject}
            className="border border-gray-300 rounded-full px-3 h-12 mb-2 bg-white"
          />

          {/* AI BUTTON (NEW) */}
          <TouchableOpacity
            onPress={handleGenerateAIText}
            className="self-start bg-purple-600 px-4 py-2 rounded-full mb-4"
          >
            <Text className="text-white font-semibold">
              Generate Text (AI Assistant)
            </Text>
          </TouchableOpacity>

          {/* MESSAGE */}
          <Text className="mb-2 font-bold text-black ml-1">Message</Text>
          <TextInput
            placeholder={`Enter your ${platform} content here...`}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="border border-gray-300 rounded-lg p-3 mb-2 min-h-[120px] bg-white"
          />

          {/* ATTACHMENTS */}
          <Text className="mb-2 font-bold text-black ml-1">Attachments</Text>
          <FlatList
            data={attachments}
            horizontal
            keyExtractor={(_, index) => String(index)}
            renderItem={renderAttachmentItem}
            ListHeaderComponent={
              <TouchableOpacity
                onPress={handleAddAttachment}
                className="flex-row items-center justify-center bg-blue-100 rounded-lg px-4 py-2 mr-2 mb-2"
              >
                <Ionicons name="add" size={24} color="#2563eb" />
              </TouchableOpacity>
            }
          />

          {/* DATE & TIME */}
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="border border-gray-300 rounded-full px-3 py-3 bg-white mb-4"
          >
            <Text>{postDate ? postDate.toLocaleString() : "Select Date & Time"}</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={postDate || new Date()}
              mode="date"
              minimumDate={new Date()}
              onChange={(_, date) => {
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
              onChange={(_, time) => {
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

          <Button
            onPress={handleSubmit}
            className="rounded-full mb-8"
            style={{ backgroundColor: "#dc2626", borderRadius: 50 }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {existingPost ? "Update Campaign Post" : "Create Campaign Post"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
