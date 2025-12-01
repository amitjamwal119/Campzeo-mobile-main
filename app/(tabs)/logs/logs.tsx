import { ThemedText } from "@/components/themed-text";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { View, Text } from "@gluestack-ui/themed";
import { useState } from "react";
import {
  TouchableOpacity,
  ScrollView,
  View as RNView,
  FlatList,
  TextInput,
} from "react-native";
import LogsCard, { LogRecord } from "./logs-Components/logsCards";
import Pagination from "@/app/(common)/pagination";

export default function Logs() {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const icons = [
    { name: "mail", label: "Email", library: Ionicons, color: "#f59e0b" },
    {
      name: "chatbubble-ellipses-outline",
      label: "SMS",
      library: Ionicons,
      color: "#10b981",
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

  // Dummy Logs
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
  ];

  return (
    <View className="flex-1 p-3">
      <ScrollView>
        <ThemedText
          style={{ fontSize: 30, lineHeight: 36, fontWeight: 700 }}
          className="text-center mt-5 mb-9"
        >
          Logs
        </ThemedText>

        {/* ------------ ICON SECTION ------------- */}
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
                      borderColor: isSelected ? icon.color : "#d1d5db",
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

        {/* ------------ LOGS CARD LIST (BELOW ICONS) ------------- */}
        <View className="flex-row items-center mb-4">
          {/* Search */}
          <TextInput
            value={search}
            // onChangeText={(value) => {
            //   setSearch(value);
            //   setPage(1);
            // }}
            placeholder="Search campaigns..."
            className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white mr-2"
          />

          {/* Share */}
          <TouchableOpacity
            // onPress={handleShare}
            className="px-3 py-2 rounded-xl bg-green-100 mr-2"
          >
            <Ionicons name="share-social" size={20} color="#16a34a" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={logs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <LogsCard record={item} />}
          scrollEnabled={false}
        />

        <Pagination />
      </ScrollView>
    </View>
  );
}
