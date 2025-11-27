import { ThemedView } from "@/components/themed-view";
import { ScrollView, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";

export default function Accounts() {
  return (
    <ThemedView className="flex-1 p-4">
      <ScrollView>
        <ThemedText
          style={{ fontSize: 30, lineHeight: 36, fontWeight: 700 }}
          className="text-center mt-9 mb-20"
        >
          Accounts
        </ThemedText>

        {/*===============Social Icons==================*/}
        <View className="flex-row flex-wrap justify-center gap-6">
          <View className="items-center p-4 rounded-xl bg-white/10">
            <FontAwesome name="facebook" size={40} color="#1877F2" />
            <ThemedText className="mt-2 text-base font-semibold">
              Facebook
            </ThemedText>
          </View>

          <View className="items-center p-4 rounded-xl bg-white/10">
            <FontAwesome name="instagram" size={40} color="#E4405F" />
            <ThemedText className="mt-2 text-base font-semibold">
              Instagram
            </ThemedText>
          </View>

          <View className="items-center p-4 rounded-xl bg-white/10">
            <FontAwesome name="linkedin" size={40} color="#0A66C2" />
            <ThemedText className="mt-2 text-base font-semibold">
              LinkedIn
            </ThemedText>
          </View>

          <View className="items-center p-4 rounded-xl bg-white/10">
            <FontAwesome name="youtube-play" size={40} color="#FF0000" />
            <ThemedText className="mt-2 text-base font-semibold">
              YouTube
            </ThemedText>
          </View>

          <View className="items-center p-4 rounded-xl bg-white/10">
            <FontAwesome name="pinterest" size={40} color="#E60023" />
            <ThemedText className="mt-2 text-base font-semibold">
              Pinterest
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
