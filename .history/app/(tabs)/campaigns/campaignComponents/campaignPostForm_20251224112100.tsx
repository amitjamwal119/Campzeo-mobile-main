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
} from "@/api/campaign/campaignApi";

// ================= TYPES =================
interface CampaignPostData {
  subject: string;
  message: string;
  scheduledPostTime: string;
  type: string;
  image?: string | null;
}

// ================= COMPONENT =================
export default function CampaignPostForm({
  platform,
  campaignId,
  postId, // ✅ NEW
  onClose,
  onCreatedNavigate,
}: {
  platform: string;
  campaignId?: string;
  postId?: string; // ✅ NEW
  onClose?: (newPost?: any) => void;
  onCreatedNavigate?: () => void;
}) {
  const { getToken } = useAuth();
  const isEditMode = !!postId; // ✅ FLAG

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // AI states
  const [aiPrompt, setAiPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // IMAGE GENERATION states
  const [imagePrompt, setImagePrompt] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [postDate, setPostDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const showWhatsAppContent = platform === "WHATSAPP";

  // ================= FETCH POST FOR EDIT =================
  useEffect(() => {
    if (!isEditMode || !campaignId || !postId) return;

    const fetchPost = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(
          `https://campzeo-v1-oym2.vercel.app/api/campaigns/${campaignId}/posts/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        setSubject(data.subject || "");
        setMessage(data.message || "");
        setPostDate(
          data.scheduledPostTime ? new Date(data.scheduledPostTime) : null
        );
        setSelectedImage(data.image || null);
      } catch (e) {
        console.log("Edit fetch error:", e);
      }
    };

    fetchPost();
  }, [isEditMode, campaignId, postId]);

  // ================= CREATE / UPDATE =================
  const handleSubmit = async () => {
    if (!subject || !message || !postDate) {
      Alert.alert("⚠️ Please fill in all fields.");
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
      image: selectedImage,
    };

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      let result;

      if (isEditMode) {
        // 🔁 UPDATE
        const res = await fetch(
          `https://campzeo-v1-oym2.vercel.app/api/campaigns/${campaignId}/posts/${postId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
        result = await res.json();
      } else {
        // ➕ CREATE
        result = await createPostForCampaignApi(
          Number(campaignId),
          payload,
          token
        );
      }

      onClose?.(result);
      onCreatedNavigate ? onCreatedNavigate() : router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Something went wrong");
    }
  };

  // ================= AI GENERATION =================
  const handleOpenAIContent = async () => {
    if (!aiPrompt.trim()) {
      Alert.alert("Enter instruction like: add emoji, make promotional");
      return;
    }

    if (loadingAI) return;
    setLoadingAI(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const payload = {
        prompt: aiPrompt,
        context: { platform, existingContent: message || "" },
        mode: "generate-multiple",
        count: 5,
      };

      const response = await generateAIContentApi(payload, token);

      setAiResults(response.variations.map((v: any) => v.content));
      setModalVisible(true);
    } catch (error: any) {
      Alert.alert("AI Error", error?.message || "Failed to generate content");
    } finally {
      setLoadingAI(false);
    }
  };

  // ================= IMAGE GENERATION =================
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      Alert.alert("Enter prompt to generate image");
      return;
    }

    if (loadingImage) return;
    setLoadingImage(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const response = await generateAIImageApi(
        { prompt: imagePrompt, count: 5 },
        token
      );

      if (response.images?.length) setGeneratedImages(response.images);
    } catch (error: any) {
      Alert.alert("Image Error", error?.message || "Failed to generate image");
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-gray-100 p-0">

          {/* SUBJECT */}
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8 }}>
            Subject
          </Text>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            className="border border-gray-300 rounded-full px-3 h-12 mb-4 bg-white"
          />

          {/* AI CONTENT */}
          {showWhatsAppContent && (
            <View className="flex-row items-center mb-4">
              <TextInput
                value={aiPrompt}
                onChangeText={setAiPrompt}
                className="flex-1 border border-gray-300 rounded-l-full px-3 h-12 bg-white"
              />
              <TouchableOpacity onPress={handleOpenAIContent}>
                <Ionicons name="sparkles" size={24} color="#dc2626" />
              </TouchableOpacity>
            </View>
          )}

          {/* MESSAGE */}
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
          />

          {/* SUBMIT */}
          <Button onPress={handleSubmit} style={{ backgroundColor: "#dc2626" }}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {isEditMode ? "Update Campaign Post" : "Create Campaign Post"}
            </Text>
          </Button>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
