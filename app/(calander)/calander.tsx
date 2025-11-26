import React, { useState, useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

type Campaign = {
  title: string;
  time: string;
  platform: string;
};

type CampaignMap = Record<string, Campaign[]>;

export default function CalendarScreen() {
  // ⭐ Dummy campaigns
  const campaignData: CampaignMap = {
    "2025-01-05": [
      { title: "WhatsApp Broadcast – Product Launch", time: "10:00 AM", platform: "WhatsApp" },
      { title: "Facebook Reel – Winter Sale", time: "03:00 PM", platform: "Facebook" },
    ],
    "2025-01-12": [
      { title: "Instagram Post – New Arrivals", time: "11:30 AM", platform: "Instagram" },
    ],
    "2025-01-20": [
      { title: "LinkedIn Article – Growth Story", time: "09:00 AM", platform: "LinkedIn" },
      { title: "Facebook Story – Flash Discount", time: "06:00 PM", platform: "Facebook" },
    ],
  };

  const [selectedDate, setSelectedDate] = useState("");

  // ⭐ Marked Dates
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    Object.keys(campaignData).forEach((date) => {
      marks[date] = { marked: true, dotColor: "orange" };
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: "green",
      };
    }

    return marks;
  }, [selectedDate]);

  const campaignsForDate = selectedDate ? campaignData[selectedDate] || [] : [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Text className="text-center text-2xl font-bold py-4">
        Scheduled Campaigns
      </Text>

      {/* 📅 Calendar */}
      <Calendar
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
      />

      {/* 📜 Campaign List */}
      <View className="flex-1 px-4 mt-4">
        {selectedDate ? (
          <>
            <Text className="text-lg font-semibold mb-3">
              Campaigns on {selectedDate}
            </Text>

            <FlatList
              data={campaignsForDate}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View className="bg-gray-100 p-4 rounded-xl mb-3">
                  <Text className="text-base font-semibold">{item.title}</Text>
                  <Text className="text-gray-500">{item.time}</Text>
                  <Text className="mt-1 text-sm italic text-gray-600">
                    {item.platform}
                  </Text>
                </View>
              )}
              ListEmptyComponent={
                <Text className="text-center text-gray-500 mt-4">
                  No campaigns for this date.
                </Text>
              }
            />
          </>
        ) : (
          <Text className="text-center text-gray-500 mt-8">
            Select a date to view campaigns.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
