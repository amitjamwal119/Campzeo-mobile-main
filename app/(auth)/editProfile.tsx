import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, Pressable } from "react-native";
import { VStack, Input, InputField } from "@gluestack-ui/themed";
import { Phone } from "lucide-react-native";
import { Heading } from "@gluestack-ui/themed";
import { Controller, useForm } from "react-hook-form";
import {
  editProfileSchema,
  EditProfileSchemaType,
} from "@/validations/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Text } from "react-native";

type closeEPFType = {
  closeEPF: () => void; // function with no args, returns nothing
};

export default function EditProfile({ closeEPF }: closeEPFType) {
  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = useForm<EditProfileSchemaType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  type editProfileField = {
    name: "firstName" | "lastName" | "phone";
    label: string;
    placeholder: string;
    keyboardType: "default" | "phone-pad";
    icon?: React.ReactNode; // ⭐ This is the correct type
  };

  const fields: editProfileField[] = [
    {
      name: "firstName",
      label: "First Name",
      placeholder: "Enter First Name",
      keyboardType: "default",
    },
    {
      name: "lastName",
      label: "Last Name",
      placeholder: "Enter Last Name",
      keyboardType: "default",
    },
    {
      name: "phone",
      label: "Phone Number",
      placeholder: "+91 XXXXX XXXXX",
      icon: <Phone size={18} color="#D55B35" />,
      keyboardType: "phone-pad",
    },
  ];

  const onSubmit = (data: EditProfileSchemaType) => {
    console.log("Submitted:", data);
  };
  return (
    <ThemedView className="flex-1 p-5 rounded-lg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Heading size="lg" className="text-center">
          Edit Profile
        </Heading>

        <VStack space="lg">
          {fields.map((field, idx) => (
            <VStack space="xs" key={idx}>
              <ThemedText className="text-gray-400">{field.label}</ThemedText>

              <Controller
                control={control}
                name={field.name}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <>
                    <Input className="bg-white/10 rounded-xl px-3 py-2 flex-row items-center">
                      {/* Icon for phone field */}
                      {field.icon}

                      <InputField
                        className={`${field.icon ? "ml-2 flex-1" : ""}`}
                        placeholder={field.placeholder}
                        value={value}
                        onChangeText={onChange}
                        keyboardType={
                          field.name === "phone" ? "phone-pad" : "default"
                        }
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
            </VStack>
          ))}

          {/* ====Buttons==== */}
          <VStack>
            <Pressable
              className="bg-[#D55B35] rounded-xl py-4 mt-4 items-center"
              // onPress={handleSubmit(onSubmit)}
              onPress={handleSubmit(onSubmit)} // ⭐ This triggers Zod validation
            >
              <ThemedText style={{ color: "white", fontWeight: "600" }}>
                Save Changes
              </ThemedText>
            </Pressable>

            <Pressable
              className="bg-slate-500 rounded-xl py-4 mt-4 items-center"
              onPress={closeEPF}
            >
              <ThemedText style={{ color: "white", fontWeight: "600" }}>
                Cancel
              </ThemedText>
            </Pressable>
          </VStack>
        </VStack>
      </ScrollView>
    </ThemedView>
  );
}
