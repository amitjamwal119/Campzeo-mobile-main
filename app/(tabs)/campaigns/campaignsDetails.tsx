
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView} from "react-native";

export default function CampaignDetails() {
  
  return (
    <>
      <ThemedView className="flex-1">
        <ScrollView>
          <ThemedText>campaignDetails Profile page</ThemedText>
        </ScrollView>
      </ThemedView>
    </>
  );
}

//  return (
//     <>
//       <ThemedView className="flex-1">
//         <ScrollView>
//           <ThemedText>Accounts page</ThemedText>
//         </ScrollView>
//       </ThemedView>
//     </>
//   );