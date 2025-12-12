import React from "react";
import { View, Text, FlatList } from "react-native";
import { getDateLabel, formatReadableTime } from "./utils/dateHelpers";
import { CalendarEvent } from "@/types/types";

interface UpcomingPostsListProps {
  groupedEvents: Record<string, CalendarEvent[]>;
}

const UpcomingPostsList: React.FC<UpcomingPostsListProps> = ({ groupedEvents }) => {
  const dateKeys = Object.keys(groupedEvents).sort(); // sorted dates

  if (dateKeys.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text>No upcoming posts.</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
      {dateKeys.map((dateKey) => {
        const eventsForDate = groupedEvents[dateKey];
        const readableDateLabel = getDateLabel(dateKey);

        return (
          <View key={dateKey} style={{ marginBottom: 20 }}>
            {/* DATE HEADER (Today / Dec 9, 2025) */}
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 6 }}>
              {readableDateLabel}
            </Text>

            {/* EVENTS FOR THIS DATE */}
            {eventsForDate.map((event) => (
              <View
                key={event.id}
                style={{
                  padding: 12,
                  marginBottom: 6,
                  borderRadius: 8,
                  backgroundColor: "#f1f1f1",
                }}
              >
                {/* PLATFORM + TITLE */}
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  {event.platform.toUpperCase()} — {event.campaign}
                </Text>

                {/* TIME */}
                <Text style={{ fontSize: 14, color: "#555" }}>
                  {formatReadableTime(event.start)}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
};

export default UpcomingPostsList;
