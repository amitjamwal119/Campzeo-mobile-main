import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView} from "react-native";

export default function editProfile() {
  
  return (
    <>
      <ThemedView className="flex-1">
        <ScrollView>
          <ThemedText>Edit Profile page</ThemedText>
        </ScrollView>
      </ThemedView>
    </>
  );
}
