import { ThemedText } from "@/components/themed-text";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Text, View } from "@gluestack-ui/themed";
import { useState, useMemo, useEffect } from "react";
import {
  TouchableOpacity,
  FlatList,
  View as RNView,
  TextInput,
} from "react-native";
import LogsCard, { LogRecord } from "./logs-Components/logsCards";
import Pagination from "@/app/(common)/pagination";

export default function Logs() {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // 🔥 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // icons----------------------------------------------
  const icons = [
    { name: "mail", label: "Email", library: Ionicons, color: "#E60023" },
    {
      name: "chatbubble-ellipses-outline",
      label: "SMS",
      library: Ionicons,
      color: "#f59e0b",
    },
    {
      name: "instagram",
      label: "Instagram",
      library: FontAwesome,
      color: "#c13584",
    },
    {
      name: "logo-whatsapp",
      label: "Whatsapp",
      library: Ionicons,
      color: "#25D366",
    },
    {
      name: "facebook-square",
      label: "Facebook",
      library: FontAwesome,
      color: "#1877F2",
    },
    {
      name: "youtube-play",
      label: "YouTube",
      library: FontAwesome,
      color: "#FF0000",
    },
    {
      name: "linkedin-square",
      label: "LinkedIn",
      library: FontAwesome,
      color: "#0A66C2",
    },
    {
      name: "pinterest",
      label: "Pinterest",
      library: FontAwesome,
      color: "#E60023",
    },
  ];

  // Logs
  const logs: LogRecord[] = [
    {
      id: 1,
      event: "Campaign Sent",
      recipient: "john@example.com",
      timestamp: "2025-01-10 14:22",
    },
    {
      id: 2,
      event: "Message Delivered",
      recipient: "+91 9876543210",
      timestamp: "2025-01-10 14:25",
    },
    {
      id: 3,
      event: "Instagram Post Published",
      recipient: "Instagram Account",
      timestamp: "2025-01-11 09:45",
    },
    {
      id: 4,
      event: "Email Opened",
      recipient: "alice@example.com",
      timestamp: "2025-01-11 10:02",
    },
    {
      id: 5,
      event: "SMS Failed",
      recipient: "+91 9123456780",
      timestamp: "2025-01-11 10:15",
    },
    {
      id: 6,
      event: "WhatsApp Message Sent",
      recipient: "+91 9988776655",
      timestamp: "2025-01-11 11:30",
    },
    {
      id: 7,
      event: "User Subscribed",
      recipient: "mark@example.com",
      timestamp: "2025-01-11 12:10",
    },
    {
      id: 8,
      event: "Campaign Scheduled",
      recipient: "Marketing Team",
      timestamp: "2025-01-11 13:40",
    },
    {
      id: 9,
      event: "Attachment Downloaded",
      recipient: "sarah@example.com",
      timestamp: "2025-01-11 14:05",
    },
    {
      id: 10,
      event: "Post Boosted",
      recipient: "Facebook Page",
      timestamp: "2025-01-11 15:30",
    },
    {
      id: 11,
      event: "SMS Delivered",
      recipient: "+91 9001122334",
      timestamp: "2025-01-11 16:45",
    },
    {
      id: 12,
      event: "Email Bounced",
      recipient: "invalid@mail.com",
      timestamp: "2025-01-11 17:00",
    },
    {
      id: 13,
      event: "Story Uploaded",
      recipient: "Instagram Account",
      timestamp: "2025-01-12 09:10",
    },
    {
      id: 14,
      event: "Message Queued",
      recipient: "+91 9200112233",
      timestamp: "2025-01-12 09:40",
    },
    {
      id: 15,
      event: "User Unsubscribed",
      recipient: "peter@example.com",
      timestamp: "2025-01-12 10:25",
    },
    {
      id: 16,
      event: "Campaign Paused",
      recipient: "Marketing Dashboard",
      timestamp: "2025-01-12 11:55",
    },
    {
      id: 17,
      event: "Template Updated",
      recipient: "Admin Panel",
      timestamp: "2025-01-12 12:20",
    },
    {
      id: 18,
      event: "Message Read",
      recipient: "+91 8080776655",
      timestamp: "2025-01-12 12:55",
    },
    {
      id: 19,
      event: "Newsletter Sent",
      recipient: "subscriber-list",
      timestamp: "2025-01-12 13:35",
    },
    {
      id: 20,
      event: "Email Clicked",
      recipient: "emma@example.com",
      timestamp: "2025-01-12 14:05",
    }
    ,    
    {
      id: 21,
      event: "New Follower",
      recipient: "Instagram Account",
      timestamp: "2025-01-12 15:10",
    },
    {
      id: 22,
      event: "Comment Replied",
      recipient: "Facebook Page",
      timestamp: "2025-01-12 16:30",
    },
    {
      id: 23,
      event: "Message Deleted",
      recipient: "+91 7654321098",
      timestamp: "2025-01-12 17:20",
    }
  ];

  // Total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(logs.length / itemsPerPage));
  }, [logs.length, itemsPerPage]);

  // Clamp invalid page numbers
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  // Slice paginated logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return logs.slice(startIndex, endIndex);
  }, [logs, currentPage, itemsPerPage]);

  // Button handler
  const handlePageChange = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  // ✨ FLATLIST HEADER COMPONENT (title + icons + search)
  const renderHeader = () => (
    <View>
      {/* PAGE TITLE */}
      <ThemedText
        style={{ fontSize: 30, lineHeight: 36, fontWeight: 700 }}
        className="text-center mt-5 mb-9"
      >
        Logs
      </ThemedText>

      {/* ICONS */}
      <View className="flex-row flex-wrap justify-between mb-4">
        {icons.map((icon, index) => {
          const IconComponent = icon.library;
          const isSelected = selected === icon.label;

          return (
            <View key={index} className="w-1/4 mb-6 items-center">
              <RNView
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: icon.color,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: isSelected ? 0.5 : 0,
                  shadowRadius: isSelected ? 12 : 0,
                  elevation: isSelected ? 12 : 0,
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelected(icon.label)}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: icon.color,
                    backgroundColor: "#ffffff",
                  }}
                >
                  <IconComponent
                    name={icon.name as any}
                    size={28}
                    color={icon.color}
                  />
                </TouchableOpacity>
              </RNView>

              <Text className="mt-2 text-center text-sm font-medium">
                {icon.label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* SEARCH + SHARE */}
      <View className="flex-row items-center mb-4">
        <TextInput
          value={search}
          placeholder="Search campaigns..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white mr-2"
        />
        <TouchableOpacity className="px-3 py-2 rounded-xl bg-green-100 mr-2">
          <Ionicons name="share-social" size={20} color="#16a34a" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 p-3">
      <FlatList<LogRecord>
        data={paginatedLogs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <LogsCard record={item} />}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={() => (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
