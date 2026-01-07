import { Ionicons } from "@expo/vector-icons";
import { Button, Text } from "@gluestack-ui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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

  const showWhatsAppContent = platform === "Whatsapp";

  // Update postDate when selectedDate changes
  useEffect(() => {
    setPostDate(selectedDate.toLocaleDateString("en-GB"));
  }, [selectedDate]);

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
    };

    Alert.alert(`✅ Campaign Created!\nPlatform: ${platform}\nPost Date: ${postDate}`);

    // Clear form
    setSubject("");
    setMessage("");
    setPostDate("");
    setSelectedDate(new Date());

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

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false); // Close picker on Android
    }
    if (date) {
      setSelectedDate(date);
      setPostDate(date.toLocaleDateString("en-GB"));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <View style={{ flex: 1 }}>

          {/* Subject */}
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Subject</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <TextInput
              placeholder="Enter subject title to generate with AI"
              value={subject}
              onChangeText={setSubject}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRightWidth: 0,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                paddingHorizontal: 12,
                height: 44,
                backgroundColor: "#fff",
              }}
            />
            <TouchableOpacity
              onPress={handleAIGenerateMessage}
              style={{
                backgroundColor: "#3b82f6",
                height: 44,
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
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
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
                style={{ backgroundColor: "#aaaaaa", borderRadius: 8, marginBottom: 12 }}
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
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              minHeight: 120,
              backgroundColor: "#fff",
              textAlignVertical: "top",
            }}
          />

          {/* Post Time */}
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Post Time</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 12,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              <Text>{postDate || "Select Date"}</Text>
              {postDate ? (
                <TouchableOpacity onPress={() => setPostDate("")}>
                  <Ionicons name="close-circle" size={20} color="gray" />
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}

          {/* Submit Button */}
          <Button
            onPress={handleCreate}
            style={{
              backgroundColor: "#dc2626",
              borderRadius: 8,
              marginBottom: 24,
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
