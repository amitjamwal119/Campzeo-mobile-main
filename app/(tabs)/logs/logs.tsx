import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView } from "react-native";

export default function Logs() {
  return (
    <>
      <ThemedView className="flex-1">
        <ScrollView>
          <ThemedText
            style={{ fontSize: 30, lineHeight: 36, fontWeight: 700 }}
            className="text-center mt-5 mb-9"
          >
            Logs
          </ThemedText>
        </ScrollView>
      </ThemedView>
    </>
  );
}
