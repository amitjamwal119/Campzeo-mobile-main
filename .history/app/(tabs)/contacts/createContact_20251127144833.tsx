import React, { useState, useEffect } from "react";
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
import { useNavigation, useSearchParams } from "expo-router";

type Contact = {
  name: string;
  email: string;
  mobile: string;
  whatsapp: string;
};

export default function CreateContact({ onCreate }: { onCreate?: (c: Contact) => void }) {
  const navigation = useNavigation();
  const params = useSearchParams();
  const [form, setForm] = useState<Contact>({
    name: "",
    email: "",
    mobile: "",
    whatsapp: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.record) {
      const record: Contact = JSON.parse(params.record as string);
      setForm(record);
    }
  }, [params.record]);

  const validate = () => {
    const e: Partial<Record<keyof Contact, string>> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.mobile.trim()) e.mobile = "Mobile is required";
    else if (!/^\d{7,15}$/.test(form.mobile.replace(/\s+/g, ""))) e.mobile = "Enter 7–15 digits";
    if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp is required";
    else if (!/^\d{7,15}$/.test(form.whatsapp.replace(/\s+/g, ""))) e.whatsapp = "Enter 7–15 digits";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);

      const isEdit = !!params.record;

      Alert.alert(
        isEdit ? "Contact Updated" : "Contact Created",
        `${form.name} has been ${isEdit ? "updated" : "added"} successfully`,
        [
          {
            text: "OK",
            onPress: () => {
              onCreate?.(form);
              setForm({ name: "", email: "", mobile: "", whatsapp: "" });
              setErrors({});
              navigation.goBack();
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
      <ScrollView className="flex-1 px-6 py-8" keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", right: 10, zIndex: 10, padding: 8 }}
        >
          <Ionicons name="close" size={22} color="#334155" />
        </TouchableOpacity>

        <View className="flex-row items-center mb-8">
          <View className="w-14 h-14 rounded-xl bg-[#d55b35] items-center justify-center">
            <Ionicons name="person-add" size={28} color="#fff" />
          </View>
          <View className="ml-4">
            <Text className="text-2xl font-bold text-gray-800">
              {params.record ? "Edit Contact" : "Create Contact"}
            </Text>
            <Text className="text-sm text-gray-500">
              {params.record ? "Update contact details" : "Add a new contact to your list"}
            </Text>
          </View>
        </View>

        <View className="space-y-6">
          {["Name", "Email", "Mobile", "WhatsApp"].map((field) => (
            <FormControl key={field}>
              <FormControl.Label>{requiredLabel(field)}</FormControl.Label>
              <Input className="border border-gray-300 rounded-xl">
                <InputField
                  placeholder={`Enter ${field}`}
                  value={form[field.toLowerCase() as keyof Contact]}
                  keyboardType={field === "Email" ? "email-address" : "phone-pad"}
                  autoCapitalize={field === "Email" ? "none" : "sentences"}
                  onChangeText={(text) =>
                    setForm({ ...form, [field.toLowerCase()]: text })
                  }
                />
              </Input>
              {errors[field.toLowerCase() as keyof Contact] && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors[field.toLowerCase() as keyof Contact]}
                </Text>
              )}
            </FormControl>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleCreate}
          className="w-full mt-10 rounded-xl items-center justify-center py-4"
          style={{ backgroundColor: "#d55b35", shadowColor: "#000", shadowOpacity: 0.18, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6 }}
        >
          <Text className="text-white font-semibold text-lg">
            {submitting ? (params.record ? "Updating..." : "Creating...") : (params.record ? "Edit Contact" : "Create Contact")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
