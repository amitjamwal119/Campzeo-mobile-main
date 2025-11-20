import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView} from "react-native";
import { Button, Text } from "@gluestack-ui/themed";

export default function Dashboard() {
  
  return (
    <>
      <ThemedView className="flex-1">
        <ScrollView>
          <ThemedText>Dashboard page</ThemedText>

          <Button>
      <Text>Hello Gluestack UI</Text>
    </Button>
        </ScrollView>
      </ThemedView>
    </>
  );
}
