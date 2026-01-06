import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router, useRouter } from "expo-router";
import { Image, TouchableOpacity } from "react-native";
import { useSidebarStore } from "../../store/sidebarStore";

import React from "react";

import { useUser } from "@clerk/clerk-expo";

// type PopoverHandle = {
//   close: () => void;
//   open?: () => void;
// };

export default function TopBar() {
  const routePage = useRouter();

  const openSidebar = useSidebarStore((state) => state.openSidebar);

  const [isNotifOpen, setIsNotifOpen] = React.useState(false);

  // const popoverRef = React.useRef<PopoverHandle | null>(null);

  const { user } = useUser();

  if (!user) return null;
  return (
    <>
      <ThemedView
        className="flex-row items-center justify-between bg-white border-b border-gray-200 px-4 pb-3"
        style={{ paddingTop: 12, minHeight: 60 }}
      >
        {/* Left icon */}
        <TouchableOpacity
          onPress={() => {
            routePage.push("/(tabs)/dashboard");
          }}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/app-images/camp-logo.jpg")}
            style={{ width: 130, height: 50, borderRadius: 6 }}
            resizeMode="contain"
            alt="CampZeo logo"
          />
        </TouchableOpacity>

        {/* RIGHT — ICONS + AVATAR */}
        <ThemedView className="flex-row items-center gap-7">
          {/*  Notifications */}

          <TouchableOpacity onPress={() => router.push("/allNotifications")}>
            <IconSymbol name="notifications" size={25} color="#dc2626" />
          </TouchableOpacity>

          {/*  Avatar */}
          <TouchableOpacity activeOpacity={0.7} onPress={openSidebar}>
            <Image
              source={{
                uri: user.imageUrl,

                // "https://i.pravatar.cc/300?img=12"
              }}
              className="w-10 h-10 rounded-full border border-gray-300"
              alt="User"
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </>
  );
}
