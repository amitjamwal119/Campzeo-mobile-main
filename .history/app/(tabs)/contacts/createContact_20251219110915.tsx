import {
  createContactApi,
  updateContactApi,
} from "@/api/contact/contactApi";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { FormControl, Input, InputField } from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Contact = {
  id?: number; // optional for new contacts
  name: string;
  email: string;
  mobile: string;
  whatsapp: string;
};

export default function CreateContact() {
  const { getToken } = useAuth();

  // 🔹 Get contactId from route
  const { contactId, record: recordStr } = useLocalSearchParams();
  const isEdit = !!contactId;

  // 🔹 (Optional) record support if you still pass it
  const editingContact: Contact | null = recordStr
    ? JSON.parse(recordStr as string)
    : null;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Contact>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      whatsapp: "",
    },
    mode: "onChange",
  });

const hasResetRef = useRef(false);

useEffect(() => {
  if (!editingContact || hasResetRef.current) return;

  reset({
    name: editingContact.name ?? "",
    email: editingContact.email ?? "",
    mobile: editingContact.mobile ?? "",
    whatsapp: editingContact.whatsapp ?? "",
  });

  hasResetRef.current = true;
}, [editingContact]);



const onSubmit = async (data: Contact) => {
  console.log("isEdit:", isEdit);
  console.log("contactId:", contactId, "Number(contactId):", Number(contactId));
  console.log("data to update:", data);

  try {
    const token = await getToken();
    if (!token) throw new Error("Authentication token not found");

    if (isEdit) {
      await updateContactApi(
        Number(contactId),
        { ...data, campaignIds: [1] },
        token
      );
      Alert.alert("Success", "Contact updated successfully");
    } else {
      await createContactApi(
        { ...data, campaignIds: [1] },
        token
      );
      Alert.alert("Success", "Contact created successfully");
    }

    router.back();
  } catch (error: any) {
    console.error("Contact Error:", error);
    Alert.alert("Error", error.message || "Something went wrong");
  }
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
      <ScrollView className="flex-1 px-6 py-6" keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", right: 10, zIndex: 10, padding: 8 }}
        >
          <Ionicons name="close" size={24} color="#334155" />
        </TouchableOpacity>

        <View className="flex-row items-center mb-6">
          <View className="w-14 h-14 rounded-lg border-transparent bg-[#dc2626] items-center justify-center">
            <Ionicons
              name={isEdit ? "person" : "person-add"}
              size={28}
              color="#fff"
            />
          </View>
          <View className="ml-4">
            <Text className="text-2xl font-bold text-gray-800">
              {isEdit ? "Edit Contact" : "Create Contact"}
            </Text>
            <Text className="text-sm text-gray-500">
              {isEdit
                ? "Update the contact details"
                : "Add a new contact to your list"}
            </Text>
          </View>
        </View>

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
                pattern: {
                  value: /^[A-Za-z\s]+$/i,
                  message: "Only letters allowed",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Input className="border border-gray-300 rounded-xl">
                  <InputField
                    placeholder="Enter Name"
                    value={value}
                    onChangeText={onChange}
                  />
                </Input>
              )}
            />
            {errors.name && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </Text>
            )}
          </FormControl>

          {/* Email */}
          <FormControl isInvalid={!!errors.email}>
            <FormControl.Label>{requiredLabel("Email")}</FormControl.Label>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Input className="border border-gray-300 rounded-xl">
                  <InputField
                    placeholder="Enter Email"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Input>
              )}
            />
            {errors.email && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </Text>
            )}
          </FormControl>

          {/* Mobile */}
          <FormControl isInvalid={!!errors.mobile}>
            <FormControl.Label>{requiredLabel("Mobile")}</FormControl.Label>
            <Controller
              control={control}
              name="mobile"
              rules={{
                required: "Mobile is required",
                pattern: {
                  value: /^\d{7,15}$/,
                  message: "Not a valid number",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Input className="border border-gray-300 rounded-xl">
                  <InputField
                    placeholder="Enter Mobile"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                  />
                </Input>
              )}
            />
            {errors.mobile && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.mobile.message}
              </Text>
            )}
          </FormControl>

          {/* WhatsApp */}
          <FormControl isInvalid={!!errors.whatsapp}>
            <FormControl.Label>{requiredLabel("WhatsApp")}</FormControl.Label>
            <Controller
              control={control}
              name="whatsapp"
              rules={{
                required: "WhatsApp is required",
                pattern: {
                  value: /^\d{10,15}$/,
                  message: "Not a valid number",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Input className="border border-gray-300 rounded-xl">
                  <InputField
                    placeholder="Enter WhatsApp"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                  />
                </Input>
              )}
            />
            {errors.whatsapp && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.whatsapp.message}
              </Text>
            )}
          </FormControl>
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="w-full mt-10 mb-10 rounded-xl items-center justify-center py-4"
          style={{
            backgroundColor: "#dc2626",
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
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Contact"
              : "Create Contact"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
