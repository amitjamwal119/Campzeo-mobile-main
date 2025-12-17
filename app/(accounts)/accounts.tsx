import { ThemedView } from "@/components/themed-view";
import { ScrollView, View } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { HStack } from "@gluestack-ui/themed";
import { Pressable } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";


// Extract valid FontAwesome icon names
type FontAwesomeName = React.ComponentProps<typeof FontAwesome>["name"];

type SocialCardProps = {
  icon: FontAwesomeName;
  color: string;
  label: string;
};

const SocialCard = ({ icon, color, label }: SocialCardProps) => (
  <View className="items-center p-4 rounded-xl bg-white/10">
    <FontAwesome name={icon} size={40} color={color} />
    <ThemedText className="mt-2 text-base font-semibold">{label}</ThemedText>
  </View>
);

const SOCIALS: SocialCardProps[] = [
  { icon: "facebook", color: "#1877F2", label: "Facebook" },
  { icon: "instagram", color: "#E4405F", label: "Instagram" },
  { icon: "linkedin", color: "#0A66C2", label: "LinkedIn" },
  { icon: "youtube-play", color: "#FF0000", label: "YouTube" },
  { icon: "pinterest", color: "#E60023", label: "Pinterest" },
];

export default function Accounts() {
    const routePage = useRouter();
  
  return (
    <ThemedView className="flex-1 p-4 pt-20">
      <ScrollView>
        <HStack>
                  <Pressable onPress={() => {routePage.back()}}>
                    <Ionicons name="arrow-back-outline" size={22} color="#334155" />
                  </Pressable>
                </HStack>
        <ThemedText
          style={{ fontSize: 30, lineHeight: 36, fontWeight: 700 }}
          className="text-center mt-9 mb-20"
        >
          Accounts
        </ThemedText>

        <View className="flex-row flex-wrap justify-center gap-6">
          {SOCIALS.map((item, index) => (
            <SocialCard key={index} {...item} />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
