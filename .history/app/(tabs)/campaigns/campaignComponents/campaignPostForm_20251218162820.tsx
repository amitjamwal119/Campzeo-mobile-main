import { createPostForCampaignApi } from "@/api/campaign/campaignApi";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Button, Text, View } from "@gluestack-ui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    View as RNView,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from "react-native";

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

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [postDate, setPostDate] = useState<Date | null>(null); // store as Date
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("");

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
      console.log("❌ Campaign ID missing — received:", campaignId);
      Alert.alert("Campaign ID missing");
      return;
    }

    // Base object
    const newPostData: CampaignPostData = {
      subject,
      message,
      scheduledPostTime: postDate.toISOString(), // ISO format
      type: platform,
    };

    // Only include "board" WHEN platform === Pinterest
    if (platform === "PINTEREST") {
      newPostData.board = selectedBoard || null;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const createdPost = await createPostForCampaignApi(
        Number(campaignId),
        newPostData,
        token
      );

      console.log("Post successfully created:", createdPost);

      onClose && onClose(createdPost);

      // Clear form
      setSubject("");
      setMessage("");
      setPostDate(null);

      if (onCreatedNavigate) {
        onCreatedNavigate();
      } else {
        router.back();
      }

      // Alert.alert("✅ Post created successfully!");
    } catch (error: any) {
      console.error("Error creating post:", error);
      Alert.alert("Error creating post", error?.message || "Unknown error");
    }
  };

  // ---------- AI MESSAGE/IMAGE ----------
  const handleAIGenerateMessage = () => {
    if (!subject) {
      Alert.alert("Enter a subject first to generate with AI!");
      return;
    }
    setMessage(`Generated AI message for "${subject}" on ${platform}.`);
  };

  const handleAIGenerateImage = () =>
    Alert.alert("AI Image generation not implemented yet.");
  const handleChooseFile = () =>
    Alert.alert("📁 File picker will be implemented here.");

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1  bg-gray-100">

          {/* Subject */}
          <Text
            style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8, color: "black" }}
          >
            Subject
          </Text>
          <TextInput
            placeholder="Enter subject/title"
            value={subject}
            onChangeText={setSubject}
            className="border border-gray-300 rounded-full px-3 h-12 mb-4 bg-white"
          />

          {/* Subtitle */}
          {/* <Text
  style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8, color: "black" }}
>
  Subtitle
</Text> */}
          <View className="flex-row items-center mb-4">
            <TextInput
              placeholder="Enter subtitle"
              // value={subtitle} // you need to create this state: const [subtitle, setSubtitle] = useState("")
              // onChangeText={setSubtitle}
              className="flex-1 border border-gray-300 border-r-0 rounded-l-full px-3 h-12 bg-white"
            />
            <TouchableOpacity
              onPress={handleAIGenerateMessage} // you can create a separate handler for subtitle if needed
              style={{
                backgroundColor: "#3b82f6",
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

          {/* Tags */}
          {/* <Text
  style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8, color: "black" }}
>
  Tags
</Text> */}
          <View className="flex-row items-center mb-4">
            <TextInput
              placeholder="Enter tags (comma separated)"
              // value={tags} // you need to create this state: const [tags, setTags] = useState("")
              // onChangeText={setTags}
              className="flex-1 border border-gray-300 border-r-0 rounded-l-full px-3 h-12 bg-white"
            />
            <TouchableOpacity
              onPress={handleAIGenerateMessage} // you can create a separate handler for tags if needed
              style={{
                backgroundColor: "#3b82f6",
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



          {/* WhatsApp extra buttons */}
          {showWhatsAppContent && (
            <RNView className="flex-row mb-3">
              <Button
                onPress={handleAIGenerateMessage}
                style={{ flex: 1, backgroundColor: "#3b82f6", borderRadius: 50, marginRight: 8 }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                  Generate with AI
                </Text>
              </Button>
              <Button
                onPress={handleAIGenerateImage}
                style={{ flex: 1, backgroundColor: "#16a34a", borderRadius: 50 }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                  Generate Image
                </Text>
              </Button>
            </RNView>
          )}

          {/* Pinterest board selection */}
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

          {/* Choose File button */}
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

          {/* Message */}
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
          <Text
            style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8, color: "black" }}
          >
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
              minimumDate={new Date()} // ✅ Disable past dates
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
                  setPostDate(finalDateTime); // store as Date
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
