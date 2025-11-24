import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal, Text, TouchableOpacity } from "react-native";
import { useSidebarStore } from "../../store/sidebarStore";

export default function TopBar() {
  const routePage = useRouter();
  const openSidebar = useSidebarStore((state) => state.openSidebar);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

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
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowNotifications(true)}
          >
            {/* #D55B35 */}
            <IconSymbol name="notifications" size={25} color="#D55B35" />
          </TouchableOpacity>

          {/*  Quick Actions */}
          {/* <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowQuickActions(true)}
          >
            <IconSymbol name="layers" size={25} color="#D55B35" />
          </TouchableOpacity> */}

          {/*  Avatar */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openSidebar}
          >
            <Image
              source={{
                uri: "https://i.pravatar.cc/300?img=12",
              }}
              className="w-10 h-10 rounded-full border border-gray-300"
              alt="User"
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* ========================== */}
      {/* Notifications Modal */}
      {/* ========================== */}
      <Modal
        transparent
        visible={showNotifications}
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 bg-black/40 justify-center items-center"
          onPress={() => setShowNotifications(false)}
        >
          <ThemedView className="bg-white p-4 rounded-xl w-60 border border-gray-300">
            <Text className="text-gray-700 text-base">
              You have no new notifications.
            </Text>
          </ThemedView>
        </TouchableOpacity>
      </Modal>

      {/* ========================== */}
      {/* Quick Actions Modal */}
      {/* ========================== */}
      <Modal
        transparent
        visible={showQuickActions}
        animationType="fade"
        onRequestClose={() => setShowQuickActions(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 bg-black/40 justify-center items-center"
          onPress={() => setShowQuickActions(false)}
        >
          <ThemedView className="bg-white p-4 rounded-xl w-60 border border-gray-300">
            <Text className="text-lg font-semibold text-center mb-3">
              Quick Actions
            </Text>

            {/* Invoice */}
            <TouchableOpacity
              className="items-center"
              onPress={() => {
                setShowQuickActions(false);
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={28}
                color="#007AFF"
              />
              <Text className="text-blue-600 mt-1">Invoice</Text>
            </TouchableOpacity>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
