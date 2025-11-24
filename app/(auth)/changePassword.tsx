import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, Pressable } from "react-native";
import { VStack, Input, InputField } from "@gluestack-ui/themed";
import { Lock } from "lucide-react-native";
import { Heading } from "@gluestack-ui/themed";


// setChangePas
type closeCPType = {
  closeCP: () => void; // function with no args, returns nothing
};

// setChangePas

export default function ChangePassword({ closeCP }: closeCPType) {
  return (
    <ThemedView className="flex-1 p-5  rounded-lg">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Heading size="lg" className="text-center">
          Change Password
        </Heading>
        <VStack space="lg">
          {/* CURRENT PASSWORD */}
          <VStack space="xs">
            <ThemedText className="text-gray-400">Current Password</ThemedText>
            <Input className="bg-white/10 rounded-xl px-3 py-2 flex-row items-center">
              <Lock size={18} color="#D55B35" />
              <InputField
                placeholder="Enter current password"
                secureTextEntry
                className="ml-2 flex-1"
              />
            </Input>
          </VStack>

          {/* NEW PASSWORD */}
          <VStack space="xs">
            <ThemedText className="text-gray-400">New Password</ThemedText>
            <Input className="bg-white/10 rounded-xl px-3 py-2 flex-row items-center">
              <Lock size={18} color="#D55B35" />
              <InputField
                placeholder="Enter new password"
                secureTextEntry
                className="ml-2 flex-1"
              />
            </Input>
          </VStack>

          {/* RE-ENTER PASSWORD */}
          <VStack space="xs">
            <ThemedText className="text-gray-400">
              Re-enter New Password
            </ThemedText>
            <Input className="bg-white/10 rounded-xl px-3 py-2 flex-row items-center">
              <Lock size={18} color="#D55B35" />
              <InputField
                placeholder="Re-enter new password"
                secureTextEntry
                className="ml-2 flex-1"
              />
            </Input>
          </VStack>

        

                   {/* ====Buttons==== */}
          <VStack>
            {/* SAVE BUTTON */}
            <Pressable className="bg-black rounded-xl py-4 mt-4 items-center">
              <ThemedText style={{ color: "white", fontWeight: "600" }}>
                Save Changes
              </ThemedText>
            </Pressable>

            {/* Cancel Button */}
            <Pressable
              className="bg-slate-500 rounded-xl py-4 mt-4 items-center"
              onPress={closeCP}
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
