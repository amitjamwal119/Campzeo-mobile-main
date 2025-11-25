import { FlatList, ListRenderItem } from "react-native";
import {
  Box,
  Text,
  HStack,
  VStack,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { Bell } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";

/** Notification type */
type NotificationItem = {
  id: number;
  title: string;
  message: string;
  time: string;
};

export default function AllNotifications() {
  // -------- Fake 5 Notifications --------
  const notificationsData: NotificationItem[] = [
    {
      id: 1,
      title: "New Campaign Created 🎉",
      message: "Your campaign 'Winter Promo' is now live.",
      time: "2 minutes ago",
    },
    {
      id: 2,
      title: "3 New Leads Added 🔥",
      message: "You received 3 new leads from Google Ads.",
      time: "10 minutes ago",
    },
    {
      id: 3,
      title: "Message from Admin",
      message: "Your account permissions were updated.",
      time: "30 minutes ago",
    },
    {
      id: 4,
      title: "Reminder",
      message: "Follow up with client John today.",
      time: "1 hour ago",
    },
    {
      id: 5,
      title: "New Feature Update",
      message: "Analytics dashboard has been improved.",
      time: "2 hours ago",
    },
  ];

  // Typed renderItem for FlatList
  const renderItem: ListRenderItem<NotificationItem> = ({ item }) => (
    <HStack className="px-4 py-3 items-start gap-3">
      {/* ICON */}
      <Box className="bg-primary-100 p-2 rounded-full">
        <Bell size={18} color="#D55B35" />
      </Box>

      {/* TEXT */}
      <VStack className="flex-1">
        <Text className="text-base font-medium text-typography-900">
          {item.title}
        </Text>
        <Text className="text-sm text-typography-600 mt-1">{item.message}</Text>
        <Text className="text-xs text-typography-500 mt-1">{item.time}</Text>
      </VStack>
    </HStack>
  );

  // Separator
  const ItemSeparator = () => <Box className="h-[1px] bg-gray-200 my-1" />;

  return (
    <>
      <Box className="flex-1 bg-white">
        {/* HEADER */}
        <HStack className="items-center justify-center p-4 border-b border-gray-200 bg-white">
          <ThemedText
            style={{ fontSize: 30, fontWeight: 700 }}
            className="text-center my-3"
          >
            All Notifications
          </ThemedText>
          <Box className="w-8" />
        </HStack>

        {/* NOTIFICATIONS LIST */}

        <VStack>
          <FlatList
            data={notificationsData}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingVertical: 12 }}
            ItemSeparatorComponent={ItemSeparator}
            renderItem={renderItem}
            initialNumToRender={5}
          />

          {/* ----------------------------- */}
          {/*      PAGINATION UI ONLY       */}
          {/* ----------------------------- */}
          <HStack className="items-center justify-center gap-4 py-4 border-t border-gray-200 bg-white">
            <Button
              variant="outline"
              size="sm"
              className="px-4"
              // disabled visual only
            >
              <ButtonText>Previous</ButtonText>
            </Button>

            <Text className="text-sm font-medium">Page 1 / 3</Text>

            <Button variant="outline" size="sm" className="px-4">
              <ButtonText>Next</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </Box>
    </>
  );
}
