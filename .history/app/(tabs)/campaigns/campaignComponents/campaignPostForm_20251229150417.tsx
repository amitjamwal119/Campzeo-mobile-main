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
  const [postDate, setPostDate] = useState(
    existingPost?.scheduledPostTime ? new Date(existingPost.scheduledPostTime) : null
  );

  // AI text states
  const [aiPrompt, setAiPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  // AI image states
  const [imagePrompt, setImagePrompt] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(existingPost?.image || undefined);
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
      image: selectedImage !== null ? selectedImage : undefined,
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

      if (!existingPost) {
        setSenderEmail("");
        setSubject("");
        setMessage("");
        setAiPrompt("");
        setPostDate(null);
        setImagePrompt("");
        setGeneratedImages([]);
        setSelectedImage(undefined);
      }

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

      setAiResults(response.variations.slice(0, 3).map((v: any) => v.content));
    } catch (error: any) {
      Alert.alert("AI Error", error?.message || "Failed to generate content");
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
    if (loadingImage) return;

    setLoadingImage(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const response = await generateAIImageApi({ prompt: imagePrompt }, token);

      console.log("AI Image API Response:", response);

      if (!response?.imagePrompt) {
        throw new Error("No image URL returned");
      }

      const encodedUrl = encodeURI(response.imagePrompt);

      setGeneratedImages([encodedUrl]);
      setSelectedImage(encodedUrl);
    } catch (error: any) {
      Alert.alert("Image Generation Error", error?.message || "Failed to generate image");
    } finally {
      setLoadingImage(false);
    }
  };

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

          {/* AI TEXT BUTTON */}
          {showWhatsAppContent && (
            <TouchableOpacity
              onPress={() => {
                setAiModalVisible(true);
                setAiResults([]);
              }}
              className="flex-row items-center bg-red-600 px-4 py-2 rounded-full mb-2"
            >
              <Ionicons name="sparkles" size={20} color="#fff" className="mr-2" />
              <Text className="text-white font-bold">Text Generate AI Assistant</Text>
            </TouchableOpacity>
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

          {/* AI IMAGE BUTTON */}
          {showWhatsAppContent && (
            <TouchableOpacity
              onPress={() => {
                setImagePrompt("");
                setImageModalVisible(true);
              }}
              className="flex-row items-center bg-blue-600 px-4 py-2 rounded-full mb-4"
            >
              <Ionicons name="sparkles" size={20} color="#fff" className="mr-2" />
              <Text className="text-white font-bold">Image Generate AI Assistant</Text>
            </TouchableOpacity>
          )}

          {/* AI TEXT MODAL */}
          <Modal visible={aiModalVisible} transparent animationType="slide">
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
              <View className="bg-white rounded-lg p-4 w-full max-h-[70%]">
                <View className="flex-row items-center mb-4">
                  <TextInput
                    value={aiPrompt}
                    onChangeText={setAiPrompt}
                    placeholder="e.g. add emoji, make promotional"
                    className="flex-1 border border-gray-300 border-r-0 rounded-l-full px-3 h-12 bg-white"
                  />
                  <TouchableOpacity
                    disabled={loadingAI}
                    onPress={handleGenerateAIText}
                    className={`h-12 px-4 justify-center items-center ${loadingAI ? "bg-gray-400" : "bg-red-600"} rounded-r-full`}
                  >
                    <Ionicons name="sparkles" size={24} color={loadingAI ? "#a67c00" : "#fff"} />
                  </TouchableOpacity>
                </View>

                {aiResults.length > 0 && (
                  <FlatList
                    data={aiResults}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setMessage(item);
                          setAiModalVisible(false);
                        }}
                        className="bg-gray-200 p-3 rounded mb-2"
                      >
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}

                <Button onPress={() => setAiModalVisible(false)} className="bg-gray-500 mt-2 rounded">
                  <Text className="text-white font-bold">Close</Text>
                </Button>
              </View>
            </View>
          </Modal>

          {/* AI IMAGE MODAL */}
          <Modal visible={imageModalVisible} transparent animationType="slide">
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
              <View className="bg-white rounded-lg p-4 w-full max-h-[70%]">
                <View className="flex-row items-center mb-4">
                  <TextInput
                    value={imagePrompt}
                    onChangeText={setImagePrompt}
                    placeholder="Enter prompt to generate image"
                    className="flex-1 border border-gray-300 border-r-0 rounded-l-full px-3 h-12 bg-white"
                  />
                  <TouchableOpacity
                    disabled={loadingImage}
                    onPress={handleGenerateImage}
                    className={`h-12 px-4 justify-center items-center ${loadingImage ? "bg-gray-400" : "bg-blue-600"} rounded-r-full`}
                  >
                    <Ionicons name="sparkles" size={24} color={loadingImage ? "#a67c00" : "#fff"} />
                  </TouchableOpacity>
                </View>

                {generatedImages.length > 0 && (
                  <FlatList
                    data={generatedImages}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => setSelectedImage(item)} className="mr-2 relative">
                        <Image source={{ uri: item }} className="w-24 h-24 rounded-lg" />
                        {selectedImage === item && (
                          <View className="absolute top-1 right-1 bg-blue-600 w-6 h-6 rounded-full justify-center items-center">
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          </View>
                        )}
                      </TouchableOpacity>
                    )}
                  />
                )}

                <Button onPress={() => setImageModalVisible(false)} className="bg-gray-500 mt-2 rounded">
                  <Text className="text-white font-bold">Close</Text>
                </Button>
              </View>
            </View>
          </Modal>

          {/* POST TIME & SUBMIT */}
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
            className="rounded-full mb-8 bg-red-600 py-3"
          >
            <Text className="text-white font-bold text-center">
              {existingPost ? "Update Campaign Post" : "Create Campaign Post"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
