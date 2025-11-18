import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomBar from "../common/bottomBar";
import TopBar from "../common/topBar";
// import { useSidebarStore } from "@/store/sidebarStore";
// import Sidebar from "../common/sideBar";



export default function TabLayout() {
// const sidebarOpen = useSidebarStore((s) => s.sidebarOpen);
//   const closeSidebar = useSidebarStore((s) => s.closeSidebar);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
   <TopBar />
           {/* <Sidebar open ={sidebarOpen} close ={closeSidebar}/> */}

   <BottomBar />
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