import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CalendarEvent } from "@/types/types";
import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { formatReadableTime, getDateLabel } from "../../../utils/dateHelpers";

interface UpcomingPostsListProps {
  groupedEvents: Record<string, CalendarEvent[]>;
}

const UpcomingPostsList: React.FC<UpcomingPostsListProps> = ({
  groupedEvents,
}) => {
  const dateKeys = Object.keys(groupedEvents).sort();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (dateKeys.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <ThemedText>No upcoming posts.</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        {dateKeys.map((dateKey) => {
          const eventsForDate = groupedEvents[dateKey];
          const readableDateLabel = getDateLabel(dateKey);

          return (
            <ThemedView key={dateKey} style={styles.dateSection}>
              {/* DATE HEADER */}
              <ThemedText
                style={[
                  styles.dateHeader,
                  { color: isDark ? "#e5e7eb" : "#020617" },
                ]}
              >
                {readableDateLabel}
              </ThemedText>

              {/* EVENTS */}
              {eventsForDate.map((event) => (
                <ThemedView
                  key={event.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDark ? "#020617" : "#ffffff",
                      borderColor: isDark ? "#1f2933" : "#e5e7eb",
                    },
                  ]}
                >
                  {/* PLATFORM + CAMPAIGN */}
                  <ThemedText
                    style={[
                      styles.title,
                      { color: isDark ? "#f9fafb" : "#020617" },
                    ]}
                  >
                    {event.platform.toUpperCase()} — {event.campaign}
                  </ThemedText>

                  {/* TIME */}
                  <ThemedText
                    style={[
                      styles.time,
                      { color: isDark ? "#9ca3af" : "#6b7280" },
                    ]}
                  >
                    {formatReadableTime(event.start)}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          );
        })}
      </ThemedView>
    </ScrollView>
  );
};

export default UpcomingPostsList;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  dateSection: {
    marginBottom: 14,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  card: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
  },
});
