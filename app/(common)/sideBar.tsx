// backgroundolor={colorScheme === "dark" ? "#ffffff" : "#020617"}
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
  VStack,
} from "@gluestack-ui/themed";
import { LogOut, User, Calendar, Notebook } from "lucide-react-native";
import { StyleSheet, useColorScheme } from "react-native";
import { useSidebarStore } from "../../store/sidebarStore";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useAuth, useUser } from "@clerk/clerk-expo";

export default function Sidebar() {
  const sidebarOpen = useSidebarStore((state) => state.sidebarOpen);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);

  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <Drawer isOpen={sidebarOpen} onClose={closeSidebar} anchor="right">
        <DrawerBackdrop />

        {/* DrawerContent DOES NOT accept `style`, only className */}
        <DrawerContent
          className={`w-[270px] md:w-[300px] ${
            isDark ? "bg-[#020617]" : "bg-white"
          }`}
        >
          {/* HEADER */}
          <DrawerHeader className="justify-center flex-col gap-2">
            <ThemedView style={styles.headerContent}>
              <Avatar size="xl">
                <AvatarFallbackText>
                  {user.username ?? "User"}
                </AvatarFallbackText>
                <AvatarImage source={{ uri: user.imageUrl }} />
              </Avatar>

              <VStack style={styles.userInfo}>
                {/* ThemedText DOES NOT support `size` */}
                <ThemedText type="subtitle">{user.username}</ThemedText>
              </VStack>
            </ThemedView>
          </DrawerHeader>

          <Divider style={styles.divider} />

          {/* BODY */}
          <DrawerBody>
            <ThemedView className="gap-3">
              {/* PROFILE */}
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  closeSidebar();
                  router.push("/(profile)/userProfile");
                }}
              >
                <Icon
                  as={User}
                  size="lg"
                  color={isDark ? "#e5e7eb" : "#374151"}
                />
                <ThemedText>My Profile</ThemedText>
              </Pressable>

              {/* ACCOUNTS */}
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  closeSidebar();
                  router.push("/(accounts)/accounts");
                }}
              >
                <Icon
                  as={Notebook}
                  size="lg"
                  color={isDark ? "#e5e7eb" : "#374151"}
                />
                <ThemedText>Accounts</ThemedText>
              </Pressable>

              {/* CALENDAR */}
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  closeSidebar();
                  router.push("/(calander)/calanderPage");
                }}
              >
                <Icon
                  as={Calendar}
                  size="lg"
                  color={isDark ? "#e5e7eb" : "#374151"}
                />
                <ThemedText>Calendar</ThemedText>
              </Pressable>
            </ThemedView>
          </DrawerBody>

          {/* FOOTER */}
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
    </>
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
  divider: {
    marginVertical: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 8,
  },
  logoutButton: {
    width: "100%",
    gap: 8,
  },
});
