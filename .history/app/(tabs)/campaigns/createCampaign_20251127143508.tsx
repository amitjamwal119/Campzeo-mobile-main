import { useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input, InputField, FormControl } from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Campaign = {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
};

type RootStackParamList = {
  Campaigns: undefined;
  CreateCampaign: { campaign?: Campaign };
};

type CreateCampaignScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateCampaign"
>;

export default function CreateCampaign({ onSave }: { onSave?: (c: Campaign) => void }) {
  const navigation = useNavigation<CreateCampaignScreenProp>();
  const route = useRoute();

  const editingCampaign = (route.params as any)?.campaign as Campaign | undefined;

  const [form, setForm] = useState<Campaign>({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    if (editingCampaign) {
      setForm(editingCampaign); // pre-fill form with card data
    }
  }, [editingCampaign]);

  const [errors, setErrors] = useState<Partial<Record<keyof Campaign, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Partial<Record<keyof Campaign, string>> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.startDate.trim()) e.startDate = "Start Date is required";
    if (!form.endDate.trim()) e.endDate = "End Date is required";
    if (!form.description.trim()) e.description = "Description is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        editingCampaign ? "Campaign Updated" : "Campaign Created",
        `"${form.name}" has been ${editingCampaign ? "updated" : "added"} successfully!`,
        [
          {
            text: "OK",
            onPress: () => {
              onSave?.(form);
              navigation.navigate("Campaigns");
            },
          },
        ]
      );
    }, 600);
  };

  const requiredLabel = (label: string) => (
    <Text className="text-sm font-semibold text-gray-700">
      {label} <Text className="text-red-500">*</Text>
    </Text>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-gray-50"
    >
      <ScrollView className="flex-1 px-6 py-8" keyboardShouldPersistTaps="handled">
        {/* Close Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", right: 10, zIndex: 10, padding: 8 }}
        >
          <Ionicons name="close" size={22} color="#334155" />
        </TouchableOpacity>

        {/* Header */}
        <View className="flex-row items-center mb-8">
          <View className="w-14 h-14 rounded-xl bg-[#0284c7] items-center justify-center">
            <Ionicons name="megaphone" size={28} color="#fff" />
          </View>
          <View className="ml-4">
            <Text className="text-2xl font-bold text-gray-800">
              {editingCampaign ? "Edit Campaign" : "Create Campaign"}
            </Text>
            <Text className="text-sm text-gray-500">
              {editingCampaign ? "Update your campaign details" : "Add all campaign details"}
            </Text>
          </View>
        </View>

        {/* Form Fields */}
        <View className="space-y-6">
          <FormControl>
            <FormControl.Label>{requiredLabel("Name")}</FormControl.Label>
            <Input className="border border-gray-300 rounded-xl">
              <InputField
                placeholder="Enter Name"
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
              />
            </Input>
            {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>}
          </FormControl>

          <FormControl>
            <FormControl.Label>{requiredLabel("Start Date")}</FormControl.Label>
            <Input className="border border-gray-300 rounded-xl">
              <InputField
                placeholder="YYYY-MM-DD"
                value={form.startDate}
                onChangeText={(text) => setForm({ ...form, startDate: text })}
              />
            </Input>
            {errors.startDate && (
              <Text className="text-red-500 text-xs mt-1">{errors.startDate}</Text>
            )}
          </FormControl>

          <FormControl>
            <FormControl.Label>{requiredLabel("End Date")}</FormControl.Label>
            <Input className="border border-gray-300 rounded-xl">
              <InputField
                placeholder="YYYY-MM-DD"
                value={form.endDate}
                onChangeText={(text) => setForm({ ...form, endDate: text })}
              />
            </Input>
            {errors.endDate && (
              <Text className="text-red-500 text-xs mt-1">{errors.endDate}</Text>
            )}
          </FormControl>

          <FormControl>
            <FormControl.Label>{requiredLabel("Description")}</FormControl.Label>
            <Input className="border border-gray-300 rounded-xl" style={{ height: 90 }}>
              <InputField
                placeholder="Enter Description"
                multiline
                numberOfLines={3}
                style={{ textAlignVertical: "top" }}
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
              />
            </Input>
            {errors.description && (
              <Text className="text-red-500 text-xs mt-1">{errors.description}</Text>
            )}
          </FormControl>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSave}
          className="w-full mt-10 rounded-xl items-center justify-center py-4"
          style={{
            backgroundColor: "#0284c7",
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text className="text-white font-semibold text-lg">
            {submitting ? "Saving..." : editingCampaign ? "Update Campaign" : "Create Campaign"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
