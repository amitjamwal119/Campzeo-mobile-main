import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View,
} from "react-native";
import { Text, Button } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

interface CampaignFormProps {
  platform: string;
  onClose: (newPost?: any) => void; // <-- updated to pass post data back
}

export default function CampaignPostForm({ platform, onClose }: CampaignFormProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [postDate, setPostDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const showWhatsAppContent = platform === "Whatsapp";

  const handleCreate = () => {
    if (!subject || !postDate || !message) {
      Alert.alert("⚠️ Please fill in all fields.");
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      subject,
      message,
      postDate,
      platform,  // Save platform
    };

    Alert.alert(`✅ Campaign Created!\nPlatform: ${platform}\nPost Date: ${postDate}`);
    
    // Clear form
    setSubject("");
    setMessage("");
    setPostDate("");

    // Send back post to parent
    onClose(newPost);
  };

  const handleAIGenerateMessage = () => {
    if (!subject) {
      Alert.alert("Enter a subject first to generate with AI!");
      return;
    }
    setMessage(`Generated AI message for "${subject}" on ${platform}.`);
  };

  const handleAIGenerateImage = () => Alert.alert("AI Image generation not implemented yet.");
  const handleChooseFile = () => Alert.alert("📁 File picker", "File picker will be implemented here.");

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <fl contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1">

          {/* Subject */}
          <Text className="text-xl font-bold mb-2 text-black">Subject</Text>

          <View className="flex-row items-center mb-4">
            <TextInput
              placeholder="Enter subject title to generate with AI"
              value={subject}
              onChangeText={setSubject}
              className="flex-1 border border-gray-300 border-r-0 rounded-l-lg px-3 h-12 bg-white"
            />
            <TouchableOpacity
              onPress={handleAIGenerateMessage}
              style={{
                backgroundColor: "#3b82f6",
                height: 43,
                paddingHorizontal: 16,
                justifyContent: "center",
                alignItems: "center",
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>AI</Text>
            </TouchableOpacity>
          </View>

          {/* WhatsApp extra buttons */}
          {showWhatsAppContent && (
            <>
              <View className="flex-row mb-3">
                <Button
                  onPress={handleAIGenerateMessage}
                  style={{
                    flex: 1,
                    backgroundColor: "#3b82f6",
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                    Generate with AI
                  </Text>
                </Button>

                <Button
                  onPress={handleAIGenerateImage}
                  style={{
                    flex: 1,
                    backgroundColor: "#16a34a",
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                    Generate Image
                  </Text>
                </Button>
              </View>

              <Button
                onPress={handleChooseFile}
                className="rounded-lg mb-4"
                style={{
                  backgroundColor: "#aaaaaa",
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                  Choose File
                </Text>
              </Button>
            </>
          )}

          {/* Message */}
          <TextInput
            placeholder={`Enter your ${platform} content here...`}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            className="border border-gray-300 rounded-lg p-3 mb-4 min-h-[120px] bg-white text-black"
            style={{ textAlignVertical: 'top' }}
          />

          {/* Post Time */}
          <Text className="text-xl font-bold mb-2 text-black">Post Time</Text>

          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-3 bg-white flex-row justify-between items-center"
            >
              <Text>{postDate || "Select Date"}</Text>
              {postDate && (
                <TouchableOpacity onPress={() => setPostDate("")}>
                  <Ionicons name="close-circle" size={20} color="gray" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              onChange={(event, date) => {
                setShowPicker(false);
                if (date) {
                  setSelectedDate(date);
                  setPostDate(date.toLocaleDateString("en-GB"));
                }
              }}
            />
          )}

          {/* Submit Button */}
          <Button
            onPress={handleCreate}
            className="rounded-lg mb-8"
            style={{
              backgroundColor: "#d55b35",
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
              Create Campaign Post
            </Text>
          </Button>

        </View>
      </fl>
    </KeyboardAvoidingView>
  );
}
