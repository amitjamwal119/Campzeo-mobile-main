import { Pressable, Dimensions } from "react-native";
import Animated, {
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";
import { ScrollView } from "react-native";
import { useSidebarStore } from "@/store/sidebarStore";

export default function Sidebar() {
  const { openSidebar, closeSidebar } = useSidebarStore();
  const screenWidth = Dimensions.get("window").width;

  if (!openSidebar) return null;

  return (
    <>
      {/* Overlay */}
      <Pressable
        onPress={closeSidebar}
        className="absolute inset-0 bg-black/40 z-[998]"
      />

      {/* Sidebar Right Side */}
      <Animated.View
        entering={SlideInRight.duration(200)}
        exiting={SlideOutRight.duration(200)}
        style={{ width: screenWidth * 0.7 }}
        className="absolute right-0 top-0 bottom-0 bg-background p-4 z-[999]"
      >
        <ScrollView>
          <ThemedText className="text-xl font-semibold mb-4">
            Sidebar Menu
          </ThemedText>

          {/* Add your menu items */}
          <ThemedText className="mb-3">Home</ThemedText>
          <ThemedText className="mb-3">Profile</ThemedText>
          <ThemedText className="mb-3">Settings</ThemedText>
        </ScrollView>
      </Animated.View>
    </>
  );
}
