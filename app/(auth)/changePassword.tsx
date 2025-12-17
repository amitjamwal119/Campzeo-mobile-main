import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, Pressable } from "react-native";
import { VStack, Input, InputField } from "@gluestack-ui/themed";
import { Lock } from "lucide-react-native";
import { Heading } from "@gluestack-ui/themed";
import { Controller, useForm } from "react-hook-form";
import {
  changePasswordSchema,
  ChangePasswordSchemaType,
} from "@/validations/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "react-native";

// setChangePas
type closeCPType = {
  closeCP: () => void; // function with no args, returns nothing
};

type ChangePasswordField = {
  name: "currentPassword" | "newPassword" | "reEnterNewPassword";
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  secureTextEntry?: boolean;
};

export default function ChangePassword({ closeCP }: closeCPType) {
  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      reEnterNewPassword: "",
    },
  });

  const fields: ChangePasswordField[] = [
    {
      name: "currentPassword",
      label: "Current Password",
      placeholder: "Enter current password",
      secureTextEntry: true,
      icon: <Lock size={18} color="#D55B35" />,
    },
    {
      name: "newPassword",
      label: "New Password",
      placeholder: "Enter new password",
      secureTextEntry: true,
      icon: <Lock size={18} color="#D55B35" />,
    },
    {
      name: "reEnterNewPassword",
      label: "Re-enter New Password",
      placeholder: "Re-enter new password",
      secureTextEntry: true,
      icon: <Lock size={18} color="#D55B35" />,
    },
  ];

  const onSubmit = (data: ChangePasswordSchemaType) => {
    console.log("Submitted:", data);
  };

  return (
    <ThemedView className="flex-1 p-5  rounded-lg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Heading size="lg" className="text-center">
          Change Password
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
                      {field.icon}

                      <InputField
                        placeholder={field.placeholder}
                        secureTextEntry={field.secureTextEntry}
                        value={value}
                        onChangeText={onChange}
                        className="ml-2 flex-1"
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

          {/* ==== Buttons ==== */}
          <VStack>
            <Pressable
              className="bg-black rounded-xl py-4 mt-4 items-center"
              onPress={handleSubmit(onSubmit)}
            >
              <ThemedText style={{ color: "white", fontWeight: "600" }}>
                Save Changes
              </ThemedText>
            </Pressable>

            <Pressable
              className="bg-slate-500 rounded-xl py-4 mt-4 items-center"
              onPress={closeCP}
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
