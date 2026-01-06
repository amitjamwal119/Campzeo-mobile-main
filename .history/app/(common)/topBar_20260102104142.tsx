import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { router, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useSidebarStore } from "../../store/sidebarStore";

export default function TopBar() {
  const routePage = useRouter();
  const openSidebar = useSidebarStore((state) => state.openSidebar);
  const { user } = useUser();

  // If user not loaded yet
  if (!user) return null;

  return (
    <ThemedView
      className="flex-row items-center justify-between bg-white border-b border-gray-200 px-4 pb-3"
      style={{ paddingTop: 12, minHeight: 60 }}
    >
      {/* LEFT — LOGO */}
      <TouchableOpacity
        onPress={() => routePage.push("/(tabs)/dashboard")}
        activeOpacity={0.7}
      >
        <Image
          source={require("../../assets/app-images/camp-logo.jpg")}
          style={{ width: 130, height: 50, borderRadius: 6 }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* RIGHT — ICONS */}
      <ThemedView className="flex-row items-center gap-7">
        {/* Notifications */}
        <TouchableOpacity onPress={() => router.push("/allNotifications")}>
          <IconSymbol name="notifications" size={25} color="#dc2626" />
        </TouchableOpacity>

        {/* Avatar */}
        <TouchableOpacity activeOpacity={0.7} onPress={openSidebar}>
          <Image
            source={{ uri: user.imageUrl }}
            className="w-10 h-10 rounded-full border border-gray-300"
          />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
