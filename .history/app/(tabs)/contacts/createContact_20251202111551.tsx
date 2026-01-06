import { Ionicons } from "@expo/vector-icons";
import { FormControl, Input, InputField } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
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
  name: string;
  email: string;
  mobile: string;
  whatsapp: string;
};

type RootStackParamList = {
  Contacts: undefined;
  CreateContact: undefined;
};

type CreateContactScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateContact"
>;

export default function CreateContact({
  onCreate,
}: {
  onCreate?: (c: Contact) => void;
}) {
  const navigation = useNavigation<CreateContactScreenProp>();

  const [form, setForm] = useState<Contact>({
    name: "",
    email: "",
    mobile: "",
    whatsapp: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Partial<Record<keyof Contact, string>> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (!form.mobile.trim()) e.mobile = "Mobile is required";
    else if (!/^\d{7,15}$/.test(form.mobile.replace(/\s+/g, "")))
      e.mobile = "Enter 7–15 digits";
    if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp is required";
    else if (!/^\d{7,15}$/.test(form.whatsapp.replace(/\s+/g, "")))
      e.whatsapp = "Enter 7–15 digits";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);

      // ✅ Show alert and navigate back on OK
      Alert.alert(
        "Contact Created",
        `${form.name} has been added successfully`,
        [
          {
            text: "OK",
            onPress: () => {
              onCreate?.(form); // optionally pass data to parent
              setForm({ name: "", email: "", mobile: "", whatsapp: "" });
              setErrors({});
              navigation.navigate("Contacts"); // navigate back
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
          <View className="w-14 h-14 rounded-xl bg-[#dc2626] items-center justify-center">
            <Ionicons name="person-add" size={28} color="#fff" />
          </View>
          <View className="ml-4">
            <Text className="text-2xl font-bold text-gray-800">
              Create Contact
            </Text>
            <Text className="text-sm text-gray-500">
              Add a new contact to your list
            </Text>
          </View>
        </View>

        {/* Form Fields */}
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

        {/* Create Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleCreate}
          className="w-full mt-10 rounded-xl items-center justify-center py-4"
          style={{
            backgroundColor: "#dc2626",
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text className="text-white font-semibold text-lg">
            {submitting ? "Creating..." : "Create Contact"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}