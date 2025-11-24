import { SafeAreaView } from "react-native-safe-area-context";
import BottomBar from "../(common)/bottomBar";
import Sidebar from "../(common)/sideBar";
import TopBar from "../(common)/topBar";

export default function TabLayout() {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <TopBar />
        <BottomBar />
        <Sidebar />
      </SafeAreaView>
    </>
  );
}

