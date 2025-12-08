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
import { Picker } from "@react-native-picker/picker";
 
interface CampaignFormProps {
  platform: string;
  onClose: (newPost?: any) => void;
}
 
export default function CampaignPostForm({ platform, onClose }: CampaignFormProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [postDate, setPostDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
 
  // Pinterest dropdown state
  const [selectedBoard, setSelectedBoard] = useState("");
 
  const showWhatsAppContent = platform === "Whatsapp";
 
  const platformsWithFileOption = [
    "Instagram",
    "Whatsapp",
    "Facebook",
    "YouTube",
    "LinkedIn",
    "Pinterest",
  ];
 
  const showFileButton = platformsWithFileOption.includes(platform);
 
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
      platform,
      board: selectedBoard || null,
    };
 
    Alert.alert(`✅ Campaign Created!\nPlatform: ${platform}\nPost Date: ${postDate}`);
 
    setSubject("");
    setMessage("");
    setPostDate("");
 
    onClose(newPost);
  };
 
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
    Alert.alert("📁 File picker", "File picker will be implemented here.");
 
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1">
 
          {/* Subject */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 8,
              color: "black",
            }}
          >
            Subject
          </Text>
 
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
            </>
          )}
 
          {/* -------- Pinterest ONLY: Board Dropdown -------- */}
          {platform === "Pinterest" && (
            <View style={{ marginBottom: 15 }}>
              {/* <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8, color: "black" }}>
              Select Board
              </Text> */}
 
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  backgroundColor: "white",
                  height: 45,
                  justifyContent: "center",
                }}
              >
                <Picker
                  selectedValue={selectedBoard}
                  onValueChange={(value: string) => setSelectedBoard(value)}
                  style={{
                    height: 100,
                    width: "100%",
                  }}
                >
                  <Picker.Item label="Select Board" value="" />
                  <Picker.Item label="Travel Ideas" value="travel" />
                  <Picker.Item label="Fashion Trends" value="fashion" />
                  <Picker.Item label="Food Recipes" value="food" />
                  <Picker.Item label="Home Decor" value="decor" />
                  <Picker.Item label="Fitness & Health" value="fitness" />
                </Picker>
              </View>
            </View>
          )}
 
          {/* Choose File button */}
          {showFileButton && (
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
            style={{
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 8,
              color: "black",
            }}
          >
            Post Time
          </Text>
 
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-3 bg-white flex-row justify-between items-center"
            >
              <Text>{postDate || "Select Date & Time"}</Text>
              {postDate && (
                <TouchableOpacity onPress={() => setPostDate("")}>
                  <Ionicons name="close-circle" size={20} color="gray" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
 
          {/* Date Picker */}
          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowPicker(false);
                if (date) {
                  setSelectedDate(date);
                  setShowTimePicker(true);
                }
              }}
            />
          )}
 
          {/* Time Picker */}
          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="default"
              onChange={(event, time) => {
                setShowTimePicker(false);
                if (time) {
                  const finalDateTime = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    time.getHours(),
                    time.getMinutes()
                  );
 
                  const formattedDateTime = `${finalDateTime.getFullYear()}-${(
                    finalDateTime.getMonth() + 1
                  )
                    .toString()
                    .padStart(2, "0")}-${finalDateTime
                      .getDate()
                      .toString()
                      .padStart(2, "0")}  (${finalDateTime
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${finalDateTime
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")})`;
 
                  setPostDate(formattedDateTime);
                }
              }}
            />
          )}
 
          {/* Submit */}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
 