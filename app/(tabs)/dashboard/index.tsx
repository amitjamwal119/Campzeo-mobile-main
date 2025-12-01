import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";

import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { useState } from "react";
import CalendarComponent from "@/app/(common)/calenderComponent";

export default function Dashboard() {
  const routePage = useRouter();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: "#ff4081" }}>
      <CalendarComponent/>
    </View>
  );

  const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const routes = [
    { key: "first", title: "Calendar" },
    { key: "second", title: "Second" },
  ];
  
  return (
    <>
      <ThemedView className="flex-1">
          <ThemedText
            style={{ fontSize: 30, lineHeight: 36, fontWeight: 700 }}
            className="text-center mt-5 mb-9"
          >
            Dashboard
          </ThemedText>

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />

          <Button
            onPress={() => {
              routePage.push("/(auth)/SignInScreen");
            }}
          >
            <ThemedText>Go to Signin Page</ThemedText>
          </Button>
      </ThemedView>
    </>
  );
}
