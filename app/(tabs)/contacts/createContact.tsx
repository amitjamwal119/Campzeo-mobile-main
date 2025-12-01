import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Input, InputField, FormControl, VStack } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Controller, useForm } from "react-hook-form";
import { contactSchema, ContactSchemaType } from "@/validations/contactSchema";
import { zodResolver } from "@hookform/resolvers/zod";

// type Contact = {
//   name: string;
//   email: string;
//   mobile: string;
//   whatsapp: string;
// };

type RootStackParamList = {
  Contacts: undefined;
  CreateContact: undefined;
};

type CreateContactScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateContact"
>;

export default function CreateContact() {
  //   onCreate,
  // }: {
  //   onCreate?: (c: Contact) => void;
  // }) {

  // const [form, setForm] = useState<Contact>({
  //   name: "",
  //   email: "",
  //   mobile: "",
  //   whatsapp: "",
  // });

  // const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>(
  //   {}
  // );
  // const [submitting, setSubmitting] = useState(false);

  // const validate = () => {
  //   const e: Partial<Record<keyof Contact, string>> = {};
  //   if (!form.name.trim()) e.name = "Name is required";
  //   if (!form.email.trim()) e.email = "Email is required";
  //   else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
  //     e.email = "Invalid email";
  //   if (!form.mobile.trim()) e.mobile = "Mobile is required";
  //   else if (!/^\d{7,15}$/.test(form.mobile.replace(/\s+/g, "")))
  //     e.mobile = "Enter 7–15 digits";
  //   if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp is required";
  //   else if (!/^\d{7,15}$/.test(form.whatsapp.replace(/\s+/g, "")))
  //     e.whatsapp = "Enter 7–15 digits";

  //   setErrors(e);
  //   return Object.keys(e).length === 0;
  // };

  // const handleCreate = () => {
  //   if (!validate()) return;

  //   setSubmitting(true);

  //   setTimeout(() => {
  //     setSubmitting(false);

  //     // ✅ Show alert and navigate back on OK
  //     Alert.alert(
  //       "Contact Created",
  //       `${form.name} has been added successfully`,
  //       [
  //         {
  //           text: "OK",
  //           onPress: () => {
  //             onCreate?.(form); // optionally pass data to parent
  //             setForm({ name: "", email: "", mobile: "", whatsapp: "" });
  //             setErrors({});
  //             navigation.navigate("Contacts"); // navigate back
  //           },
  //         },
  //       ],
  //       { cancelable: false }
  //     );
  //   }, 600);
  // };

  // const requiredLabel = (label: string) => (
  //   <Text className="text-sm font-semibold text-gray-700">
  //     {label} <Text className="text-red-500">*</Text>
  //   </Text>
  // );

  const navigation = useNavigation<CreateContactScreenProp>();

  // Form fields -----------
  type ContactField = {
    name: "name" | "email" | "mobile" | "whatsapp";
    label: string;
    placeholder: string;
    keyboardType: "default" | "email-address" | "phone-pad";
  };

  const fields: ContactField[] = [
    {
      name: "name",
      label: "Name",
      placeholder: "Enter Name",
      keyboardType: "default",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter Email",
      keyboardType: "email-address",
    },
    {
      name: "mobile",
      label: "Mobile",
      placeholder: "Enter Mobile",
      keyboardType: "phone-pad",
    },
    {
      name: "whatsapp",
      label: "WhatsApp",
      placeholder: "Enter WhatsApp",
      keyboardType: "phone-pad",
    },
  ];

  // RHF logics

  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = useForm<ContactSchemaType>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      whatsapp: "",
    },
  });

  const onSubmit = (data: ContactSchemaType) => {
    console.log("Form Submitted:", data);
    // call API or any other action
  };

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

        {/* Form Fields */}
        {/*  */}

        <View className="gap-3">
          {fields.map((field, idx) => (
            <FormControl key={idx}>
              <FormControl.Label>
                <Text>{field.label}</Text>
              </FormControl.Label>

              <Controller
                name={field.name} // must match schema field
                control={control}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <>
                    <Input>
                      <InputField
                        placeholder={`Enter ${field.name}`}
                        value={value}
                        onChangeText={onChange}
                      />
                    </Input>

                    {error && (
                      <Text className="text-red-500 text-sm mt-1">
                        *{error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </FormControl>
          ))}
        </View>

        {/* Create Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSubmit(onSubmit)}
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
            Create Contact
            {/* {handleSubmit ? "Creating..." : "Create Contact"} */}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

{
  /*  */
}
