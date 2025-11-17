import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView} from "react-native";

export default function SideBar() {
  
  return (
    <>
      <ThemedView className="flex-1">
        <ScrollView>
          <ThemedText>Sidebar</ThemedText>
        </ScrollView>
      </ThemedView>
    </>
  );
}
