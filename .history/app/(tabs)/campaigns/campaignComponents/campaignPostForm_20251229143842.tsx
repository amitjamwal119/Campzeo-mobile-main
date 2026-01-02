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
  View as RNView,
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
  senderEmail?: string;
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
  onClose?: (newPost?: any) => void;
  onCreatedNavigate?: () => void;
  existingPost?: any;
}) {
  const { getToken } = useAuth();

  const [senderEmail, setSenderEmail] = useState(existingPost?.senderEmail || "");
  const [subject, setSubject] = useState(existingPost?.subject || "");
  const [message, setMessage] = useState(existingPost?.message || "");
  const [postDate, setPostDate] = useState<Date | null>(
    existingPost?.scheduledPostTime
      ? new Date(existingPost.scheduledPostTime)
      : null
  );

  // AI text
  const [aiPrompt, setAiPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  // AI image
  const [imagePrompt, setImagePrompt] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    existingPost?.image ? encodeURI(existingPost.image) : undefined
  );
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // Date picker
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const showWhatsAppContent = platform === "WHATSAPP";

  // ================= EFFECT =================
  useEffect(() => {
    if (generatedImages.length > 0 && !selectedImage) {
      setSelectedImage(generatedImages[0]);
    }
  }, [generatedImages]);

  // ================= SUBMIT =================
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

  // ================= AI TEXT =================
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
          context: { platform, existingContent: message || "" },
          mode: "generate-multiple",
        },
        token
      );

      setAiResults(response?.variations?.slice(0, 3).map((v: any) => v.content) || []);
    } catch (e: any) {
      Alert.alert("AI Error", e.message);
    } finally {
      setLoadingAI(false);
    }
  };

  // ================= AI IMAGE =================
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      Alert.alert("Enter prompt to generate image");
      return;
    }

    setLoadingImage(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const response = await generateAIImageApi({ prompt: imagePrompt }, token);

      if (!response?.imagePrompt) {
        throw new Error("No image returned");
      }

      const encodedUrl = encodeURI(response.imagePrompt);
      setGeneratedImages([encodedUrl]);
      setSelectedImage(encodedUrl);
    } catch (e: any) {
      Alert.alert("Image Error", e.message);
    } finally {
      setLoadingImage(false);
    }
  };

  // ================= UI =================
  return (
    <KeyboardAvoidingView className="flex-1" behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-gray-100 p-4">

          {/* SUBJECT */}
          <Text className="font-bold mb-2">Subject</Text>
          <TextInput value={subject} onChangeText={setSubject} className="border rounded-full h-12 px-3 bg-white mb-4" />

          {/* MESSAGE */}
          <Text className="font-bold mb-2">Message</Text>
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
              resizeMode="cover"
              style={{
                width: 220,
                height: 220,
                marginTop: 16,
                borderRadius: 12,
                alignSelf: "center",
                backgroundColor: "#e5e7eb",
              }}
            />
          )}

          {/* IMAGE BUTTON */}
          {showWhatsAppContent && (
            <TouchableOpacity
              onPress={() => setImageModalVisible(true)}
              style={{
                backgroundColor: "#2563eb",
                padding: 12,
                borderRadius: 25,
                marginTop: 16,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={{ color: "#fff", marginLeft: 8 }}>Image Generate AI Assistant</Text>
            </TouchableOpacity>
          )}

          {/* IMAGE MODAL */}
          <Modal visible={imageModalVisible} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", padding: 20 }}>
              <View style={{ backgroundColor: "#fff", padding: 16, borderRadius: 12 }}>
                <TextInput
                  value={imagePrompt}
                  onChangeText={setImagePrompt}
                  placeholder="Describe image"
                  className="border rounded-full h-12 px-3 mb-4"
                />

                <Button onPress={handleGenerateImage}>
                  <Text style={{ color: "#fff" }}>Generate</Text>
                </Button>

                <FlatList
                  horizontal
                  data={generatedImages}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item }}
                      resizeMode="cover"
                      style={{ width: 100, height: 100, margin: 8, borderRadius: 8, backgroundColor: "#eee" }}
                    />
                  )}
                />

                <Button mt={4} onPress={() => setImageModalVisible(false)}>
                  <Text style={{ color: "#fff" }}>Close</Text>
                </Button>
              </View>
            </View>
          </Modal>

          <Button mt={6} onPress={handleSubmit}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {existingPost ? "Update Campaign Post" : "Create Campaign Post"}
            </Text>
          </Button>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
