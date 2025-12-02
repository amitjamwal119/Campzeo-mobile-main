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
  onClose: () => void;
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
    Alert.alert(`✅ Campaign Created!\nPlatform: ${platform}\nPost Date: ${postDate}`);
    setSubject("");
    setMessage("");
    setPostDate("");
    onClose();
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-4">

          {/* Subject */}
          <Text className="text-xl font-bold mb-2 text-black">Subject</Text>

          <View className="flex-row items-center mb-4">
            <TextInput
              placeholder="Enter subject title to generate with AI"
              value={subject}
              onChangeText={setSubject}
              className="flex-1 border border-blue-600 border-r-0 rounded-l-lg px-3 h-12 bg-white"
            />

            <TouchableOpacity
              onPress={handleAIGenerateMessage}
              className="bg-green-600 h-12 px-4 rounded-r-lg justify-center items-center"
            >
              <Text className="text-white font-bold text-center">AI</Text>
            </TouchableOpacity>
          </View>

          {/* WhatsApp extra buttons */}
          {showWhatsAppContent && (
            <>
              <View className="flex-row mb-3 space-x-2">
                <Button className="flex-1 bg-green-600 py-3 rounded-lg" onPress={handleAIGenerateMessage}>
                  <Text className="text-white font-bold text-center">Generate with AI</Text>
                </Button>
                <Button className="flex-1 bg-red-600 py-3 rounded-lg" onPress={handleAIGenerateImage}>
                  <Text className="text-white font-bold text-center">Generate Image</Text>
                </Button>
              </View>

              <Button className="bg-purple-600 py-3 rounded-lg mb-4" onPress={handleChooseFile}>
                <Text className="text-white font-bold text-center">Choose File</Text>
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
          <Button className="bg-green-600 py-0 rounded-lg mb-8" onPress={handleCreate}>
            <Text className="text-white font-bold text-center">Create Campaign Post</Text>
          </Button>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
