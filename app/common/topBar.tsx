import React, { useState } from "react";
import {  Text, TouchableOpacity, Image, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSidebarStore } from "../../store/sidebarStore";
import { ThemedView } from "@/components/themed-view";

export default function TopBar() {
  const router = useRouter();
  const openSidebar = useSidebarStore((s) => s.openSidebar);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  return (
    <>
      <ThemedView
        className="flex-row items-center justify-between bg-white border-b border-gray-200 px-4 pb-3"
        style={{ paddingTop: 12, minHeight: 60 }}
      >
        {/* LEFT — MENU */}
        <TouchableOpacity activeOpacity={0.7} onPress={openSidebar}>
          <Ionicons name="menu-outline" size={28} color="#000" />
        </TouchableOpacity>

        {/* RIGHT — ICONS + AVATAR */}
        <ThemedView className="flex-row items-center space-x-5">

          {/* 🔔 Notifications */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowNotifications(true)}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#007AFF"
            />
          </TouchableOpacity>

          {/* ⚡ Quick Actions */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowQuickActions(true)}
          >
            <Ionicons name="layers-outline" size={24} color="#007AFF" />
          </TouchableOpacity>

          {/* 👤 Avatar */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(profile)/userProfile")}
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
              }}
              className="w-10 h-10 rounded-full border border-gray-300"
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* ========================== */}
      {/* 🔔 Notifications Modal */}
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
      {/* ⚡ Quick Actions Modal */}
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
                // router.push("/(invoice)/invoice");
              }}
            >
              <Ionicons name="document-text-outline" size={28} color="#007AFF" />
              <Text className="text-blue-600 mt-1">Invoice</Text>
            </TouchableOpacity>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
