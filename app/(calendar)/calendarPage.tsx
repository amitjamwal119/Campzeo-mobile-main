import { ThemedText } from "@/components/themed-text";
import { SafeAreaView } from "react-native-safe-area-context";
// import CalendarComponent from "../(common)/calenderComponent";
import { HStack } from "@gluestack-ui/themed";
import { Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CalendarWrapper from "../(common)/calendarWrapper";
import { useColorScheme } from "react-native";
import { View } from "@gluestack-ui/themed";

export default function CalendarScreen() {
  const routePage = useRouter();
  const colorScheme = useColorScheme();

  return (
  <SafeAreaView className="flex-1">
    {/* HEADER */}
    <HStack
      className="px-3 pt-5 pb-3 items-center"
      justifyContent="space-between"
    >
      {/* LEFT: Back button */}
      <Pressable
        onPress={() => routePage.back()}
        style={{ padding: 6 }}
      >
        <Ionicons
          name="arrow-back-outline"
          size={22}
          color={colorScheme === "dark" ? "#ffffff" : "#020617"}
        />
      </Pressable>

      {/* CENTER: Title */}
      <ThemedText
        style={{
          fontSize: 20,
          lineHeight: 36,
          fontWeight: "700",
          textAlign: "center",
          flex: 1,
        }}
      >
        Scheduled Campaigns
      </ThemedText>

      {/* RIGHT: Spacer */}
      <View style={{ width: 34 }} />
    </HStack>

    {/* CONTENT */}
    <View style={{ flex: 1 }}>
      <CalendarWrapper />
    </View>
  </SafeAreaView>
);

}
