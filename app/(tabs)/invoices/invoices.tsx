import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView } from "react-native";
import { Button} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
// import { router } from "expo-router";


export default function Invoices() {

const routePage = useRouter(); 


  return (
    <>
      <ThemedView className="flex-1">
        <ScrollView>
          <ThemedText>Invoices page</ThemedText>

          {/* <Button 
          onPress={() => {routePage.push("/(auth)/login")}}
>
            <ThemedText>Go to Login Page</ThemedText>
          </Button> */}
        </ScrollView>
      </ThemedView>
    </>
  );
}
