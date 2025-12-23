import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
// import { CalendarHeaderProps } from "react-native-calendars/src/calendar/header";
// <ion-icon name="chevron-back-circle-outline"></ion-icon>
interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: "month" | "week" | "day";
  onChangeView: (mode: "month" | "week" | "day") => void;
  onChangeDate: (date: Date) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewMode,
  onChangeView,
  onChangeDate,
}) => {
  // Compute Month Name: "December 2025"
  const monthLabel = format(currentDate, "MMMM yyyy");

  // Navigation handling
  const handlePrev = () => {
    if (viewMode === "month") onChangeDate(addMonths(currentDate, -1));
    else if (viewMode === "week") onChangeDate(addWeeks(currentDate, -1));
    else if (viewMode === "day") onChangeDate(addDays(currentDate, -1));
  };

  const handleNext = () => {
    if (viewMode === "month") onChangeDate(addMonths(currentDate, 1));
    else if (viewMode === "week") onChangeDate(addWeeks(currentDate, 1));
    else if (viewMode === "day") onChangeDate(addDays(currentDate, 1));
  };

  return (
    <ThemedView style={{ padding: 12, flexDirection: "column", gap: 10 }}>
      {/* TOP ROW: month name + arrows */}
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Prev Button */}
        <TouchableOpacity onPress={handlePrev}>
          <Text style={{ fontSize: 18 }}>
            {/* {"<"} */}
            {/* <IconSymbol name="arrow-left" size={40} color="#D55B35" /> */}
            <CircleChevronLeft size={35} color="#D55B35" />
          </Text>
        </TouchableOpacity>

        {/* Current Month Label */}
        <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>{monthLabel}</ThemedText>

        {/* Next Button */}
        <TouchableOpacity onPress={handleNext}>
          <ThemedText style={{ fontSize: 18 }}>
            
            <CircleChevronRight size={35} color="#D55B35" />
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* VIEW MODE BUTTONS */}
      <ThemedView style={{ flexDirection: "row", justifyContent: "center", gap: 15 }}>
        <TouchableOpacity onPress={() => onChangeView("month")}>
          <ThemedText
            style={{
              fontWeight: viewMode === "month" ? "bold" : "normal",
              fontSize: 16,
            }}
          >
            Month
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onChangeView("week")}>
          <ThemedText
            style={{
              fontWeight: viewMode === "week" ? "bold" : "normal",
              fontSize: 16,
            }}
          >
            Week
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onChangeView("day")}>
          <ThemedText
            style={{
              fontWeight: viewMode === "day" ? "bold" : "normal",
              fontSize: 16,
            }}
          >
            Day
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

export default CalendarHeader;
