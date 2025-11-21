import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomBar from "../common/bottomBar";
import Sidebar from "../common/sideBar";
import TopBar from "../common/topBar";

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <TopBar />
      <BottomBar />
      <Sidebar />
    </SafeAreaView>
  );
}



// <ion-icon name="stats-chart"></ion-icon>
// <ion-icon name="mail"></ion-icon>
// <ion-icon name="book-outline"></ion-icon>
// <ion-icon name="map"></ion-icon>
// <Ionicons name="document-text"></ion-icon>









// <ion-icon name="create"></ion-icon>
// <ion-icon name="trash"></ion-icon>
// <ion-icon name="notifications"></ion-icon>
// <ion-icon name="layers"></ion-icon>
// <ion-icon name="log-out"></ion-icon>