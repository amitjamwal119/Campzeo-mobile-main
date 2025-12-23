import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";

import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { useState } from "react";
import CalendarWrapper from "@/app/(common)/calendarWrapper";
import Insights from "./dashboardComponents/insights";

export default function Dashboard() {
  const routePage = useRouter();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const FirstRoute = () => (
    <View style={{ flex: 1 }}>
      <Insights/>
    </View>
  );

  const SecondRoute = () => (
    <View style={{ flex: 1}} >
      <CalendarWrapper />
        </View>

  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const routes = [
    { key: "first", title: "Dashboard" },
    { key: "second", title: "Calendar" },
  ];
  
  return (
    <>
      <ThemedView className="flex-1">

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
      </ThemedView>
    </>
  );
}
