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

/* ================= TYPES ================= */
interface CampaignPostData {
  senderEmail?: string;
  subject: string;
  message: string;
  scheduledPostTime: string;
  type: string;
  image?: string;
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

  const [postDate, setPostDate] = useState<Date | undefined>(
    existingPost?.scheduledPostTime
      ? new Date(existingPost.scheduledPostTime)
      : undefined
  );

  /* ---------- AI TEXT ---------- */
  const [aiPrompt, setAiPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  /* ---------- AI IMAGE ---------- */
  const [imagePrompt, setImagePrompt] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    existingPost?.image || undefined
  );
  const [imageModalVisible, setImageModalVisible] = useState(false);

  /* ---------- DATE PICKERS ---------- */
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const showWhatsAppContent = platform === "WHATSAPP";

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (generatedImages.length > 0 && !selectedImage) {
      setSelectedImage(generatedImages[0]);
    }
  }, [generatedImages, selectedImage]);

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
      image: selectedImage,
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

      if (!existingPost) {
        setSenderEmail("");
        setSubject("");
        setMessage("");
        setAiPrompt("");
        setPostDate(undefined);
        setImagePrompt("");
        setGeneratedImages([]);
        setSelectedImage(undefined);
      }

      onCreatedNavigate ? onCreatedNavigate() : router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Something went wrong");
    }
  };

  /* ================= AI TEXT ================= */
  const handleGenerateAIText = async () => {
    if (!aiPrompt.trim()) {
      Alert.alert("Enter instruction like: add emoji, make promotional");
      return;
    }
    if (loadingAI) return;

    setLoadingAI(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const response = await generateAIContentApi(
        {
          prompt: aiPrompt,
          context: { platform, existingContent: message || "" },
          mode: "generate-multiple",
        },
        token
      );

      if (!response?.variations?.length) {
        throw new Error("No AI suggestions returned");
      }

      setAiResults(response.variations.slice(0, 3).map(v => v.content));
    } catch (error: any) {
      Alert.alert("AI Error", error?.message || "Failed to generate content");
    } finally {
      setLoadingAI(false);
    }
  };

  /* ================= AI IMAGE ================= */
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      Alert.alert("Enter prompt to generate image");
      return;
    }
    if (loadingImage) return;

    setLoadingImage(true);
    try {
      const token = await getToken();
      const response = await generateAIImageApi({ prompt: imagePrompt }, token);

      if (!response.success || !response.images?.length) {
        throw new Error(response.message || "No images returned");
      }

      setGeneratedImages(response.images);
      setSelectedImage(response.images[0]);
    } catch (error: any) {
      Alert.alert("Image Generation Error", error?.message || "Failed to generate image");
    } finally {
      setLoadingImage(false);
    }
  };

  /* ================= UI ================= */
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-gray-100 p-4">

          {/* SUBJECT */}
          <Text className="mb-2 font-bold">Subject</Text>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            className="border rounded-full px-3 h-12 bg-white mb-4"
          />

          {/* MESSAGE */}
          <Text className="mb-2 font-bold">Message</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            className="border rounded-lg p-3 bg-white min-h-[120px]"
          />

          {/* IMAGE PREVIEW */}
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", height: 200, marginTop: 12, borderRadius: 12 }}
            />
          )}

          {/* SUBMIT */}
          <Button
            onPress={handleSubmit}
            style={{ backgroundColor: "#dc2626", borderRadius: 50, marginTop: 20 }}
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
