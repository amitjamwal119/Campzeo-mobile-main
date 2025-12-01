// Vik new

import { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Campaign = {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
};

type RootStackParamList = {
  Campaigns: undefined;
  CreateCampaign: undefined;
};

type CreateCampaignScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateCampaign"
>;

export default function CreateCampaign({
  onCreate,
}: {
  onCreate?: (c: Campaign) => void;
}) {
  const navigation = useNavigation<CreateCampaignScreenProp>();

  const [form, setForm] = useState<Campaign>({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Campaign, string>>>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Partial<Record<keyof Campaign, string>> = {};

    if (!form.name.trim()) e.name = "Name is required";
    if (!form.startDate.trim()) e.startDate = "Start Date is required";
    if (!form.endDate.trim()) e.endDate = "End Date is required";
    if (!form.description.trim())
      e.description = "Description is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        "Campaign Created",
        `${form.name} has been added successfully`,
        [
          {
            text: "OK",
            onPress: () => {
              onCreate?.(form);
              setForm({
                name: "",
                startDate: "",
                endDate: "",
                description: "",
              });
              setErrors({});
              navigation.navigate("Campaigns");
            },
          },
        ],
        { cancelable: false }
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
      <ScrollView
        className="flex-1 px-6 py-8"
        keyboardShouldPersistTaps="handled"
      >

        {/* Top Right Close Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            // top: 10,
            right: 10,
            zIndex: 10,
            // backgroundColor: "#e2e8f0",
            padding: 8,
            // borderRadius: 30,
            // elevation: 4,
          }}
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
              Create Campaign
            </Text>
            <Text className="text-sm text-gray-500">
              Add all campaign details
            </Text>
          </View>
        </View>

        {/* Form Fields */}
        <View className="space-y-6">

          {/* Name */}
          <FormControl>
            <FormControl.Label>{requiredLabel("Name")}</FormControl.Label>
            <Input className="border border-gray-300 rounded-xl">
              <InputField
                placeholder="Enter Name"
                value={form.name}
                onChangeText={(text) =>
                  setForm({ ...form, name: text })
                }
              />
            </Input>
            {errors.name && (
              <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
            )}
          </FormControl>

          {/* Start Date */}
          <FormControl>
            <FormControl.Label>{requiredLabel("Start Date")}</FormControl.Label>
            <Input className="border border-gray-300 rounded-xl">
              <InputField
                placeholder="YYYY-MM-DD"
                value={form.startDate}
                onChangeText={(text) =>
                  setForm({ ...form, startDate: text })
                }
              />
            </Input>
            {errors.startDate && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.startDate}
              </Text>
            )}
          </FormControl>

          {/* End Date */}
          <FormControl>
            <FormControl.Label>{requiredLabel("End Date")}</FormControl.Label>
            <Input className="border border-gray-300 rounded-xl">
              <InputField
                placeholder="YYYY-MM-DD"
                value={form.endDate}
                onChangeText={(text) =>
                  setForm({ ...form, endDate: text })
                }
              />
            </Input>
            {errors.endDate && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.endDate}
              </Text>
            )}
          </FormControl>

          {/* Description */}
          <FormControl>
            <FormControl.Label>{requiredLabel("Description")}</FormControl.Label>

            <Input
              className="border border-gray-300 rounded-xl"
              style={{ height: 90 }}   
            >
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
              <Text className="text-red-500 text-xs mt-1">
                {errors.description}
              </Text>
            )}
          </FormControl>

        </View>

        {/* Create Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleCreate}
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
            {submitting ? "Creating..." : "Create Campaign"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
