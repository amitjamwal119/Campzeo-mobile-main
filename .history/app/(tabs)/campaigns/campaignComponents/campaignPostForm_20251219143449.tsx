import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View as RNView,
} from "react-native";
import { Text, Button, View } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
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
  editPost?: any;
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
  const [postDate, setPostDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("");

  const [aiResults, setAiResults] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

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
      ...(platform === "PINTEREST" && { board: selectedBoard || null }),
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
      setPostDate(null);
      setAiResults([]);

      onCreatedNavigate ? onCreatedNavigate() : router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Unknown error");
    }
  };

  // ================= AI MESSAGE GENERATION =================
  const handleAIGenerateMessage = async () => {
    if (!subject) {
      Alert.alert("Enter a subject first to generate AI content!");
      return;
    }

    // 🔒 Prevent multiple calls
    if (loadingAI) return;

    setLoadingAI(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const requestPayload = {
        prompt: subject,
        context: {
          platform,
          existingContent: message,
        },
        mode: "generate",
      };

      console.log("📤 AI REQUEST:", requestPayload);

      const response = await generateAIContentApi(requestPayload, token);

      console.log("🤖 AI FULL RESPONSE:", response);
      console.log("📝 AI MAIN CONTENT:", response?.content);
      console.log("🔁 AI VARIATIONS:", response?.variations);

      if (!response?.content) {
        throw new Error("Invalid AI response");
      }

      // ✅ SAFE handling of variations (NO crash)
      const suggestions = [
        response.content,
        ...(response.variations?.map(v => v.content) ?? []),
      ];

      setAiResults(suggestions);
    } catch (error: any) {
      console.error("AI generation error:", error);
      Alert.alert(
        "Error generating AI content",
        error?.message || "Unknown error"
      );
    } finally {
      // ✅ ALWAYS STOP LOADING
      setLoadingAI(false);
    }
  };

  const handleChooseFile = () =>
    Alert.alert("📁 File picker will be implemented here.");

  // ================= UI =================
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-gray-100 p-4">

          {/* SUBJECT */}
          <Text fontWeight="bold" mb={8}>Subject</Text>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Enter subject/title"
            className="border rounded-full px-3 h-12 mb-4 bg-white"
          />

          {/* AI SECTION (UNCHANGED LOGIC) */}
          {showWhatsAppContent && (
            <>
              <View className="flex-row mb-4">
                <TextInput
                  placeholder="Generate Message Using AI"
                  className="flex-1 border border-r-0 rounded-l-full px-3 h-12 bg-white"
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
                <Text style={{ marginBottom: 8 }}>
                  🤖 Generating suggestions...
                </Text>
              )}

              {aiResults.map((res, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setMessage(res)}
                  style={{
                    backgroundColor: "#f3f3f3",
                    padding: 10,
                    marginBottom: 6,
                    borderRadius: 8,
                  }}
                >
                  <Text>{res}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* MESSAGE */}
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            placeholder={`Enter your ${platform} content here...`}
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
