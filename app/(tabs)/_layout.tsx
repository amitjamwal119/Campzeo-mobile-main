import { SafeAreaView } from "react-native-safe-area-context";
import BottomBar from "../(common)/bottomBar";
import Sidebar from "../(common)/sideBar";
import TopBar from "../(common)/topBar";
// import { useAuth } from "@clerk/clerk-expo";
// import { Redirect } from "expo-router";



export default function TabLayout() {
//  const { isSignedIn, isLoaded } = useAuth();

  // Wait until Clerk loads (prevents flicker)
  // if (!isLoaded) return null;

  // If user is NOT signed in → go to sign-in page
  // if (!isSignedIn) {
  //   return <Redirect href="/(auth)/SignInScreen" />;
  // }

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

