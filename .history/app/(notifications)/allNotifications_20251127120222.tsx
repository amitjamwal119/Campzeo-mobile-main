// import { FlatList, ListRenderItem } from "react-native";
// import {
//   Box,
//   Text,
//   HStack,
//   VStack,
//   Button,
//   ButtonText,
// } from "@gluestack-ui/themed";
// import { Bell } from "lucide-react-native";
// import { ThemedText } from "@/components/themed-text";

// /** Notification type */
// type NotificationItem = {
//   id: number;
//   title: string;
//   message: string;
//   time: string;
// };

// export default function AllNotifications() {
//   // -------- Fake 5 Notifications --------
//   const notificationsData: NotificationItem[] = [
//     {
//       id: 1,
//       title: "New Campaign Created 🎉",
//       message: "Your campaign 'Winter Promo' is now live.",
//       time: "2 minutes ago",
//     },
//     {
//       id: 2,
//       title: "3 New Leads Added 🔥",
//       message: "You received 3 new leads from Google Ads.",
//       time: "10 minutes ago",
//     },
//     {
//       id: 3,
//       title: "Message from Admin",
//       message: "Your account permissions were updated.",
//       time: "30 minutes ago",
//     },
//     {
//       id: 4,
//       title: "Reminder",
//       message: "Follow up with client John today.",
//       time: "1 hour ago",
//     },
//     {
//       id: 5,
//       title: "New Feature Update",
//       message: "Analytics dashboard has been improved.",
//       time: "2 hours ago",
//     },
//   ];

//   // Typed renderItem for FlatList
//   const renderItem: ListRenderItem<NotificationItem> = ({ item }) => (
//     <HStack className="px-4 py-3 items-start gap-3">
//       {/* ICON */}
//       <Box className="bg-primary-100 p-2 rounded-full">
//         <Bell size={18} color="#dc2626" />
//       </Box>

//       {/* TEXT */}
//       <VStack className="flex-1">
//         <Text className="text-base font-medium text-typography-900">
//           {item.title}
//         </Text>
//         <Text className="text-sm text-typography-600 mt-1">{item.message}</Text>
//         <Text className="text-xs text-typography-500 mt-1">{item.time}</Text>
//       </VStack>
//     </HStack>
//   );

//   // Separator
//   const ItemSeparator = () => <Box className="h-[1px] bg-gray-200 my-1" />;

//   return (
//     <>
//       <Box className="flex-1 bg-white">
//         {/* HEADER */}
//         <HStack className="items-center justify-center p-4 border-b border-gray-200 bg-white">
//           <ThemedText
//             style={{ fontSize: 30, fontWeight: 700 }}
//             className="text-center my-3"
//           >
//             All Notifications
//           </ThemedText>
//           <Box className="w-8" />
//         </HStack>

//         {/* NOTIFICATIONS LIST */}

//         <VStack>
//           <FlatList
//             data={notificationsData}
//             keyExtractor={(item) => item.id.toString()}
//             contentContainerStyle={{ paddingVertical: 12 }}
//             ItemSeparatorComponent={ItemSeparator}
//             renderItem={renderItem}
//             initialNumToRender={5}
//           />

//           {/* ----------------------------- */}
//           {/*      PAGINATION UI ONLY       */}
//           {/* ----------------------------- */}
//           <HStack className="items-center justify-center gap-4 py-4 border-t border-gray-200 bg-white">
//             <Button
//               variant="outline"
//               size="sm"
//               className="px-4"
//               // disabled visual only
//             >
//               <ButtonText>Previous</ButtonText>
//             </Button>

//             <Text className="text-sm font-medium">Page 1 / 3</Text>

//             <Button variant="outline" size="sm" className="px-4">
//               <ButtonText>Next</ButtonText>
//             </Button>
//           </HStack>
//         </VStack>
//       </Box>
//     </>
//   );
// }



