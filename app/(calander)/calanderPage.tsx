import { ThemedText } from "@/components/themed-text";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarComponent from "../(common)/calenderComponent";




export default function CalendarScreen() {
 
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <ThemedText
        style={{ fontSize: 30, lineHeight: 36, fontWeight: 700 }}
        className="text-center mt-5 mb-9"
      >
        Scheduled Campaigns
      </ThemedText>

      {/* 📅 Calendar */}
      <CalendarComponent/>
    </SafeAreaView>
  );
}
