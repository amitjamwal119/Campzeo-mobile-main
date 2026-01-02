import { useState } from "react";
import { View, TextInput, TouchableOpacity, SectionList } from "react-native";
import { Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { useNavigation } from "@react-navigation/native";

// ---------------- SAMPLE NOTIFICATIONS ----------------
const sampleNotifications = [
  { id: 1, title: "New Course Material Available", desc: "Check out the latest lecture slides", time: "2 mins ago", date: "Today", read: false },
  { id: 2, title: "Upcoming Assignment Deadline", desc: "Don't forget to submit Biology", time: "30 mins ago", date: "Today", read: false },
  { id: 3, title: "Important Announcement", desc: "Webinar on AI Ethics", time: "1 day ago", date: "Yesterday", read: true },
  { id: 4, title: "Recommended Reading Material", desc: "New lecture slides uploaded", time: "1 day ago", date: "Yesterday", read: true },
];

export default function AllNotifications() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [tab, setTab] = useState("All");

  const filtered = tab === "All" ? notifications : notifications.filter(n => !n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const hasNotifications = filtered.length > 0;

  const grouped = filtered.reduce((acc: any, item) => {
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});
  const sections = Object.keys(grouped).map(date => ({ title: date, data: grouped[date] }));

  return (
    <ThemedView style={{ flex: 1, backgroundColor: "#EEF2FF" }}>
      <ThemedView className="flex-1 px-4 pt-4">

        {/* ---------------- CUSTOM HEADER ---------------- */}
        <View className="flex-row items-center justify-between my-5">
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          {/* <Text
            className="text-center flex-1"
            style={{ fontSize: 18, fontWeight: "bold" }}
          >
            Notifications
          </Text> */}

          <View style={{ width: 32 }} />
        </View>

        {/* ---------------- SEARCH ---------------- */}
        <View className="flex-row items-center mb-3">
          <View className="flex-1 flex-row items-center bg-white rounded-full px-4 py-0 border border-gray-300 shadow-sm">
            <Ionicons name="search-outline" size={20} color="#777" />
            <TextInput placeholder="Search" className="flex-1 px-2 text-gray-700" />
          </View>
          <TouchableOpacity className="ml-3" onPress={() => alert("Refresh")}>
            <Ionicons name="sync-outline" size={22} color="#444" />
          </TouchableOpacity>
        </View>

        {/* ---------------- TABS ---------------- */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => setTab("All")}
              className={`px-4 py-1 rounded-full ${tab === "All" ? "bg-[#d55b35]" : "bg-white"}`}
            >
              <Text style={{ color: tab === "All" ? "#FFFFFF" : "#374151" }} className="font-semibold">
                All ({notifications.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTab("Unread")}
              className={`px-4 py-1 rounded-full ${tab === "Unread" ? "bg-[#d55b35]" : "bg-white"}`}
            >
              <Text style={{ color: tab === "Unread" ? "#FFFFFF" : "#374151" }} className="font-semibold">
                Unread ({unreadCount})
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={markAllAsRead}>
            <Text className="text-[#d55b35] font-medium">Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {/* ---------------- EMPTY STATE ---------------- */}
        {!hasNotifications && (
          <View className="flex-1 items-center justify-center mt-10">
            <Ionicons name="notifications-off-outline" size={70} color="#9AA6FF" />
            <Text className="text-gray-500 mt-4 text-base">Looks like there’s nothing here</Text>
          </View>
        )}

        {/* ---------------- NOTIFICATION LIST ---------------- */}
        {hasNotifications && (
          <SectionList
            sections={sections}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderSectionHeader={({ section }) => (
              <Text className="text-gray-500 font-medium mb-2 mt-4">{section.title}</Text>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => markAsRead(item.id)}
                className={`p-4 mb-2 rounded-2xl shadow-sm ${item.read ? "bg-gray-100" : "bg-white"}`}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">{item.title}</Text>
                    <Text className="text-gray-500 text-sm mt-1">{item.desc}</Text>
                    <Text className="text-gray-400 text-xs mt-2">{item.time}</Text>
                  </View>
                  {!item.read && <View className="w-3 h-3 bg-[#d55b35] rounded-full mt-1" />}
                </View>
              </TouchableOpacity>
            )}
          />
        )}

      </ThemedView>
    </ThemedView>
  );
}
