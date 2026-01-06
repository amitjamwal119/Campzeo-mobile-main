import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Text, Button, View } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import {
  createPostForCampaignApi,
  generateAIContentApi,
} from "@/api/campaign/campaignApi";

// ================= TYPES =================
interface CampaignPostData {
  subject: string;
  message: string;
  scheduledPostTime: string;
  type: string;
  board?: string | null;
}

interface CampaignFormProps {
  platform: string;
  campaignId?: string;
  onClose?: (newPost?: any) => void;
  onCreatedNavigate?: () => void;
}

// ================= COMPONENT =================
export default function CampaignPostForm({
  platform,
  campaignId,
  onClose,
  onCreatedNavigate,
}: CampaignFormProps) {
  const { getToken } = useAuth();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [aiPrompt, setAiPrompt] = useState(""); // ✅ AI instruction input
  const [aiResult, setAiResult] = useState(""); // ✅ single AI response

  const [postDate, setPostDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [loadingAI, setLoadingAI] = useState(false);

  const showWhatsAppContent = platform === "WHATSAPP";

  // ================= CREATE POST =================
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
      setAiPrompt("");
      setAiResult("");
      setPostDate(null);

      onCreatedNavigate ? onCreatedNavigate() : router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Something went wrong");
    }
  };

  // ================= AI GENERATION =================
  const handleAIGenerateMessage = async () => {
    if (!aiPrompt.trim()) {
      Alert.alert("Enter instruction like: add emoji, make promotional");
      return;
    }

    setLoadingAI(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const payload = {
        prompt: `Generate a ${platform} post. Instruction: ${aiPrompt}`,
        context: {
          platform,
          existingContent: message || "",
        },
        mode: "generate",
      };

      const response = await generateAIContentApi(payload, token);

      if (!response?.content) {
        throw new Error("Invalid AI response");
      }

      // ✅ ONE RESPONSE ONLY
      setAiResult(response.content);
      setMessage(response.content);
    } catch (error: any) {
      Alert.alert("AI Error", error?.message || "Failed to generate content");
    } finally {
      setLoadingAI(false);
    }
  };

  // ================= UI =================
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-gray-100 p-4">

          {/* SUBJECT */}
          <Text fontWeight="bold" mb={8}>Subject</Text>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Enter subject"
            className="border rounded-full px-3 h-12 mb-4 bg-white"
          />

          {/* AI SECTION */}
          {showWhatsAppContent && (
            <>
              <View className="flex-row mb-3">
                <TextInput
                  value={aiPrompt}
                  onChangeText={setAiPrompt}
                  placeholder="e.g. add emoji, make promotional"
                  className="flex-1 border rounded-l-full px-3 h-12 bg-white"
                />
                <TouchableOpacity
                  disabled={loadingAI}
                  onPress={handleAIGenerateMessage}
                  style={{
                    backgroundColor: loadingAI ? "#aaa" : "#dc2626",
                    paddingHorizontal: 16,
                    justifyContent: "center",
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                  }}
                >
                  <Ionicons name="sparkles" size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              {loadingAI && (
                <Text style={{ color: "#dc2626", marginBottom: 8 }}>
                  🤖 Generating WhatsApp content...
                </Text>
              )}

              {aiResult !== "" && (
                <TouchableOpacity
                  onPress={() => setMessage(aiResult)}
                  style={{
                    backgroundColor: "#f3f3f3",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                >
                  <Text>{aiResult}</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* MESSAGE */}
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            placeholder={`Enter ${platform} content`}
            className="border rounded-lg p-3 mb-4 bg-white min-h-[120px]"
          />

          {/* DATE */}
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
            onPress={handleCreate}
            style={{ backgroundColor: "#dc2626", borderRadius: 50 }}
          >
            <Text color="#fff" fontWeight="bold">
              Create Campaign Post
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
