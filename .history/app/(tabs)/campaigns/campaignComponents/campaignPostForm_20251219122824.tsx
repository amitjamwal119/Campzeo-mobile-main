import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View as RNView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Text, Button, View } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import {
  createPostForCampaignApi,
  generateAIMessageApi,
  generateAIImageApi,
} from "@/api/campaign/campaignApi";

// Define CampaignPostData type
interface CampaignPostData {
  subject: string;
  message: string;
  scheduledPostTime: string; // ISO format
  type: string;
  board?: string | null;
}

interface CampaignFormProps {
  platform: string;
  campaignId?: string;
  editPost?: any;
  onClose?: (newPost?: any) => void;
  onCreatedNavigate?: () => void;
}

export default function CampaignPostForm({
  platform,
  campaignId,
  onClose,
  onCreatedNavigate,
}: CampaignFormProps) {
  const { getToken } = useAuth();

  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [postDate, setPostDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<string>("");

  const [loadingAI, setLoadingAI] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");

  const showWhatsAppContent = platform === "WHATSAPP";
  const platformsWithFileOption = [
    "INSTAGRAM",
    "WHATSAPP",
    "FACEBOOK",
    "YOUTUBE",
    "LINKEDIN",
    "PINTEREST",
  ];
  const showFileButton = platformsWithFileOption.includes(platform);

  // ---------- HANDLE CREATE POST ----------
  const handleCreate = async () => {
    if (!subject || !message || !postDate) {
      Alert.alert("⚠️ Please fill in all fields.");
      return;
    }
    if (!campaignId) {
      Alert.alert("Campaign ID missing");
      return;
    }

    const newPostData: CampaignPostData = {
      subject,
      message,
      scheduledPostTime: postDate.toISOString(),
      type: platform,
    };
    if (platform === "PINTEREST") newPostData.board = selectedBoard || null;

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const createdPost = await createPostForCampaignApi(
        Number(campaignId),
        newPostData,
        token
      );

      onClose?.(createdPost);

      setSubject("");
      setMessage("");
      setPostDate(null);
      setGeneratedImage("");

      if (onCreatedNavigate) onCreatedNavigate();
      else router.back();
    } catch (error: any) {
      Alert.alert("Error creating post", error?.message || "Unknown error");
    }
  };

  // ---------- AI HANDLERS ----------
  const handleAIGenerateMessage = async () => {
    if (!message) {
      Alert.alert("Enter some text first to generate AI message!");
      return;
    }
    try {
      setLoadingAI(true);
      const token = await getToken();
      const aiMessage = (await generateAIMessageApi(message ||, platform, token)) || "";
      setMessage(aiMessage);
    } catch (err) {
      Alert.alert("AI Generation failed", "Please try again.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAIGenerateImage = async () => {
    if (!message) {
      Alert.alert("Enter some text first to generate AI image!");
      return;
    }
    try {
      setLoadingAI(true);
      const token = await getToken();
      const imageUrl = (await generateAIImageApi(message, platform, token)) || "";
      setGeneratedImage(imageUrl);
    } catch (err) {
      Alert.alert("AI Image generation failed", "Please try again.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleChooseFile = () =>
    Alert.alert("📁 File picker will be implemented here.");

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-gray-100 p-4">

          {/* Subject */}
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8, color: "black" }}>
            Subject
          </Text>
          <TextInput
            placeholder="Enter subject/title"
            value={subject}
            onChangeText={setSubject}
            className="border border-gray-300 rounded-full px-3 h-12 mb-4 bg-white"
          />

          {/* WhatsApp AI Options */}
          {showWhatsAppContent && (
            <>
              {/* AI Message Input */}
              <View className="flex-row items-center mb-4">
                <TextInput
                  placeholder="Enter message for AI"
                  value={message}
                  onChangeText={setMessage} // user can type
                  className="flex-1 border border-gray-300 border-r-0 rounded-l-full px-3 h-12 bg-white"
                />
                <TouchableOpacity
                  onPress={handleAIGenerateMessage} // generate AI message
                  style={{
                    backgroundColor: "#dc2626",
                    height: 43,
                    paddingHorizontal: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                  }}
                >
                  {loadingAI ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Ionicons name="sparkles" size={24} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>

              {/* AI Image Input */}
              <View className="flex-row items-center mb-4">
                <TextInput
                  placeholder="Enter prompt for AI Image"
                  value={generatedImage}
                  onChangeText={setGeneratedImage} // optional edit
                  className="flex-1 border border-gray-300 border-r-0 rounded-l-full px-3 h-12 bg-white"
                />
                <TouchableOpacity
                  onPress={handleAIGenerateImage} // generate AI image
                  style={{
                    backgroundColor: "#dc2626",
                    height: 43,
                    paddingHorizontal: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                  }}
                >
                  {loadingAI ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Ionicons name="sparkles" size={24} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>

              {generatedImage ? (
                <Image
                  source={{ uri: generatedImage }}
                  style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 12 }}
                  resizeMode="cover"
                />
              ) : null}
            </>
          )}

          {/* Pinterest Board Selection */}
          {platform === "PINTEREST" && (
            <RNView style={{ marginBottom: 15 }}>
              <RNView
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 50,
                  backgroundColor: "white",
                  height: 45,
                  justifyContent: "center",
                }}
              >
                <Picker
                  selectedValue={selectedBoard}
                  onValueChange={(value: string) => setSelectedBoard(value)}
                  style={{ height: 100, width: "100%" }}
                >
                  <Picker.Item label="Select Board" value="" />
                  <Picker.Item label="Travel Ideas" value="travel" />
                  <Picker.Item label="Fashion Trends" value="fashion" />
                  <Picker.Item label="Food Recipes" value="food" />
                  <Picker.Item label="Home Decor" value="decor" />
                  <Picker.Item label="Fitness & Health" value="fitness" />
                </Picker>
              </RNView>
            </RNView>
          )}

          {/* File Upload Button */}
          {showFileButton && (
            <Button
              onPress={handleChooseFile}
              className="rounded-lg mb-4"
              style={{ backgroundColor: "#aaaaaa", borderRadius: 50 }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                Choose File
              </Text>
            </Button>
          )}

          {/* Message Input */}
          <TextInput
            placeholder={`Enter your ${platform} content here...`}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            className="border border-gray-300 rounded-lg p-3 mb-4 min-h-[120px] bg-white text-black"
            style={{ textAlignVertical: "top" }}
          />

          {/* Post Time */}
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8, color: "black" }}>
            Post Time
          </Text>
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              className="flex-1 border border-gray-300 rounded-full px-3 py-3 bg-white flex-row justify-between items-center"
            >
              <Text>{postDate ? postDate.toLocaleString() : "Select Date & Time"}</Text>
              {postDate && (
                <TouchableOpacity onPress={() => setPostDate(null)}>
                  <Ionicons name="close-circle" size={20} color="gray" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          {showPicker && (
            <DateTimePicker
              value={postDate || new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, date) => {
                setShowPicker(false);
                if (date) {
                  setPostDate(date);
                  setShowTimePicker(true);
                }
              }}
            />
          )}

          {/* Time Picker */}
          {showTimePicker && (
            <DateTimePicker
              value={postDate || new Date()}
              mode="time"
              display="default"
              onChange={(event, time) => {
                setShowTimePicker(false);
                if (time && postDate) {
                  const finalDateTime = new Date(
                    postDate.getFullYear(),
                    postDate.getMonth(),
                    postDate.getDate(),
                    time.getHours(),
                    time.getMinutes()
                  );
                  setPostDate(finalDateTime);
                }
              }}
            />
          )}

          {/* Submit Button */}
          <Button
            onPress={handleCreate}
            className="rounded-full mb-8"
            style={{ backgroundColor: "#dc2626", borderRadius: 50 }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
              Create Campaign Post
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
