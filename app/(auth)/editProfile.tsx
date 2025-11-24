import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, Pressable } from "react-native";
import { VStack, Input, InputField } from "@gluestack-ui/themed";
import { Phone } from "lucide-react-native";
import { Heading } from "@gluestack-ui/themed";

type closeEPFType = {
  closeEPF: () => void; // function with no args, returns nothing
};

export default function EditProfile({ closeEPF }: closeEPFType) {
  return (
    <ThemedView className="flex-1 p-5 rounded-lg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Heading size="lg" className="text-center">
          Edit Profile
        </Heading>
        <VStack space="lg">
          {/* FIRST NAME */}
          <VStack space="xs">
            <ThemedText className="text-gray-400">First Name</ThemedText>
            <Input className="bg-white/10 rounded-xl px-3 py-2">
              <InputField placeholder="Enter first name" />
            </Input>
          </VStack>

          {/* LAST NAME */}
          <VStack space="xs">
            <ThemedText className="text-gray-400">Last Name</ThemedText>
            <Input className="bg-white/10 rounded-xl px-3 py-2">
              <InputField placeholder="Enter last name" />
            </Input>
          </VStack>

          {/* PHONE */}
          <VStack space="xs">
            <ThemedText className="text-gray-400">Phone Number</ThemedText>
            <Input className="bg-white/10 rounded-xl px-3 py-2 flex-row items-center">
              <Phone size={18} color="#D55B35" />
              <InputField
                className="ml-2 flex-1"
                placeholder="+91 XXXXX XXXXX"
              />
            </Input>
          </VStack>

          {/* ====Buttons==== */}
          <VStack>
            {/* SAVE BUTTON */}
            <Pressable className="bg-[#D55B35] rounded-xl py-4 mt-4 items-center">
              <ThemedText style={{ color: "white", fontWeight: "600" }}>
                Save Changes
              </ThemedText>
            </Pressable>

            {/* Cancel Button */}
            <Pressable
              className="bg-slate-500 rounded-xl py-4 mt-4 items-center"
              onPress={closeEPF}
            >
              <ThemedText style={{ color: "white", fontWeight: "600" }}>
                Cancel
              </ThemedText>
            </Pressable>
          </VStack>


        </VStack>
      </ScrollView>
    </ThemedView>
  );
}
