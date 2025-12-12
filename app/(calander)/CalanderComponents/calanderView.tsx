import React, { useState, useMemo } from "react";
import { View } from "react-native";
import { Calendar } from "react-native-big-calendar";

import { mapEvents } from "./utils/mapEvents";
import { groupEventsByDate } from "./utils/groupEventsByDate";
import { CalendarEvent, Post } from "@/types/types";
import CalendarHeader from "./calanderHeader";
import UpcomingPostsList from "./upcomingPostsList";
import EventModal from "./eventModal";
// import { Button, ButtonText, Heading, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text } from "@gluestack-ui/themed";

interface CalendarViewProps {
  posts: Post[]; // Raw posts loaded by CalendarWrapper
}

const CalendarView: React.FC<CalendarViewProps> = ({ posts }) => {
  // Controls Month / Week / Day View
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  // Controls which date the calendar focuses on
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Event Modal State
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isModalVisible, setModalVisible] = useState(false);

  // Convert backend posts → CalendarEvents format
  const events = useMemo(() => mapEvents(posts), [posts]);

  // Group events by date for upcoming posts list
  const groupedEvents = useMemo(() => groupEventsByDate(events), [events]);

  // When user taps an event in the calendar
  const handleEventPress = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER (View Mode Switcher + Month Label + Navigation) */}
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onChangeView={setViewMode}
        onChangeDate={setCurrentDate}
      />

      {/* MAIN CALENDAR */}
      <Calendar
        events={events}
        mode={viewMode}
        date={currentDate}
        height={520}
        onPressEvent={handleEventPress}
        swipeEnabled={true}
      />

      {/* UPCOMING POSTS LIST BELOW CALENDAR */}
      <UpcomingPostsList groupedEvents={groupedEvents} />

      {/* EVENT MODAL */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default CalendarView;
