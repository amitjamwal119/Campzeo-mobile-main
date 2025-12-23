import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity } from "react-native";
import { useSidebarStore } from "../../store/sidebarStore";
import { Box } from "@gluestack-ui/themed";

import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverBackdrop,
  ButtonText,
} from "@gluestack-ui/themed";
import { Button } from "@gluestack-ui/themed";
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
        className="flex-row items-center justify-between bg-white border-b border-gray-200 p-3"
        style={{ minHeight: 60 }}
      >
        {/* Left icon */}
        <TouchableOpacity
          onPress={() => {
            routePage.push("/(tabs)/dashboard");
          }}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/app-images/camp-logo.png")}
            style={{ width: 130, height: 50, borderRadius: 6 }}
            resizeMode="contain"
            alt="CampZeo logo"
          />
        </TouchableOpacity>

        {/* RIGHT — ICONS + AVATAR */}
        <ThemedView className="flex-row items-center gap-7">
          {/*  Notifications */}

          <Popover
            //  ref={popoverRef}
            isOpen={isNotifOpen}
            onOpen={() => setIsNotifOpen(true)}
            onClose={() => setIsNotifOpen(false)}
            placement="bottom"
            size="lg"
            trigger={(triggerProps) => {
              return (
                <Button {...triggerProps} variant="link">
                  <IconSymbol name="notifications" size={25} color="#D55B35" />
                </Button>
              );
            }}
          >
            <PopoverBackdrop />
            <PopoverContent>
              <PopoverArrow />

              <PopoverBody className="p-3">
                <Text className="font-semibold text-center text-base my-3">
                  Notifications
                </Text>

                <Box className="mb-3 p-2 rounded-lg bg-background-50 border border-background-200">
                  <Text className="text-sm font-medium text-typography-900">
                    New campaign created 🎉
                  </Text>
                  <Text className="text-xs text-typography-600 mt-1">
                    Just now
                  </Text>
                </Box>

                {/* Notification Item 2 */}
                <Box className="mb-3 p-2 rounded-lg bg-background-50 border border-background-200">
                  <Text className="text-sm font-medium text-typography-900">
                    You have 3 new leads 🔥
                  </Text>
                  <Text className="text-xs text-typography-600 mt-1">
                    5 minutes ago
                  </Text>
                </Box>

                {/* Notification Item 3 */}
                <Box className="mb-3 p-2 rounded-lg bg-background-50 border border-background-200">
                  <Text className="text-sm font-medium text-typography-900">
                    Reminder: Follow up with John
                  </Text>
                  <Text className="text-xs text-typography-600 mt-1">
                    30 minutes ago
                  </Text>
                </Box>

                {/* Footer Button */}

                <Button
                  variant="link"
                  className="self-center mt-1"
                  onPress={() => console.log("See all notifications")}
                >
                  <ButtonText
                    className="text-primary-600 font-medium"
                    onPress={() => {
                      setIsNotifOpen(false);
                      routePage.push("/(notifications)/allNotifications");
                    }}
                  >
                    See all notifications →
                  </ButtonText>
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          {/*  Avatar */}
          <TouchableOpacity activeOpacity={0.7} onPress={openSidebar}>
            <Image
              source={{
                uri: user.imageUrl,
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
