import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Text, Button, View } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import {
  createPostForCampaignApi,
  updatePostForCampaignApi,
  generateAIContentApi,
  generateAIImageApi,
} from "@/api/campaign/campaignApi";

// ================= TYPES =================
interface CampaignPostData {
  subject: string;
  message: string;
  scheduledPostTime: string;
  type: string;
  image?: string;
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
  onClose?: (post?: any) => void;
  onCreatedNavigate?: () => void;
  existingPost?: any;
}) {
  const { getToken } = useAuth();

  // ================= FORM STATE =================
  const [subject, setSubject] = useState(existingPost?.subject || "");
  const [message, setMessage] = useState(existingPost?.message || "");
  const [postDate, setPostDate] = useState<Date | null>(
    existingPost?.scheduledPostTime
      ? new Date(existingPost.scheduledPostTime)
      : null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(
    existingPost?.image || null
  );

  // ================= AI STATES =================
  const [aiPrompt, setAiPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [imagePrompt, setImagePrompt] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  // ================= DATE PICKER =================
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const showWhatsAppContent = platform === "WHATSAPP";

  // ================= AUTO SELECT GENERATED IMAGE =================
  useEffect(() => {
    if (generatedImages.length > 0 && !selectedImage) {
      setSelectedImage(generatedImages[0]);
    }
  }, [generatedImages]);

  // ================= CREATE POST =================
  const handleCreate = async () => {
    if (!subject || !message || !postDate) {
      Alert.alert("⚠️ Please fill all fields");
      return;
    }
    if (!campaignId) {
      Alert.alert("Campaign ID missing");
      return;
    }

    const payload: CampaignPostData = {
      subject,
      message,
      scheduledPostTime: postDate.toISOString(),
      type: platform,
      image: selectedImage || undefined,
    };

    try {
      const token = await getToken();
      if (!token) throw new Error("Auth token missing");

      const createdPost = await createPostForCampaignApi(
        Number(campaignId),
        payload,
        token
      );

      onClose?.(createdPost);
      onCreatedNavigate ? onCreatedNavigate() : router.back();
    } catch (error: any) {
      Alert.alert("Create Error", error?.message || "Failed to create post");
    }
  };

  // ================= UPDATE POST (🔥 FIX) =================
  const handleUpdate = async () => {
    if (!subject || !message || !postDate) {
      Alert.alert("⚠️ Please fill all fields");
      return;
    }

    if (!campaignId || !existingPost?.id) {
      Alert.alert("Missing campaign or post ID");
      return;
    }

    const payload: CampaignPostData = {
      subject,
      message,
      scheduledPostTime: postDate.toISOString(),
      type: platform,
      image: selectedImage || undefined,
    };

    try {
      const token = await getToken();
      if (!token) throw new Error("Auth token missing");

      const updatedPost = await updatePostForCampaignApi(
        Number(campaignId),
        Number(existingPost.id),
        payload,
        token
      );

      // 🔥 Update SAME post in UI
      onClose?.(updatedPost);
      router.back();
    } catch (error: any) {
      Alert.alert("Update Error", error?.message || "Failed to update post");
    }
  };

  // ================= AI CONTENT =================
  const handleOpenAIContent = async () => {
    if (!aiPrompt.trim()) return Alert.alert("Enter AI instruction");

    setLoadingAI(true);
    try {
      const token = await getToken();
      const response = await generateAIContentApi(
        {
          prompt: aiPrompt,
          context: { platform, existingContent: message },
          mode: "generate-multiple",
          count: 5,
        },
        token!
      );

      setAiResults(response.variations.map((v: any) => v.content));
      setModalVisible(true);
    } catch (error: any) {
      Alert.alert("AI Error", error?.message);
    } finally {
      setLoadingAI(false);
    }
  };

  // ================= AI IMAGE =================
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return Alert.alert("Enter image prompt");

    setLoadingImage(true);
    try {
      const token = await getToken();
      const response = await generateAIImageApi(
        { prompt: imagePrompt, count: 5 },
        token!
      );

      setGeneratedImages(response.images || []);
    } catch (error: any) {
      Alert.alert("Image Error", error?.message);
    } finally {
      setLoadingImage(false);
    }
  };

  // ================= UI =================
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View className="bg-gray-100 p-4">

          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Subject"
            className="border rounded-full px-3 h-12 bg-white mb-4"
          />

          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Message"
            multiline
            className="border rounded-lg p-3 bg-white mb-4 min-h-[120px]"
          />

          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="border rounded-full px-3 py-3 bg-white mb-4"
          >
            <Text>
              {postDate ? postDate.toLocaleString() : "Select Date & Time"}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={postDate || new Date()}
              mode="date"
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

          {/* 🔥 SINGLE BUTTON — CREATE OR UPDATE */}
          <Button
            onPress={existingPost ? handleUpdate : handleCreate}
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
