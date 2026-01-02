import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";

export default function ImportContacts() {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const TEMPLATE_URL =
    "https://campzeo-v1-oym2.vercel.app/api/contacts/template";
  const IMPORT_URL =
    "https://campzeo-v1-oym2.vercel.app/contacts/import";

  // Step 1: Download CSV template
  const handleDownloadTemplate = async () => {
    try {
      setLoading(true);

      const fileUri = `${FileSystem.cacheDirectory}contacts_template.csv`;

      const downloadResumable = FileSystem.createDownloadResumable(
        TEMPLATE_URL,
        fileUri
      );

      const { uri } = await downloadResumable.downloadAsync();

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Downloaded", "Template downloaded successfully.");
      }
    } catch (e: any) {
      Alert.alert("Download Failed", e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Upload CSV file
  const handleUploadCSV = async () => {
    try {
      setLoading(true);

      const token = await getToken();
      if (!token) throw new Error("Token missing");

      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
      });

      if (result.type === "cancel") return;

      const { uri, name } = result;

      const formData = new FormData();
      formData.append("file", {
        uri,
        name,
        type: "text/csv",
      } as any);

      const response = await axios.post(IMPORT_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Contacts imported successfully!");
    } catch (e: any) {
      console.log(e);
      Alert.alert("Import Failed", e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4 bg-gray-100 justify-center items-center">
      {loading && <ActivityIndicator size="large" color="#2563eb" />}

      <Text className="text-xl font-bold mb-4">Import Contacts</Text>
      <Text className="mb-6 text-center">
        Upload a CSV file to bulk import contacts
      </Text>

      {/* Step 1: Download Template */}
      <View className="mb-8 w-full items-center">
        <Text className="text-lg font-semibold mb-2">Step 1: Download Template</Text>
        <Text className="text-center mb-3">
          Download our CSV template to ensure your data is formatted correctly
        </Text>
        <TouchableOpacity
          onPress={handleDownloadTemplate}
          className="px-6 py-3 bg-blue-600 rounded-full"
        >
          <Text className="text-white font-semibold">Download CSV Template</Text>
        </TouchableOpacity>
      </View>

      {/* Step 2: Upload CSV */}
      <View className="w-full items-center">
        <Text className="text-lg font-semibold mb-2">Step 2: Upload CSV File</Text>
        <Text className="text-center mb-3">
          Drag and drop your CSV file or click to browse
        </Text>
        <TouchableOpacity
          onPress={handleUploadCSV}
          className="w-64 h-32 border-2 border-dashed border-gray-400 rounded-lg justify-center items-center"
        >
          <Text className="text-gray-600 text-center">
            Drop your CSV file here{"\n"}or click to browse
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
