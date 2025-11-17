import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogin = () => {
    router.replace("/(tabs)");
  };

  return (
    <>
      <ThemedView className="flex-1">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Card Container */}
          <ThemedView className="w-full max-w-sm rounded-xl p-6 shadow-lg bg-card">
            {/* Header */}
            <View className="items-center mb-6">
              <ThemedText className="text-2xl font-bold">
                Welcome Back
              </ThemedText>
              <View className="w-1/3 h-[2px] bg-gray-400 mt-2" />
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Email */}
              <View>
                <ThemedText className="text-base mb-1">Email</ThemedText>

                <TextInput
                  placeholder="Enter email"
                  className="w-full p-4 rounded-lg border bg-transparent
                           dark:text-white text-black
                           border-gray-400 dark:border-gray-600"
                  placeholderTextColor="#888"
                />
              </View>

              {/* Password */}
              <View>
                <ThemedText className="text-base mb-1">Password</ThemedText>

                <TextInput
                  placeholder="Enter password"
                  secureTextEntry
                  className="w-full p-4 rounded-lg border bg-transparent
                           dark:text-white text-black
                           border-gray-400 dark:border-gray-600"
                  placeholderTextColor="#888"
                />
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                className="bg-green-600 w-full p-4 rounded-lg active:opacity-90"
              >
                <ThemedText className="text-center text-white text-lg font-bold">
                  Login Now
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </>
  );
}
