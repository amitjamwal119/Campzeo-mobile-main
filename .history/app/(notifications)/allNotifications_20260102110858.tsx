// app/(notifications)/allNotifications.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  View,
} from "react-native";
import { Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { useNavigation } from "@react-navigation/native";
import { getNotificationsApi } from "@/api/notification/notificationApi";
import { useAuth } from "@clerk/clerk-expo";

export default function AllNotifications() {
  const navigation = useNavigation();
  const { getToken } = useAuth();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  // ---------------- FETCH NOTIFICATIONS ----------------
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const res = await getNotificationsApi(token, 1, 50);
      console.log("API Response:", res);

      const notificationsArray =
        res?.data?.notifications && Array.isArray(res.data.notifications)
          ? res.data.notifications
          : [];

      const formatted = notificationsArray.map((item: any) => {
        const dateObj = new Date(item.createdAt);
        return {
          id: item.id,
          title: item.platform || "Notification",
          desc: item.message,
          read: item.isRead,
          time: dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          date: dateObj.toDateString(),
        };
      });

      setNotifications(formatted);
    } catch (error) {
      console.log("Notification API error:", error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ---------------- FILTER + SEARCH ----------------
  const filtered = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.desc.toLowerCase().includes(search.toLowerCase())
  );

  const visibleNotifications = filtered.slice(0, visibleCount);
  const isAllVisible = visibleCount >= filtered.length;

  // ---------------- MARK AS READ ----------------
  const markAsRead = (id: number) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleLoadToggle = () => {
    setVisibleCount(isAllVisible ? 5 : filtered.length);
  };

  return (
    <Pressable onPress={() => { }} className="flex-1">
      <ThemedView style={{ flex: 1, backgroundColor: "#EEF2FF" }} className="px-4 pt-4">
        {/* HEADER */}
        <View className="flex-row items-center justify-between my-5">
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Notifications</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* SEARCH + REFRESH */}
        <View className="flex-row items-center mb-3">
          <View className="flex-1 flex-row items-center bg-white rounded-full px-4 border border-gray-300 shadow-sm">
            <Ionicons name="search-outline" size={20} color="#777" />
            <TextInput
              placeholder="Search notifications..."
              className="flex-1 px-2 text-gray-700"
              value={search}
              onChangeText={(v) => {
                setSearch(v);
                setVisibleCount(5); // reset visible count on search
              }}
            />
          </View>
          <TouchableOpacity className="ml-3" onPress={fetchNotifications}>
            <Ionicons name="sync-outline" size={22} color="#444" />
          </TouchableOpacity>
        </View>

        {/* MARK ALL AS READ */}
        <View className="flex-row justify-end mb-2">
          <TouchableOpacity onPress={markAllAsRead}>
            <Text className="text-[#dc2626] font-medium">Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {/* LOADING */}
        {loading && (
          <View className="mt-10 items-center">
            <ActivityIndicator size="large" color="#dc2626" />
          </View>
        )}

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <View className="flex-1 items-center justify-center mt-10">
            <Ionicons name="notifications-off-outline" size={70} color="#9AA6FF" />
            <Text className="text-gray-500 mt-4">No notifications found</Text>
          </View>
        )}

        {/* NOTIFICATION LIST */}
        {!loading && filtered.length > 0 && (
          <FlatList
            data={visibleNotifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => markAsRead(item.id)}
                className={`p-4 mb-2 rounded-2xl shadow-sm ${item.read ? "bg-gray-100" : "bg-white"
                  }`}
              >
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">{item.title}</Text>
                    <Text className="text-gray-500 text-sm mt-1">{item.desc}</Text>
                    <Text className="text-gray-400 text-xs mt-2">{item.time}</Text>
                  </View>
                  {!item.read && <View className="w-3 h-3 bg-[#dc2626] rounded-full mt-1" />}
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              filtered.length > 5 ? (
                <TouchableOpacity
                  onPress={handleLoadToggle}
                  className={`py-3 my-2 rounded-xl items-center ${isAllVisible ? "bg-red-100" : "bg-blue-100"
                    }`}
                >
                  <Text
                    className={`font-semibold ${isAllVisible ? "text-red-700" : "text-blue-700"
                      }`}
                  >
                    {isAllVisible ? "See Less" : "Load More"}
                  </Text>
                </TouchableOpacity>
              ) : null
            }

        )}
      </ThemedView>
    </Pressable>
  );
}
