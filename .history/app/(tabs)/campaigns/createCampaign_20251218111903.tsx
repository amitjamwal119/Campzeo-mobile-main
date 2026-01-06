import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input, InputField, FormControl } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAuth } from "@clerk/clerk-expo";
import {
  createCampaignApi,
  updateCampaignApi,
  getCampaignByIdApi,
} from "@/api/campaign/campaignApi";

type CampaignFormValues = {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  contactIds: number[];
};

export default function CreateCampaign() {
  const navigation = useNavigation();
  const { getToken } = useAuth();

  const { id } = useLocalSearchParams<{ id?: string }>();
  const campaignId = id ? Number(id) : undefined;
  const isEditMode = !!campaignId;

  const [loadingCampaign, setLoadingCampaign] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startDateObj, setStartDateObj] = useState<Date | null>(null);

  const today = new Date();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormValues>({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      description: "",
      contactIds: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!isEditMode || !campaignId) return;

    const fetchCampaign = async () => {
      try {
        setLoadingCampaign(true);

        const token = await getToken();
        if (!token) throw new Error("Authentication token not found");

        const response = await getCampaignByIdApi(campaignId, token);

        // 🔴 FIX: unwrap backend response
        const campaign = response.campaign;

        // console.log("EDIT CAMPAIGN DATA 👉", campaign);

        reset({
          name: campaign.name ?? "",
          startDate: campaign.startDate
            ? campaign.startDate.split("T")[0]
            : "",
          endDate: campaign.endDate
            ? campaign.endDate.split("T")[0]
            : "",
          description: campaign.description ?? "",
          contactIds: campaign.contacts?.map((c: any) => c.id) ?? [],
        });

        // Required for end-date picker minDate
        if (campaign.startDate) {
          setStartDateObj(new Date(campaign.startDate));
        }
      } catch (error) {
        console.error("Fetch Campaign Error:", error);
        Alert.alert("Error", "Failed to load campaign data");
        router.back();
      } finally {
        setLoadingCampaign(false);
      }
    };

    fetchCampaign();
  }, [isEditMode, campaignId]);

  const onSubmit: SubmitHandler<CampaignFormValues> = async (data) => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found");

      if (isEditMode && campaignId) {
        await updateCampaignApi(campaignId, data, token);
      } else {
        await createCampaignApi(data, token);
      }

      router.back();
    } catch (error: any) {
      console.error("Campaign Submit Error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  const requiredLabel = (label: string) => (                        hh
    <Text className="text-base mt-3 font-semibold text-gray-700">
      {label} <Text className="text-red-500">*</Text>
    </Text>
  );

  // Show loader while fetching
  if (loadingCampaign) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        className="flex-1 px-6 py-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", right: 10, zIndex: 10, padding: 8 }}
        >
          <Ionicons name="close" size={24} color="#334155" />
        </TouchableOpacity>

        {/* Header */}
        <View className="flex-row items-center mb-6">
          <View className="w-14 h-14 rounded-xl bg-[#0284c7] items-center justify-center">
            <Ionicons name="megaphone" size={28} color="#fff" />
          </View>
          <View className="ml-4">
            <Text className="text-2xl font-bold text-gray-800">
              {isEditMode ? "Update Campaign" : "Create Campaign"}
            </Text>
            <Text className="text-sm text-gray-500">
              {isEditMode
                ? "Update campaign details"
                : "Add all campaign details"}
            </Text>
          </View>
        </View>

        {/* Form Fields */}
        <View className="space-y-6">
          {/* Name */}
          <FormControl isInvalid={!!errors.name}>
            <FormControl.Label>{requiredLabel("Name")}</FormControl.Label>
            <Controller
              control={control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field: { onChange, value } }) => (
                <Input className="border border-gray-300 rounded-xl">
                  <InputField
                    value={value}
                    placeholder="Enter Name"
                    onChangeText={onChange}
                  />
                </Input>
              )}
            />
          </FormControl>

          {/* Start Date */}
          <FormControl isInvalid={!!errors.startDate}>
            <FormControl.Label>{requiredLabel("Start Date")}</FormControl.Label>
            <Controller
              control={control}
              name="startDate"
              rules={{ required: "Start Date is required" }}
              render={({ field: { value } }) => (
                <>
                  <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                    <Input className="border border-gray-300 rounded-xl">
                      <InputField
                        value={value}
                        placeholder="YYYY-MM-DD"
                        editable={false}
                      />
                    </Input>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showStartPicker}
                    mode="date"
                    minimumDate={today}
                    onConfirm={(date) => {
                      setShowStartPicker(false);
                      setStartDateObj(date);
                      setValue("startDate", date.toISOString().split("T")[0]);
                      setValue("endDate", "");
                    }}
                    onCancel={() => setShowStartPicker(false)}
                  />
                </>
              )}
            />
          </FormControl>

          {/* End Date */}
          <FormControl isInvalid={!!errors.endDate}>
            <FormControl.Label>{requiredLabel("End Date")}</FormControl.Label>
            <Controller
              control={control}
              name="endDate"
              rules={{ required: "End Date is required" }}
              render={({ field: { value } }) => (
                <>
                  <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                    <Input className="border border-gray-300 rounded-xl">
                      <InputField
                        value={value}
                        placeholder="YYYY-MM-DD"
                        editable={false}
                      />
                    </Input>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showEndPicker}
                    mode="date"
                    minimumDate={startDateObj || today}
                    onConfirm={(date) => {
                      setShowEndPicker(false);
                      setValue("endDate", date.toISOString().split("T")[0]);
                    }}
                    onCancel={() => setShowEndPicker(false)}
                  />
                </>
              )}
            />
          </FormControl>

          {/* Description */}
          <FormControl isInvalid={!!errors.description}>
            <FormControl.Label>{requiredLabel("Description")}</FormControl.Label>
            <Controller
              control={control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  className="border border-gray-300 rounded-xl"
                  style={{ height: 90 }}
                >
                  <InputField
                    multiline
                    value={value}
                    placeholder="Enter Description"
                    onChangeText={onChange}
                    style={{ textAlignVertical: "top" }}
                  />
                </Input>
              )}
            />
          </FormControl>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSubmit(onSubmit)}
          className="w-full my-10 rounded-xl items-center justify-center py-4"
          style={{ backgroundColor: "#0284c7" }}
          disabled={isSubmitting || loadingCampaign}
        >
          <Text className="text-white font-semibold text-lg">
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Campaign"
                : "Create Campaign"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
