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
  senderEmail?: string; // new field for email
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

  // Form states
  const [senderEmail, setSenderEmail] = useState(existingPost?.senderEmail || ""); // new email state
  const [subject, setSubject] = useState(existingPost?.subject || "");
  const [message, setMessage] = useState(existingPost?.message || "");
  const [postDate, setPostDate] = useState(
    existingPost?.scheduledPostTime ? new Date(existingPost.scheduledPostTime) : null
  );
  const [selectedImage, setSelectedImage] = useState(existingPost?.image || null);

  // AI content states
  const [aiPrompt, setAiPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // AI image generation states
  const [imagePrompt, setImagePrompt] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  // Date picker states
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const showWhatsAppContent = platform === "WHATSAPP";

  // ================= SAFE IMAGE SELECTION =================
  useEffect(() => {
    if (generatedImages.length > 0 && !selectedImage) {
      setSelectedImage(generatedImages[0]);
    }
  }, [generatedImages]);

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
      senderEmail: senderEmail || undefined, // include email for EMAIL platform
      subject,
      message,
      scheduledPostTime: postDate.toISOString(),
      type: platform,
      image: selectedImage || undefined,
    };

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      let response;

      if (existingPost?.id) {
        // ✅ EDIT MODE → UPDATE
        response = await updatePostForCampaignApi(
          Number(campaignId),
          Number(existingPost.id),
          postData,
          token
        );
      } else {
        // ✅ CREATE MODE → CREATE
        response = await createPostForCampaignApi(
          Number(campaignId),
          postData,
          token
        );
      }

      onClose?.(response);

      // reset only when creating
      if (!existingPost) {
        setSenderEmail("");
        setSubject("");
        setMessage("");
        setAiPrompt("");
        setPostDate(null);
        setImagePrompt("");
        setGeneratedImages([]);
        setSelectedImage(null);
      }

      onCreatedNavigate ? onCreatedNavigate() : router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Something went wrong");
    }
  };

  // ================= AI CONTENT =================
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
      };

      const response = await generateAIContentApi(payload, token);

      if (!response?.variations || response.variations.length === 0) {
        throw new Error("No AI suggestions returned");
      }

      setAiResults(response.variations.map((v: any) => v.content));
      setModalVisible(true);
    } catch (error: any) {
      Alert.alert("AI Error", error?.message || "Failed to generate content");
    } finally {
      setLoadingAI(false);
    }
  };

  // ================= AI IMAGE GENERATION =================
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

      if (response.images && response.images.length > 0) {
        setGeneratedImages(response.images);
      } else if (response.imagePrompt) {
        setGeneratedImages([response.imagePrompt]);
      } else {
        throw new Error("No images returned");
      }
    } catch (error: any) {
      Alert.alert("Image Generation Error", error?.message || "Failed to generate image");
    } finally {
      setLoadingImage(false);
    }
  };

  // ================= UI =================
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-gray-100 p-0">

          {/* SENDER EMAIL (for EMAIL platform) */}
          {platform === "EMAIL" && (
            <>
              <Text className="mb-2 font-bold text-black ml-1">Sender Email</Text>
              <TextInput
                placeholder="Enter sender email"
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
            className="border border-gray-300 rounded-full px-3 h-12 mb-4 bg-white"
          />

          {/* AI CONTENT INPUT */}
          {showWhatsAppContent && (
            <View className="flex-row items-center mb-4">
              <TextInput
                value={aiPrompt}
                onChangeText={setAiPrompt}
                placeholder="e.g. add emoji, make promotional"
                className="flex-1 border border-gray-300 border-r-0 rounded-l-full px-3 h-12 bg-white"
              />
              <TouchableOpacity
                disabled={loadingAI}
                onPress={handleOpenAIContent}
                style={{
                  backgroundColor: loadingAI ? "#aaa" : "#dc2626",
                  height: 43,
                  paddingHorizontal: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopRightRadius: 25,
                  borderBottomRightRadius: 25,
                }}
              >
                <Ionicons
                  name="sparkles"
                  size={24}
                  color={loadingAI ? "#a67c00" : "#fff"}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* MESSAGE */}
          <Text className="mb-2 font-bold text-black ml-1">Message</Text>
          <TextInput
            placeholder={`Enter your ${platform} content here...`}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="border border-gray-300 rounded-lg p-3 mb-4 min-h-[120px] bg-white"
          />

          {/* IMAGE GENERATION INPUT */}
          {showWhatsAppContent && (
            <View className="flex-row items-center mb-4">
              <TextInput
                value={imagePrompt}
                onChangeText={setImagePrompt}
                placeholder="Enter prompt for image generation"
                className="flex-1 border border-gray-300 border-r-0 rounded-l-full px-3 h-12 bg-white"
              />
              <TouchableOpacity
                disabled={loadingImage}
                onPress={handleGenerateImage}
                style={{
                  backgroundColor: loadingImage ? "#aaa" : "#2563eb",
                  height: 43,
                  paddingHorizontal: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  borderTopRightRadius: 25,
                  borderBottomRightRadius: 25,
                }}
              >
                <Ionicons
                  name="image-outline"
                  size={24}
                  color={loadingImage ? "#fff" : "#fff"}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* GENERATED IMAGES WITH SELECTABLE TICK */}
          {generatedImages.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {generatedImages.map((img, index) => {
                const isSelected = selectedImage === img;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedImage(img)}
                    style={{ marginRight: 8 }}
                  >
                    <View>
                      <Image
                        source={{ uri: img }}
                        style={{ width: 100, height: 100, borderRadius: 12 }}
                        resizeMode="cover"
                      />
                      {isSelected && (
                        <View
                          style={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            backgroundColor: "#2563eb",
                            borderRadius: 12,
                            width: 24,
                            height: 24,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Ionicons name="checkmark" size={16} color="white" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* POST TIME */}
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

          {/* SUBMIT */}
          <Button
            onPress={handleSubmit}
            className="rounded-full mb-8"
            style={{ backgroundColor: "#dc2626", borderRadius: 50 }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {existingPost ? "Update Campaign Post" : "Create Campaign Post"}
            </Text>
          </Button>

          {/* AI CONTENT MODAL */}
          <Modal visible={modalVisible} animationType="slide" transparent>
            <View className="flex-1 justify-center bg-black/40 p-4">
              <View className="bg-white rounded-lg p-4" style={{ maxHeight: "60%" }}>
                <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12 }}>
                  Select AI Suggestion
                </Text>
                <FlatList
                  data={aiResults}
                  keyExtractor={(_, index) => index.toString()}
                  showsVerticalScrollIndicator
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setMessage(item);
                        setModalVisible(false);
                      }}
                      style={{
                        backgroundColor: "#f3f3f3",
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 8,
                      }}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <Button
                  onPress={() => setModalVisible(false)}
                  style={{ backgroundColor: "#dc2626", marginTop: 8 }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
                </Button>
              </View>
            </View>
          </Modal>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
