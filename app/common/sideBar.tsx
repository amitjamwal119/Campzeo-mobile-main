import React, { useEffect, useMemo, useRef, useState } from "react";
import { Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
  ShoppingCart,
  User,
  Wallet,
} from "lucide-react-native";

import { useSidebarStore } from "@/store/sidebarStore";

type MenuItem = {
  icon: typeof User;
  label: string;
  route?: Href;
};

const MENU_ITEMS: MenuItem[] = [
  { icon: User, label: "My Profile", route: "/(profile)/userProfile" },
  { icon: Home, label: "Saved Address" },
  { icon: ShoppingCart, label: "Orders" },
  { icon: Wallet, label: "Saved Cards" },
];

export default function Sidebar() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const sidebarOpen = useSidebarStore((s) => s.sidebarOpen);
  const closeSidebar = useSidebarStore((s) => s.closeSidebar);
  const [visible, setVisible] = useState(sidebarOpen);
  const animation = useRef(new Animated.Value(sidebarOpen ? 1 : 0)).current;
  const drawerWidth = useMemo(() => {
    const maxWidth = 320;
    const screenWidth = Dimensions.get("window").width;
    return Math.min(screenWidth * 0.85, maxWidth);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      setVisible(true);
    }

    Animated.timing(animation, {
      toValue: sidebarOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !sidebarOpen) {
        setVisible(false);
      }
    });
  }, [animation, sidebarOpen]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [drawerWidth + 40, 0],
  });

  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const handleItemPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route as Href);
    }
    closeSidebar();
  };

  if (!visible) return null;

  return (
    <Modal transparent visible animationType="none" onRequestClose={closeSidebar}>
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                paddingTop: top,
                paddingBottom: bottom,
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX }],
              width: drawerWidth,
              paddingTop: top + 20,
              paddingBottom: bottom + 20,
            },
          ]}
          className="bg-white rounded-l-3xl border-l border-gray-100"
        >
          <VStack className="items-center gap-3">
            <Avatar size="2xl">
              <AvatarFallbackText>User</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?&w=200&h=200&dpr=2&q=80",
                }}
              />
            </Avatar>
            <VStack className="items-center">
              <Text size="lg" className="font-semibold text-gray-900">
                User Name
              </Text>
              <Text size="sm" className="text-gray-500">
                user@email.com
              </Text>
            </VStack>
          </VStack>

          <Divider className="my-4" />

          <VStack className="flex-1 gap-1">
            {MENU_ITEMS.map((item) => (
              <Pressable
                key={item.label}
                className="flex-row items-center gap-3 rounded-xl px-3 py-3 active:bg-gray-100"
                onPress={() => handleItemPress(item)}
              >
                <Icon as={item.icon} size="lg" className="text-gray-500" />
                <Text className="text-base text-gray-800">{item.label}</Text>
              </Pressable>
            ))}
          </VStack>

          <Button
            action="secondary"
            variant="outline"
            className="w-full border-gray-300 mt-4"
            onPress={closeSidebar}
          >
            <ButtonText>Logout</ButtonText>
            <ButtonIcon as={LogOut} />
          </Button>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 20,
    gap: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});
