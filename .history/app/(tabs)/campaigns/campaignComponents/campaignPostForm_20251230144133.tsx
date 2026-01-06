import React, { useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import { Text, Button, View } from "@gluestack-ui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import {
  createPostForCampaignApi,
  updatePostForCampaignApi,
  generateAIContentApi,
  generateAIImageApi,
} from "@/api/campaign/campaignApi";
import { Ionicons } from "@expo/vector-icons";

/* ================= TYPES ================= */

interface Attachment {
  uri: string;
  name: string;
  type: string;
}

interface CampaignPostData {
  senderEmail?: string;
  subject: string;
  message: string;
  scheduledPostTime: string;
  type: string;
  attachments?: Attachment[];
  image?: string;
}

/* ================= COMPONENT ================= */

export default function CampaignPostForm({
  platform,
  campaignId,
  onClose,
  onCreatedNavigate,
  existingPost,
}: {
  platform: string;
  campaignId?: string;
  onClose?: (newPost?: any) => void;
  onCreatedNavigate?: () => void;
  existingPost?: any;
}) {
  const { getToken } = useAuth();

  /* ================= BASIC STATE ================= */

  const [senderEmail, setSenderEmail] = useState(existingPost?.senderEmail || "");
  const [subject, setSubject] = useState(existingPost?.subject || "");
  const [message, setMessage] = useState(existingPost?.message || "");
  const [postDate, setPostDate] = useState<Date | null>(
    existingPost?.scheduledPostTime
      ? new Date(existingPost.scheduledPostTime)
      : null
  );

  const [attachments, setAttachments] = useState<Attachment[]>(
    existingPost?.attachments || []
  );

  /* ================= DATE PICKER ================= */

  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  /* ================= AI TEXT ================= */

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  /* ================= AI IMAGE ================= */

  const [imagePrompt, setImagePrompt] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    existingPost?.image
  );
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const showWhatsAppContent = platform === "WHATSAPP";

  /* ================= ATTACHMENTS ================= */

  const handleAddAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: false,
      });

      if (result.canceled) return;

      const file = result.assets?.[0];
      if (!file) return;

      setAttachments((prev) => [
        ...prev,
        {
          uri: file.uri,
          name: file.name ?? "attachment",
          type: file.mimeType ?? "application/octet-stream",
        },
      ]);
    } catch (error) {
      console.error("Document picker error:", error);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= AI TEXT ================= */

  const handleGenerateAIText = async () => {
    if (!aiPrompt.trim()) return Alert.alert("Enter AI instruction");
    if (loadingAI) return;

    setLoadingAI(true);
    try {
      const token = await getToken();
      const response = await generateAIContentApi(
        {
          prompt: aiPrompt,
          context: { platform, existingContent: message },
          mode: "generate-multiple",
        },
        token!
      );

      setAiResults(
        response.variations.slice(0, 3).map((v: any) => v.content)
      );
    } catch (e: any) {
      Alert.alert("AI Error", e.message);
    } finally {
      setLoadingAI(false);
    }
  };

  /* ================= AI IMAGE ================= */

  const handleGenerateAIImage = async () => {
    if (!imagePrompt.trim()) return Alert.alert("Enter image prompt");
    if (loadingImage) return;

    setLoadingImage(true);
    try {
      const token = await getToken();
      const response = await generateAIImageApi(
        { prompt: imagePrompt },
        token!
      );

      const imageUrl =
        response.imagePrompt || "https://picsum.photos/400";

      setGeneratedImages([imageUrl]);
      setSelectedImage(imageUrl);
    } catch (e: any) {
      Alert.alert("Image Error", e.message);
    } finally {
      setLoadingImage(false);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!subject || !message || !postDate || (platform === "EMAIL" && !senderEmail)) {
      Alert.alert("⚠️ Please fill all required fields");
      return;
    }

    if (!campaignId) {
      Alert.alert("Campaign ID missing");
      return;
    }

    const postData: CampaignPostData = {
      senderEmail: senderEmail || undefined,
      subject,
      message,
      scheduledPostTime: postDate.toISOString(),
      type: platform,
      attachments,
      image: selectedImage,
    };

    try {
      const token = await getToken();
      if (!token) throw new Error("Auth token missing");

      const response = existingPost?.id
        ? await updatePostForCampaignApi(
            Number(campaignId),
            Number(existingPost.id),
            postData,
            token
          )
        : await createPostForCampaignApi(Number(campaignId), postData, token);

      onClose?.(response);
      onCreatedNavigate ? onCreatedNavigate() : router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  /* ================= RENDER ATTACHMENT ================= */

  const renderAttachmentItem = ({ item, index }: { item: Attachment; index: number }) => (
    <View className="flex-row items-center bg-gray-200 rounded-lg px-2 py-1 mr-2 mb-2">
      {item.type.startsWith("image/") && (
        <Image
          source={{ uri: item.uri }}
          style={{ width: 40, height: 40, borderRadius: 6, marginRight: 6 }}
        />
      )}
      <Text numberOfLines={1} style={{ maxWidth: 80 }}>
        {item.name}
      </Text>
      <TouchableOpacity onPress={() => handleRemoveAttachment(index)}>
        <Ionicons name="close-circle" size={20} color="#dc2626" />
      </TouchableOpacity>
    </View>
  );

  /* ================= UI ================= */

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View className="bg-gray-100 p-4">

          {platform === "EMAIL" && (
            <TextInput
              placeholder="Sender Email"
              value={senderEmail}
              onChangeText={setSenderEmail}
              className="border rounded-full p-3 mb-3 bg-white"
            />
          )}

          <TextInput
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
            className="border rounded-full p-3 mb-3 bg-white"
          />

          <TextInput
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            multiline
            className="border rounded-lg p-3 mb-3 bg-white min-h-[120px]"
          />

          {showWhatsAppContent && (
            <>
              <Button onPress={() => setAiModalVisible(true)}>
                <Text>Generate Text (AI)</Text>
              </Button>

              <Button mt="$2" onPress={() => setImageModalVisible(true)}>
                <Text>Generate Image (AI)</Text>
              </Button>
            </>
          )}

          {/* Attachments */}
          <Text className="mt-4 mb-2 font-bold">Attachments</Text>
          <FlatList
            data={attachments}
            horizontal
            keyExtractor={(_, i) => String(i)}
            renderItem={renderAttachmentItem}
            ListHeaderComponent={
              <TouchableOpacity onPress={handleAddAttachment}>
                <Ionicons name="add-circle" size={36} color="#2563eb" />
              </TouchableOpacity>
            }
          />

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", height: 200, borderRadius: 12, marginTop: 12 }}
            />
          )}

          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="border rounded-full p-3 bg-white mt-4"
          >
            <Text>{postDate ? postDate.toLocaleString() : "Select Date & Time"}</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={postDate || new Date()}
              mode="date"
              onChange={(_, d) => {
                setShowPicker(false);
                if (d) {
                  setPostDate(d);
                  setShowTimePicker(true);
                }
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={postDate || new Date()}
              mode="time"
              onChange={(_, t) => {
                setShowTimePicker(false);
                if (t && postDate) {
                  setPostDate(
                    new Date(
                      postDate.getFullYear(),
                      postDate.getMonth(),
                      postDate.getDate(),
                      t.getHours(),
                      t.getMinutes()
                    )
                  );
                }
              }}
            />
          )}

          <Button onPress={handleSubmit} mt="$6" bg="$red600">
            <Text color="white">
              {existingPost ? "Update Campaign Post" : "Create Campaign Post"}
            </Text>
          </Button>

        </View>
      </ScrollView>

      {/* AI TEXT MODAL */}
      <Modal visible={aiModalVisible} animationType="slide">
        <View className="p-4 flex-1">
          <TextInput
            placeholder="Describe what you want to generate"
            value={aiPrompt}
            onChangeText={setAiPrompt}
            className="border p-3 mb-3 rounded-lg"
          />
          <Button onPress={handleGenerateAIText}>
            <Text>Generate</Text>
          </Button>

          {aiResults.map((r, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setMessage(r);
                setAiModalVisible(false);
              }}
            >
              <Text className="mt-3">{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {/* AI IMAGE MODAL */}
      <Modal visible={imageModalVisible} animationType="slide">
        <View className="p-4 flex-1">
          <TextInput
            placeholder="Describe image"
            value={imagePrompt}
            onChangeText={setImagePrompt}
            className="border p-3 mb-3 rounded-lg"
          />
          <Button onPress={handleGenerateAIImage}>
            <Text>Generate Image</Text>
          </Button>

          {generatedImages.map((img, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setSelectedImage(img);
                setImageModalVisible(false);
              }}
            >
              <Image
                source={{ uri: img }}
                style={{ width: "100%", height: 200, marginTop: 12 }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
