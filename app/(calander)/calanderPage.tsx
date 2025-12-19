import { ThemedText } from "@/components/themed-text";
import { SafeAreaView } from "react-native-safe-area-context";
// import CalendarComponent from "../(common)/calenderComponent";
import { HStack } from "@gluestack-ui/themed";
import { Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CalendarWrapper from "../(common)/calendarWrapper";
import { useColorScheme } from "react-native";

export default function CalendarScreen() {
  const routePage = useRouter();
    const colorScheme = useColorScheme();
  

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}

      
      <HStack className="px-3 pt-5 gap-3 items-center">
       <Pressable
            onPress={() => {
              routePage.back();
            }}
          >
            <Ionicons
              name="arrow-back-outline"
              size={22}
              color={colorScheme === "dark" ? "#ffffff" : "#020617"}
            />
          </Pressable>
        <ThemedText
          style={{ fontSize: 20, lineHeight: 36, fontWeight: 700 }}
          className="text-center"
        >
          Scheduled Campaigns
        </ThemedText>
      </HStack>

      {/*  Calendar */}
      {/* <CalendarComponent /> */}
      <CalendarWrapper/>
    </SafeAreaView>
  );
}
