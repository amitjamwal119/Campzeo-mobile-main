import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
} from "react-native";
import { Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { useNavigation } from "@react-navigation/native";
// import { getNotifications } from "";

export default function AllNotifications() {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [tab, setTab] = useState<"All" | "Unread">("All");
  const [loading, setLoading] = useState(false);

  // ---------------- FORMAT API DATA ----------------
  const formatNotification = (item: any) => {
    const dateObj = new Date(item.createdAt);

    return {
      id: item.id,
      title: item.platform || "Notification",
      desc: item.message,
      read: item.isRead,
      time: dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: dateObj.toDateString(), // used for SectionList
    };
  };

  // ---------------- FETCH NOTIFICATIONS ----------------
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications(1, 5);

      const formatted = res.data.notifications.map(formatNotification);
      setNotifications(formatted);
    } catch (error) {
      console.log("Notification API error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ---------------- FILTERS ----------------
  const filtered =
    tab === "All"
      ? notifications
      : notifications.filter((n) => !n.read);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasNotifications = filtered.length > 0;

  // ---------------- MARK AS READ ----------------
  const markAsRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  // ---------------- GROUP BY DATE ----------------
  const grouped = filtered.reduce((acc: any, item) => {
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const sections = Object.keys(grouped).map((date) => ({
    title: date,
    data: grouped[date],
  }));

  return (
    <ThemedView style={{ flex: 1, backgroundColor: "#EEF2FF" }}>
      <ThemedView className="flex-1 px-4 pt-4">

        {/* ---------------- HEADER ---------------- */}
        <View className="flex-row items-center justify-between my-5">
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Notifications
          </Text>

          <View style={{ width: 32 }} />
        </View>

        {/* ---------------- SEARCH + REFRESH ---------------- */}
        <View className="flex-row items-center mb-3">
          <View className="flex-1 flex-row items-center bg-white rounded-full px-4 border border-gray-300 shadow-sm">
            <Ionicons name="search-outline" size={20} color="#777" />
            <TextInput
              placeholder="Search"
              className="flex-1 px-2 text-gray-700"
            />
          </View>

          <TouchableOpacity className="ml-3" onPress={fetchNotifications}>
            <Ionicons name="sync-outline" size={22} color="#444" />
          </TouchableOpacity>
        </View>

        {/* ---------------- TABS ---------------- */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => setTab("All")}
              className={`px-4 py-1 rounded-full ${
                tab === "All" ? "bg-[#dc2626]" : "bg-white"
              }`}
            >
              <Text
                className="font-semibold"
                style={{ color: tab === "All" ? "#fff" : "#374151" }}
              >
                All ({notifications.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTab("Unread")}
              className={`px-4 py-1 rounded-full ${
                tab === "Unread" ? "bg-[#dc2626]" : "bg-white"
              }`}
            >
              <Text
                className="font-semibold"
                style={{ color: tab === "Unread" ? "#fff" : "#374151" }}
              >
                Unread ({unreadCount})
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={markAllAsRead}>
            <Text className="text-[#dc2626] font-medium">
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>

        {/* ---------------- LOADING ---------------- */}
        {loading && (
          <View className="mt-10 items-center">
            <ActivityIndicator size="large" color="#dc2626" />
          </View>
        )}

        {/* ---------------- EMPTY STATE ---------------- */}
        {!loading && !hasNotifications && (
          <View className="flex-1 items-center justify-center mt-10">
            <Ionicons
              name="notifications-off-outline"
              size={70}
              color="#9AA6FF"
            />
            <Text className="text-gray-500 mt-4">
              Looks like there’s nothing here
            </Text>
          </View>
        )}

        {/* ---------------- NOTIFICATION LIST ---------------- */}
        {!loading && hasNotifications && (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderSectionHeader={({ section }) => (
              <Text className="text-gray-500 font-medium mb-2 mt-4">
                {section.title}
              </Text>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => markAsRead(item.id)}
                className={`p-4 mb-2 rounded-2xl shadow-sm ${
                  item.read ? "bg-gray-100" : "bg-white"
                }`}
              >
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">
                      {item.title}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      {item.desc}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-2">
                      {item.time}
                    </Text>
                  </View>

                  {!item.read && (
                    <View className="w-3 h-3 bg-[#dc2626] rounded-full mt-1" />
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </ThemedView>
    </ThemedView>
  );
}
