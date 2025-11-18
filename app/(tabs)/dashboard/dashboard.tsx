import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView} from "react-native";

export default function Dashboard() {
  
  return (
    <>
      <ThemedView className="flex-1">
        <ScrollView>
          <ThemedText>Dashboard page</ThemedText>
        </ScrollView>
      </ThemedView>
    </>
  );
}
