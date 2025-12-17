import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonIcon,
  ButtonText,
  Divider,
  Icon,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import {
  LogOut,
  User,
  Settings,
  Calendar,
  Notebook,
} from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { useSidebarStore } from "../../store/sidebarStore";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@clerk/clerk-expo";

export default function Sidebar() {
  const sidebarOpen = useSidebarStore((state) => state.sidebarOpen);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);

  const routePage = useRouter();

  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(); // Clears the session
      router.replace("/(auth)/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Drawer isOpen={sidebarOpen} onClose={closeSidebar} anchor="right">
      <DrawerBackdrop />
      <DrawerContent className="w-[270px] md:w-[300px]">
        {/*  rounded-l-2xl overflow-hidden */}
        <DrawerHeader className="justify-center flex-col gap-2">
          <View style={styles.headerContent}>
            <Avatar size="xl">
              <AvatarFallbackText>Amit Jamwal</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: "https://i.pravatar.cc/300?img=12",
                }}
              />
            </Avatar>
            <VStack style={styles.userInfo}>
              <Text size="lg">Amit Jamwal</Text>
              {/* <Text size="sm" style={styles.emailText}>
                abc@gmail.com
              </Text> */}
            </VStack>
          </View>
        </DrawerHeader>
        <Divider style={styles.divider} />
        <DrawerBody>
          <ThemedView className="justify-center align-middle gap-3">
            {/* ===Profile=== */}
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                closeSidebar();
                routePage.push("/(profile)/userProfile");
              }}
            >
              <Icon as={User} size="lg" style={styles.icon} />
              <Text>My Profile</Text>
            </Pressable>

            {/* ===Accounts=== */}
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                closeSidebar();
                routePage.push("/(accounts)/accounts");
              }}
            >
              <Icon as={Notebook} size="lg" style={styles.icon} />
              <Text>Accounts</Text>
            </Pressable>

            {/* <Pressable
            style={styles.menuItem}
            onPress={closeSidebar}
          >
            <Icon as={LineChartIcon} size="lg" style={styles.icon} />
            <Text>Invoices</Text>
          </Pressable> */}

            {/* ===Calander=== */}

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                closeSidebar();
                routePage.push("/(calander)/calanderPage");
              }}
            >
              <Icon as={Calendar} size="lg" style={styles.icon} />
              <Text>Calendar</Text>
            </Pressable>

            {/* ===Settings=== */}

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                closeSidebar();
                routePage.push("/(settings)/settings");
              }}
            >
              <Icon as={Settings} size="lg" style={styles.icon} />
              <Text>Settings</Text>
            </Pressable>
          </ThemedView>
        </DrawerBody>
        <DrawerFooter>
          <Button
            style={styles.logoutButton}
            variant="outline"
            action="secondary"
            onPress={() => {
              closeSidebar();
              handleLogout();
            }}
          >
            <ButtonText>Logout</ButtonText>
            <ButtonIcon as={LogOut} />
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  userInfo: {
    alignItems: "center",
    justifyContent: "center",
  },
  emailText: {
    color: "#666",
  },
  divider: {
    marginVertical: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 8,
    borderRadius: 8,
  },
  icon: {
    color: "#666",
  },
  logoutButton: {
    width: "100%",
    gap: 8,
  },
});
