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
  const [postDate, setPostDate] = useState(
    existingPost?.scheduledPostTime
      ? new Date(existingPost.scheduledPostTime)
      : null
  );

  // AI TEXT
  const [aiPrompt, setAiPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  // AI IMAGE
  const [imagePrompt, setImagePrompt] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    existingPost?.image ? encodeURI(existingPost.image) : undefined
  );
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // DATE
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const showWhatsAppContent = platform === "WHATSAPP";

  // ================= IMAGE AUTO SELECT =================
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

      let response;
      if (existingPost?.id) {
        response = await updatePostForCampaignApi(
          Number(campaignId),
          Number(existingPost.id),
          postData,
          token
        );
      } else {
        response = await createPostForCampaignApi(Number(campaignId), postData, token);
      }

      onClose?.(response);
      onCreatedNavigate ? onCreatedNavigate() : router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Something went wrong");
    }
  };

  // ================= AI IMAGE =================
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

      const response = await generateAIImageApi({ prompt: imagePrompt }, token);

      if (!response?.imagePrompt) {
        throw new Error("Image generation failed");
      }

      const encoded = encodeURI(response.imagePrompt);
      setGeneratedImages([encoded]);
      setSelectedImage(encoded);
    } catch (error: any) {
      Alert.alert("Image Error", error?.message || "Failed to generate image");
    } finally {
      setLoadingImage(false);
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
          <Text className="mb-2 font-bold text-black">Subject</Text>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            className="border border-gray-300 rounded-full px-3 h-12 mb-4 bg-white"
          />

          {/* MESSAGE */}
          <Text className="mb-2 font-bold text-black">Message</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            className="border border-gray-300 rounded-lg p-3 mb-4 bg-white min-h-[120px]"
          />

          {/* IMAGE PREVIEW ✅ */}
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: 220,
                height: 220,
                borderRadius: 12,
                alignSelf: "center",
                marginBottom: 16,
                backgroundColor: "#eee",
              }}
              resizeMode="cover"
            />
          )}

          {/* IMAGE GENERATE BUTTON */}
          {showWhatsAppContent && (
            <TouchableOpacity
              onPress={() => setImageModalVisible(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#2563eb",
                padding: 12,
                borderRadius: 25,
                marginBottom: 16,
              }}
            >
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={{ color: "#fff", marginLeft: 8, fontWeight: "bold" }}>
                Generate AI Image
              </Text>
            </TouchableOpacity>
          )}

          {/* IMAGE MODAL */}
          <Modal visible={imageModalVisible} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", padding: 20 }}>
              <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
                <TextInput
                  value={imagePrompt}
                  onChangeText={setImagePrompt}
                  placeholder="Describe image..."
                  className="border border-gray-300 rounded-full px-3 h-12 mb-4"
                />

                <Button onPress={handleGenerateImage}>
                  <Text style={{ color: "#fff" }}>Generate</Text>
                </Button>

                <FlatList
                  horizontal
                  data={generatedImages}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedImage(item)}>
                      <Image
                        source={{ uri: item }}
                        style={{
                          width: 100,
                          height: 100,
                          marginRight: 8,
                          borderRadius: 8,
                          backgroundColor: "#eee",
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                />

                <Button onPress={() => setImageModalVisible(false)} mt={4}>
                  <Text style={{ color: "#fff" }}>Close</Text>
                </Button>
              </View>
            </View>
          </Modal>

          <Button onPress={handleSubmit} style={{ backgroundColor: "#dc2626" }}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {existingPost ? "Update Campaign Post" : "Create Campaign Post"}
            </Text>
          </Button>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
