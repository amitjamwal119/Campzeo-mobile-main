
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView } from "react-native";

export default function Campaigns() {
  
  return (
    <>
      <ThemedView className="flex-1">
        <ScrollView>
          <ThemedText>campaigns page</ThemedText>
        </ScrollView>
      </ThemedView>
    </>
  );
}
