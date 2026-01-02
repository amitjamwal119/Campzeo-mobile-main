import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
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
} from "@/api/campaign/campaignApi";

// ================= TYPES =================
interface CampaignPostData {
  subject: string;
  message: string;
  scheduledPostTime: string;
  type: string;
}

// ================= COMPONENT =================
export default function CampaignPostForm({
  platform,
  campaignId,
  onClose,
  onCreatedNavigate,
}: {
  platform: string;
  campaignId?: string;
  onClose?: (newPost?: any) => void;
  onCreatedNavigate?: () => void;
}) {
  const { getToken } = useAuth();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // AI states
  const [aiPrompt, setAiPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [postDate, setPostDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
      setPostDate(null);

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
        mode: "generate-multiple", // assume backend returns array
      };

      const response = await generateAIContentApi(payload, token);

      if (!response?.variations || response.variations.length === 0) {
        throw new Error("No AI suggestions returned");
      }

      // ✅ save suggestions and open modal
      setAiResults(response.variations.map((v: any) => v.content));
      setModalVisible(true);
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-gray-100 p-4">

          {/* SUBJECT */}
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8 }}>
            Subject
          </Text>
          <TextInput
            placeholder="Enter subject/title"
            value={subject}
            onChangeText={setSubject}
            className="border border-gray-300 rounded-full px-3 h-12 mb-4 bg-white"
          />

          {/* AI BUTTON */}
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
                <RNView>
                  <Ionicons name="sparkles" size={24} color="#fff" />
                </RNView>
              </TouchableOpacity>
            </View>
          )}

          {/* MESSAGE */}
          <TextInput
            placeholder={`Enter your ${platform} content here...`}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="border border-gray-300 rounded-lg p-3 mb-4 min-h-[120px] bg-white"
          />

          {/* POST TIME */}
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="border border-gray-300 rounded-full px-3 py-3 bg-white mb-4"
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
            className="rounded-full mb-8"
            style={{ backgroundColor: "#dc2626", borderRadius: 50 }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Create Campaign Post
            </Text>
          </Button>

          {/* MODAL FOR MULTIPLE AI RESULTS */}
          {/* MODAL FOR MULTIPLE AI RESULTS */}
<Modal visible={modalVisible} animationType="slide" transparent>
  <View className="flex-1 justify-center bg-black/40 p-4">
    <View
      className="bg-white rounded-lg p-4"
      style={{ maxHeight: "60%" }} // ✅ fixed height
    >
      <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12 }}>
        Select AI Suggestion
      </Text>

      <FlatList
        data={aiResults}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator
        style={{ marginBottom: 12 }}
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
