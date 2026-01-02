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

  /* ================= FORM STATES ================= */
  const [senderEmail, setSenderEmail] = useState(existingPost?.senderEmail || "");
  const [subject, setSubject] = useState(existingPost?.subject || "");
  const [message, setMessage] = useState(existingPost?.message || "");
  const [postDate, setPostDate] = useState<Date | null>(
    existingPost?.scheduledPostTime
      ? new Date(existingPost.scheduledPostTime)
      : null
  );

  /* ================= AI TEXT ================= */
  const [aiPrompt, setAiPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  /* ================= AI IMAGE ================= */
  const [imagePrompt, setImagePrompt] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    existingPost?.image
  );
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  /* ================= DATE PICKER ================= */
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const showWhatsAppContent = platform === "WHATSAPP";

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (generatedImages.length > 0 && !selectedImage) {
      setSelectedImage(generatedImages[0]);
    }
  }, [generatedImages]);

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

    setLoadingAI(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const response = await generateAIContentApi(
        {
          prompt: aiPrompt,
          context: { platform, existingContent: message },
          mode: "generate-multiple",
        },
        token
      );

      if (!response?.variations?.length) {
        throw new Error("No AI suggestions returned");
      }

      setAiResults(response.variations.slice(0, 3).map((v: any) => v.content));
    } catch (e: any) {
      Alert.alert("AI Error", e.message);
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

    setLoadingImage(true);
    setImageError(false);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const response = await generateAIImageApi({ prompt: imagePrompt }, token);

      if (!response?.imagePrompt) {
        throw new Error("No image URL returned");
      }

      const url = encodeURI(response.imagePrompt) + `&ts=${Date.now()}`;
      setGeneratedImages([url]);
      setSelectedImage(url);
      setImageLoading(true);
    } catch (e: any) {
      Alert.alert("Image Error", e.message);
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

          {platform === "EMAIL" && (
            <>
              <Text className="font-bold mb-1">Sender Email</Text>
              <TextInput
                value={senderEmail}
                onChangeText={setSenderEmail}
                className="border rounded-full px-3 h-12 bg-white mb-4"
              />
            </>
          )}

          <Text className="font-bold mb-1">Subject</Text>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            className="border rounded-full px-3 h-12 bg-white mb-4"
          />

          {showWhatsAppContent && (
            <TouchableOpacity
              onPress={() => setAiModalVisible(true)}
              className="bg-red-600 rounded-full px-4 py-3 mb-3 flex-row items-center"
            >
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text className="text-white font-bold ml-2">Text Generate AI</Text>
            </TouchableOpacity>
          )}

          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            className="border rounded-lg p-3 bg-white min-h-[120px] mb-3"
          />

          {showWhatsAppContent && (
            <TouchableOpacity
              onPress={() => setImageModalVisible(true)}
              className="bg-blue-600 rounded-full px-4 py-3 mb-4 flex-row items-center"
            >
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text className="text-white font-bold ml-2">Image Generate AI</Text>
            </TouchableOpacity>
          )}

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-52 rounded-xl mb-3"
              resizeMode="cover"
              onLoadEnd={() => setImageLoading(false)}
              onError={() => setImageError(true)}
            />
          )}

          {imageLoading && <Text className="text-center text-gray-500">Loading image…</Text>}
          {imageError && <Text className="text-center text-red-500">Image server busy. Try again.</Text>}

          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="border rounded-full px-4 py-3 bg-white mb-4"
          >
            <Text>{postDate ? postDate.toLocaleString() : "Select Date & Time"}</Text>
          </TouchableOpacity>

          <Button onPress={handleSubmit} className="rounded-full bg-red-600">
            <Text className="text-white font-bold">
              {existingPost ? "Update Post" : "Create Post"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
