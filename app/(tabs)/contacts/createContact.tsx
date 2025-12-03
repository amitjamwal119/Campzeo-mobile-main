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

// RHF + Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactSchemaType } from "@/validations/contactSchema";


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
  onCreate?: (c: ContactSchemaType) => void;
}) {
  const navigation = useNavigation<CreateContactScreenProp>();

  // -------------------------------------
  // 👇 React Hook Form setup with Zod
  // -------------------------------------
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<ContactSchemaType>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      whatsapp: "",
    },
  });

  // -------------------------------------
  // 👇 Submit Handler
  // -------------------------------------
  const handleCreate = handleSubmit((values) => {
    Alert.alert(
      "Contact Created",
      `${values.name} has been added successfully`,
      [
        {
          text: "OK",
          onPress: () => {
            onCreate?.(values);
            reset();
            navigation.navigate("Contacts");
          },
        },
      ],
      { cancelable: false }
    );
  });

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
        {/* Close Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            right: 10,
            zIndex: 10,
            padding: 8,
          }}
        >
          <Ionicons name="close" size={22} color="#334155" />
        </TouchableOpacity>

        {/* Header */}
        <View className="flex-row items-center mb-8">
          <View className="w-14 h-14 rounded-xl bg-[#d55b35] items-center justify-center">
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

        {/* Form */}
        <View className="gap-y-5">
          {/* Name */}
          <FormControl>
            <FormControl.Label>{requiredLabel("Name")}</FormControl.Label>
            <Input className="border border-gray-300 rounded-xl">
              <InputField
                placeholder="Enter Name"
                {...register("name")}
                onChangeText={(text) => setValue("name", text)}
              />
            </Input>
            {errors.name && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </Text>
            )}
          </FormControl>

          {/* Email */}
          <FormControl>
            <FormControl.Label>{requiredLabel("Email")}</FormControl.Label>
            <Input className="border border-gray-300 rounded-xl">
              <InputField
                placeholder="Enter Email"
                keyboardType="email-address"
                autoCapitalize="none"
                {...register("email")}
                onChangeText={(text) => setValue("email", text)}
              />
            </Input>
            {errors.email && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </Text>
            )}
          </FormControl>

          {/* Mobile */}
          <FormControl>
            <FormControl.Label>{requiredLabel("Mobile")}</FormControl.Label>
            <Input className="border border-gray-300 rounded-xl">
              <InputField
                placeholder="Enter Mobile Number"
                keyboardType="phone-pad"
                {...register("mobile")}
                onChangeText={(text) => setValue("mobile", text)}
              />
            </Input>
            {errors.mobile && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.mobile.message}
              </Text>
            )}
          </FormControl>

          {/* WhatsApp */}
          <FormControl>
            <FormControl.Label>{requiredLabel("WhatsApp")}</FormControl.Label>
            <Input className="border border-gray-300 rounded-xl">
              <InputField
                placeholder="Enter WhatsApp Number"
                keyboardType="phone-pad"
                {...register("whatsapp")}
                onChangeText={(text) => setValue("whatsapp", text)}
              />
            </Input>
            {errors.whatsapp && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.whatsapp.message}
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
            backgroundColor: "#d55b35",
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text className="text-white font-semibold text-lg">
            {isSubmitting ? "Creating..." : "Create Contact"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