// Vik code 
// Old method -------------------------------------------------------------------------------------------------------------------
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
    SafeAreaView,
    SectionList,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// ---------------- SAMPLE NOTIFICATIONS ----------------
const sampleNotifications = [
  { id: 1, title: "New Course Material Available", desc: "Check out the latest lecture slides", time: "2 mins ago", date: "Today", read: false },
  { id: 2, title: "Upcoming Assignment Deadline", desc: "Don't forget to submit Biology", time: "30 mins ago", date: "Today", read: false },
  { id: 3, title: "Important Announcement", desc: "Webinar on AI Ethics", time: "1 day ago", date: "Yesterday", read: true },
  { id: 4, title: "Recommended Reading Material", desc: "New lecture slides uploaded", time: "1 day ago", date: "Yesterday", read: true },
];

// ---------------- HIDE EXPO ROUTER HEADER ----------------


// ---------------- COMPONENT ----------------
export default function Notifications() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [tab, setTab] = useState("All");

  const filtered = tab === "All" ? notifications : notifications.filter(n => !n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const hasNotifications = filtered.length > 0;

  const grouped = filtered.reduce((acc: any, item) => {
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});
  const sections = Object.keys(grouped).map(date => ({ title: date, data: grouped[date] }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EEF2FF" }}>
      <ThemedView className="flex-1 px-4">
        {/* ---------------- CUSTOM HEADER ---------------- */}
        <View className="flex-row items-center justify-between my-5">
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-center flex-1">
            Notifications
          </Text>

          <View style={{ width: 32 }} /> {/* Placeholder for alignment */}
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
              className={`px-4 py-1 rounded-full ${tab === "All" ? "bg-[#dc2626]" : "bg-white"}`}
            >
              <Text style={{ color: tab === "All" ? "#FFFFFF" : "#374151" }} className="font-semibold">
                All ({notifications.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTab("Unread")}
              className={`px-4 py-1 rounded-full ${tab === "Unread" ? "bg-[#dc2626]" : "bg-white"}`}
            >
              <Text style={{ color: tab === "Unread" ? "#FFFFFF" : "#374151" }} className="font-semibold">
                Unread ({unreadCount})
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={markAllAsRead}>
            <Text className="text-[#dc2626] font-medium">Mark all as read</Text>
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
                  {!item.read && <View className="w-3 h-3 bg-[#dc2626] rounded-full mt-1" />}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}


// Flatlist code ------- new approach --------------------------------------------------------------------------------------------


// import React, { useState } from "react";
// import {
//   TouchableOpacity,
//   TextInput,
//   View,
//   SectionList,
// } from "react-native";
// import { Text } from "@gluestack-ui/themed";
// import { Ionicons } from "@expo/vector-icons";
// import { ThemedView } from "@/components/themed-view";
// import { useNavigation } from "@react-navigation/native";

// // Sample notifications
// const sampleNotifications = [
//   {
//     id: 1,
//     title: "New Course Material Available",
//     desc: "Check out the latest lecture slides",
//     time: "2 mins ago",
//     date: "Today",
//     read: false,
//   },
//   {
//     id: 2,
//     title: "Upcoming Assignment Deadline",
//     desc: "Don't forget to submit Biology",
//     time: "30 mins ago",
//     date: "Today",
//     read: false,
//   },
//   {
//     id: 3,
//     title: "Important Announcement",
//     desc: "Webinar on AI Ethics",
//     time: "1 day ago",
//     date: "Yesterday",
//     read: true,
//   },
//   {
//     id: 4,
//     title: "Recommended Reading Material",
//     desc: "New lecture slides uploaded",
//     time: "1 day ago",
//     date: "Yesterday",
//     read: true,
//   },
// ];

// export default function Notifications() {
//   const navigation = useNavigation();
//   const [notifications, setNotifications] = useState(sampleNotifications);
//   const [tab, setTab] = useState("All");

//   const filtered =
//     tab === "All" ? notifications : notifications.filter((n) => !n.read);

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const markAsRead = (id: number) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//   };

//   const markAllAsRead = () => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//   };

//   const hasNotifications = filtered.length > 0;

//   // Convert grouped sections into SectionList format
//   const sections = Object.entries(
//     filtered.reduce((acc: any, item) => {
//       acc[item.date] = acc[item.date] || [];
//       acc[item.date].push(item);
//       return acc;
//     }, {})
//   ).map(([date, items]) => ({
//     title: date,
//     data: items,
//   }));

//   return (
//     <ThemedView className="flex-1 bg-[#EEF2FF] px-4 pt-3">
//       {/* CUSTOM HEADER */}
//       <View className="flex-row items-center justify-between mb-3">
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={22} color="#333" />
//         </TouchableOpacity>
//         <Text className="text-lg font-semibold">Notifications</Text>
//         <TouchableOpacity>
//           <Ionicons name="settings-outline" size={22} color="#333" />
//         </TouchableOpacity>
//       </View>

//       {/* SEARCH + REFRESH */}
//       <View className="flex-row items-center bg-white rounded-full px-4 py-2 mb-3 shadow-sm">
//         <Ionicons name="search-outline" size={20} color="#777" />
//         <TextInput placeholder="Search" className="flex-1 px-2 text-gray-700" />
//         <TouchableOpacity>
//           <Ionicons name="refresh-outline" size={22} color="#444" />
//         </TouchableOpacity>
//       </View>

//       {/* TABS */}
//       <View className="flex-row items-center justify-between mb-3">
//         <View className="flex-row space-x-2">
//           <TouchableOpacity
//             onPress={() => setTab("All")}
//             className={`px-4 py-1 rounded-full ${
//               tab === "All" ? "bg-[#516BFF]" : "bg-white"
//             }`}
//           >
//             <Text className={`${tab === "All" ? "text-white" : "text-gray-700"}`}>
//               All ({notifications.length})
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => setTab("Unread")}
//             className={`px-4 py-1 rounded-full ${
//               tab === "Unread" ? "bg-[#516BFF]" : "bg-white"
//             }`}
//           >
//             <Text
//               className={`${tab === "Unread" ? "text-white" : "text-gray-700"}`}
//             >
//               Unread ({unreadCount})
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity onPress={markAllAsRead}>
//           <Text className="text-[#516BFF] font-medium">Mark all as read</Text>
//         </TouchableOpacity>
//       </View>

//       {/* EMPTY STATE */}
//       {!hasNotifications && (
//         <View className="flex-1 items-center justify-center mt-10">
//           <Ionicons name="notifications-off-outline" size={70} color="#9AA6FF" />
//           <Text className="text-gray-500 mt-4 text-base">
//             Looks like there’s nothing here
//           </Text>
//         </View>
//       )}

//       {/* NOTIFICATION LIST USING SECTIONLIST */}
//       {hasNotifications && (
//         <SectionList
//           sections={sections}
//           keyExtractor={(item) => item.id.toString()}
//           showsVerticalScrollIndicator={false}
//           renderSectionHeader={({ section }) => (
//             <Text className="text-gray-500 font-medium mb-2 mt-4">
//               {section.title}
//             </Text>
//           )}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() => markAsRead(item.id)}
//               className={`p-4 mb-2 rounded-2xl shadow-sm ${
//                 item.read ? "bg-white/60" : "bg-white"
//               }`}
//             >
//               <View className="flex-row justify-between items-start">
//                 <View className="flex-1">
//                   <Text className="font-semibold text-gray-800">
//                     {item.title}
//                   </Text>
//                   <Text className="text-gray-500 text-sm mt-1">{item.desc}</Text>
//                   <Text className="text-gray-400 text-xs mt-2">{item.time}</Text>
//                 </View>

//                 {!item.read && (
//                   <View className="w-3 h-3 bg-[#516BFF] rounded-full mt-1" />
//                 )}
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       )}
//     </ThemedView>
//   );
// }
