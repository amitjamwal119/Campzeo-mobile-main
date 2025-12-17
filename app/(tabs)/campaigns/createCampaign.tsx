import React, { useState, useEffect } from "react"; // ✅ Added useEffect
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
import { useForm, Controller } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useLocalSearchParams, router } from "expo-router"; // ✅ Added useLocalSearchParams
 
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
 
  const { campaign: campaignStr } = useLocalSearchParams(); // ✅ Added: fetch campaign data from params
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null); // ✅ Added state for edit
 
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startDateObj, setStartDateObj] = useState<Date | null>(null);
 
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Campaign>({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      description: "",
    },
    mode: "onChange",
  });
 
  const today = new Date();
 
  // ✅ Prefill form when editing
  useEffect(() => {
    if (campaignStr) {
      const campaignData: Campaign = JSON.parse(campaignStr as string);
      setEditingCampaign(campaignData);
 
      // Set form values
      setValue("name", campaignData.name);
      setValue("startDate", campaignData.startDate);
      setValue("endDate", campaignData.endDate);
      setValue("description", campaignData.description);
 
      // Set startDateObj for date picker minimum date
      if (campaignData.startDate) {
        setStartDateObj(new Date(campaignData.startDate));
      }
    }
  }, [campaignStr, setValue]);
 
  const onSubmit = (data: Campaign) => {
    Alert.alert(
      editingCampaign ? "Campaign Updated" : "Campaign Created", // ✅ Changed title dynamically
      `${data.name} has been ${editingCampaign ? "updated" : "added"} successfully`, // ✅ Changed message
      [
        {
          text: "OK",
          onPress: () => {
            onCreate?.(data);
            reset();
            setStartDateObj(null);
            router.back();
          },
        },
      ],
      { cancelable: false }
    );
  };
 
  const requiredLabel = (label: string) => (
    <Text className="text-base mt-3 font-semibold text-gray-700">
      {label} <Text className="text-red-500">*</Text>
    </Text>
  );
 
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
              {editingCampaign ? "Edit Campaign" : "Create Campaign"} {/* ✅ Dynamic header */}
            </Text>
            <Text className="text-sm text-gray-500">
              Add all campaign details
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
              rules={{
                required: "Name is required",
                minLength: { value: 3, message: "Minimum 3 letters" },
                pattern: { value: /^[A-Za-z\s]+$/i, message: "Only letters allowed" },
              }}
              render={({ field: { onChange, value } }) => (
                <Input className="border border-gray-300 rounded-xl">
                  <InputField placeholder="Enter Name" value={value} onChangeText={onChange} />
                </Input>
              )}
            />
            {errors.name && (
              <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>
            )}
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
                        placeholder="YYYY-MM-DD"
                        value={value}
                        editable={false}
                        pointerEvents="none"
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
                      setValue("startDate", date.toISOString().split("T")[0], {
                        shouldValidate: true,
                      });
                      setValue("endDate", "", { shouldValidate: true });
                    }}
                    onCancel={() => setShowStartPicker(false)}
                  />
                </>
              )}
            />
            {errors.startDate && (
              <Text className="text-red-500 text-xs mt-1">{errors.startDate.message}</Text>
            )}
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
                        placeholder="YYYY-MM-DD"
                        value={value}
                        editable={false}
                        pointerEvents="none"
                      />
                    </Input>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showEndPicker}
                    mode="date"
                    minimumDate={startDateObj || today}
                    onConfirm={(date) => {
                      setShowEndPicker(false);
                      setValue("endDate", date.toISOString().split("T")[0], {
                        shouldValidate: true,
                      });
                    }}
                    onCancel={() => setShowEndPicker(false)}
                  />
                </>
              )}
            />
            {errors.endDate && (
              <Text className="text-red-500 text-xs mt-1">{errors.endDate.message}</Text>
            )}
          </FormControl>
 
          {/* Description */}
          <FormControl isInvalid={!!errors.description}>
            <FormControl.Label>{requiredLabel("Description")}</FormControl.Label>
            <Controller
              control={control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field: { onChange, value } }) => (
                <Input className="border border-gray-300 rounded-xl" style={{ height: 90 }}>
                  <InputField
                    placeholder="Enter Description"
                    multiline
                    numberOfLines={3}
                    style={{ textAlignVertical: "top" }}
                    value={value}
                    onChangeText={onChange}
                  />
                </Input>
              )}
            />
            {errors.description && (
              <Text className="text-red-500 text-xs mt-1">{errors.description.message}</Text>
            )}
          </FormControl>
        </View>
 
        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSubmit(onSubmit)}
          className="w-full mt-10 rounded-xl items-center justify-center py-4"
          style={{
            backgroundColor: "#0284c7",
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 12,
            elevation: 6,
          }}
          disabled={isSubmitting}
        >
          <Text className="text-white font-semibold text-lg">
            {isSubmitting
              ? editingCampaign
                ? "Updating..."
                : "Creating..."
              : editingCampaign
              ? "Update Campaign"
              : "Create Campaign"} {/* ✅ Dynamic button text */}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}