import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 🔹 Replace with your real imports
import { getToken } from "@/utils/auth";
import { generateAITextApi, generateAIImageApi } from "@/api/ai";

const CampaignPostForm = () => {
  /** ---------------- STATES ---------------- */
  const [message, setMessage] = useState<string>("");

  // TEXT AI
  const [textModalVisible, setTextModalVisible] = useState(false);
  const [textPrompt, setTextPrompt] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingText, setLoadingText] = useState(false);

  // IMAGE AI
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | undefined>(
    undefined
  );
  const [loadingImage, setLoadingImage] = useState(false);

  /** ---------------- AI TEXT ---------------- */
  const handleGenerateAIText = async () => {
    if (!textPrompt.trim()) {
      Alert.alert("Enter text to generate");
      return;
    }

    setLoadingText(true);
    try {
      const token = await getToken();
      const res = await generateAITextApi(
        { prompt: textPrompt },
        token
      );

      // Expecting array of strings
      if (res?.suggestions?.length) {
        setAiSuggestions(res.suggestions);
      } else {
        Alert.alert("No suggestions generated");
      }
    } catch (err: any) {
      Alert.alert("AI Error", err?.message || "Failed to generate text");
    } finally {
      setLoadingText(false);
    }
  };

  /** ---------------- AI IMAGE ---------------- */
  const handleGenerateAIImage = async () => {
    if (!imagePrompt.trim()) {
      Alert.alert("Enter prompt to generate image");
      return;
    }
    if (loadingImage) return;

    setLoadingImage(true);
    try {
      const token = await getToken();
      const response = await generateAIImageApi(
        { prompt: imagePrompt },
        token
      );

      console.log("AI Image API Response:", response);

      // ✅ FIXED HERE
      if (response?.imagePrompt) {
        setGeneratedImageUrl(response.imagePrompt);
      } else {
        Alert.alert("No image returned", "Try refining your prompt");
      }
    } catch (error: any) {
      Alert.alert(
        "Image Generation Error",
        error?.message || "Failed to generate image"
      );
    } finally {
      setLoadingImage(false);
      setImageModalVisible(false);
    }
  };

  /** ---------------- UI ---------------- */
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* -------- AI TEXT BUTTON (BEFORE MESSAGE) -------- */}
      <TouchableOpacity
        onPress={() => setTextModalVisible(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#6C5CE7",
          padding: 12,
          borderRadius: 8,
          marginBottom: 8,
        }}
      >
        <Ionicons name="sparkles" size={20} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 8, fontWeight: "bold" }}>
          AI Assistant
        </Text>
      </TouchableOpacity>

      {/* -------- MESSAGE BOX -------- */}
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Write your WhatsApp message..."
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          minHeight: 120,
          textAlignVertical: "top",
        }}
      />

      {/* -------- AI IMAGE BUTTON (AFTER MESSAGE) -------- */}
      <TouchableOpacity
        onPress={() => setImageModalVisible(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#0984E3",
          padding: 12,
          borderRadius: 8,
          marginTop: 10,
        }}
      >
        <Ionicons name="sparkles" size={20} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 8, fontWeight: "bold" }}>
          Image Generate AI Assistant
        </Text>
      </TouchableOpacity>

      {/* -------- SHOW GENERATED IMAGE -------- */}
      {generatedImageUrl && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ marginBottom: 8, fontWeight: "bold" }}>
            Generated Image
          </Text>
          <Image
            source={{ uri: generatedImageUrl }}
            style={{
              width: "100%",
              height: 250,
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
        </View>
      )}

      {/* ================= TEXT AI MODAL ================= */}
      <Modal visible={textModalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 16,
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              Generate AI Text
            </Text>

            <TextInput
              value={textPrompt}
              onChangeText={setTextPrompt}
              placeholder="Enter prompt..."
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
              }}
            />

            <TouchableOpacity
              onPress={handleGenerateAIText}
              style={{
                backgroundColor: "#6C5CE7",
                padding: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              {loadingText ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff" }}>Generate</Text>
              )}
            </TouchableOpacity>

            {aiSuggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setMessage(item);
                  setTextModalVisible(false);
                }}
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  marginTop: 8,
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setTextModalVisible(false)}
              style={{ marginTop: 10, alignItems: "center" }}
            >
              <Text style={{ color: "red" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= IMAGE AI MODAL ================= */}
      <Modal visible={imageModalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 16,
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              Generate AI Image
            </Text>

            <View style={{ flexDirection: "row" }}>
              <TextInput
                value={imagePrompt}
                onChangeText={setImagePrompt}
                placeholder="Enter image prompt"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  padding: 10,
                }}
              />

              <TouchableOpacity
                onPress={handleGenerateAIImage}
                style={{
                  marginLeft: 8,
                  backgroundColor: "#0984E3",
                  padding: 12,
                  borderRadius: 8,
                  justifyContent: "center",
                }}
              >
                {loadingImage ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Ionicons name="image" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setImageModalVisible(false)}
              style={{ marginTop: 10, alignItems: "center" }}
            >
              <Text style={{ color: "red" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CampaignPostForm;
