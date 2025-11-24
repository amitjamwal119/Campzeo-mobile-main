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
    Home,
    LogOut,
    User,
    Wallet,
    Settings,
    Layers,
    Calendar,
    LineChartIcon,
} from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { useSidebarStore } from "../../store/sidebarStore";

export default function Sidebar() {
  const sidebarOpen = useSidebarStore((state) => state.sidebarOpen);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);

  return (
    <Drawer
      isOpen={sidebarOpen}
      onClose={closeSidebar}
      anchor="right"
    >
      <DrawerBackdrop />
      <DrawerContent className="w-[270px] md:w-[300px]">
        <DrawerHeader className="justify-center flex-col gap-2">
          <View style={styles.headerContent}>
            <Avatar size="xl">
              <AvatarFallbackText>Amit Jamwal</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
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
        <DrawerBody contentContainerClassName="gap-2">
          <Pressable
            style={styles.menuItem}
            onPress={closeSidebar}
          >
            <Icon as={User} size="lg" style={styles.icon} />
            <Text>My Profile</Text>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={closeSidebar}
          >
            <Icon as={LineChartIcon} size="lg" style={styles.icon} />
            <Text>Invoices</Text>
          </Pressable>
          
          <Pressable
            style={styles.menuItem}
            onPress={closeSidebar}
          >
            <Icon as={Calendar} size="lg" style={styles.icon} />
            <Text>Calendar</Text>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={closeSidebar}
          >
            <Icon as={Settings} size="lg" style={styles.icon} />
            <Text>Settings</Text>
          </Pressable>
        </DrawerBody>
        <DrawerFooter>
          <Button
            style={styles.logoutButton}
            variant="outline"
            action="secondary"
            onPress={closeSidebar}
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

