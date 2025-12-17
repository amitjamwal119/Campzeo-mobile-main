import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  View,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { HStack, VStack, Button, Text, Pressable } from "@gluestack-ui/themed";
import * as WebBrowser from "expo-web-browser";

import {
  getPlatform,
  disconnectPlatform,
  getSocialStatus,
} from "@/api/accountsApi";

/* ----------------------------- TYPES ----------------------------- */

type FontAwesomeName = React.ComponentProps<typeof FontAwesome>["name"];

type SocialItem = {
  icon: FontAwesomeName;
  color: string;
  platformKey: string;
  title: string;
  connected?: boolean;
  connectedAs?: string;
};

/* ---------------------- BACKEND → FRONTEND MAP ---------------------- */

const backendKeyMap: Record<string, string> = {
  facebook: "FACEBOOK",
  instagram: "INSTAGRAM",
  linkedin: "LINKEDIN",
  pinterest: "PINTEREST",
  youtube: "YOUTUBE",
};

export default function Accounts() {
  const router = useRouter();

  /* ----------------------------- STATE ----------------------------- */

  const [platforms, setPlatforms] = useState<SocialItem[]>([
    {
      icon: "facebook",
      color: "#1877F2",
      platformKey: "FACEBOOK",
      title: "Facebook",
      connected: false,
    },
    {
      icon: "instagram",
      color: "#E4405F",
      platformKey: "INSTAGRAM",
      title: "Instagram",
      connected: false,
    },
    {
      icon: "linkedin",
      color: "#0A66C2",
      platformKey: "LINKEDIN",
      title: "LinkedIn",
      connected: false,
    },
    {
      icon: "youtube-play",
      color: "#FF0000",
      platformKey: "YOUTUBE",
      title: "YouTube",
      connected: false,
    },
    {
      icon: "pinterest",
      color: "#E60023",
      platformKey: "PINTEREST",
      title: "Pinterest",
      connected: false,
    },
  ]);

  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<
    "connect" | "disconnect" | null
  >(null);


  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await getSocialStatus();

        setPlatforms((prev) =>
          prev.map((item) => {
            const backendKey = Object.keys(backendKeyMap).find(
              (key) => backendKeyMap[key] === item.platformKey
            );

            if (!backendKey || !data[backendKey]) {
              return item;
            }

            return {
              ...item,
              connected: data[backendKey].connected,
              connectedAs: data[backendKey].name ?? undefined,
            };
          })
        );
      } catch (error) {
        console.error("Failed to fetch connected platforms", error);
      }
    };

    fetchConnections();
  }, []);

  /* ----------------------------- HANDLERS ----------------------------- */

  const handleConnect = async (platformKey: string, title: string) => {
    try {
      setLoadingPlatform(platformKey);
      setLoadingAction("connect");

      if (platformKey === "INSTAGRAM") {
        Alert.alert(
          "Instagram Connection",
          "Instagram uses Facebook login to connect business accounts."
        );
      }

      const data = await getPlatform(platformKey);

      if (data?.url) {
        await WebBrowser.openBrowserAsync(data.url);
      }
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      setLoadingPlatform(null);
      setLoadingAction(null);
    }
  };

  const handleDisconnect = async (platformKey: string) => {
    try {
      setLoadingPlatform(platformKey);
      setLoadingAction("disconnect");

      await disconnectPlatform(platformKey);

      setPlatforms((prev) =>
        prev.map((item) =>
          item.platformKey === platformKey
            ? {
                ...item,
                connected: false,
                connectedAs: undefined,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to disconnect:", error);
    } finally {
      setLoadingPlatform(null);
      setLoadingAction(null);
    }
  };

  /* ----------------------------- UI ----------------------------- */

  return (
    <ThemedView className="flex-1 bg-gray-50 px-4 pt-20">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back */}
        <HStack>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={22} color="#334155" />
          </Pressable>
        </HStack>

        {/* Title */}
        <VStack className="mb-8 mt-4">
          <ThemedText
            style={{
              fontSize: 30,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Accounts
          </ThemedText>

          <ThemedText
            style={{
              fontSize: 14,
              color: "#6b7280",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Connect your social media accounts.
          </ThemedText>
        </VStack>

        {/* Cards */}
        <View className="flex-row flex-wrap justify-between gap-y-6">
          {platforms.map((item) => {
            const isLoading = loadingPlatform === item.platformKey;

            return (
              <View
                key={item.platformKey}
                className="w-[46%] rounded-2xl bg-white p-4 border border-gray-200"
                pointerEvents={isLoading ? "none" : "auto"}
              >
                {/* Icon + Title */}
                <VStack space="sm" className="items-center">
                  <FontAwesome
                    name={item.icon}
                    size={38}
                    color={item.color}
                  />
                  <ThemedText style={{ fontSize: 16, fontWeight: "600" }}>
                    {item.title}
                  </ThemedText>
                </VStack>

                {/* Connected As */}
                {item.connectedAs && (
                  <VStack className="mt-3">
                    <HStack
                      className="items-center justify-center"
                      space="xs"
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#16a34a"
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "500",
                          color: "#16a34a",
                        }}
                      >
                        Connected as
                      </Text>
                    </HStack>

                    <Text
                      style={{
                        fontWeight: "600",
                        color: "#374151",
                        textAlign: "center",
                        marginTop: 2,
                      }}
                    >
                      {item.connectedAs}
                    </Text>
                  </VStack>
                )}

                {/* Actions */}
                <VStack className="mt-4">
                  {!item.connected ? (
                    isLoading && loadingAction === "connect" ? (
                      <HStack
                        className="items-center justify-center py-2"
                        space="xs"
                      >
                        <ActivityIndicator size="small" color="#2563eb" />
                        <Text style={{ fontSize: 13, color: "#2563eb" }}>
                          Redirecting…
                        </Text>
                      </HStack>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        action="secondary"
                        onPress={() =>
                          handleConnect(item.platformKey, item.title)
                        }
                      >
                        <Text style={{ fontSize: 14 }}>Connect</Text>
                      </Button>
                    )
                  ) : isLoading && loadingAction === "disconnect" ? (
                    <HStack
                      className="items-center justify-center py-2"
                      space="xs"
                    >
                      <ActivityIndicator size="small" color="#ef4444" />
                      <Text style={{ fontSize: 13, color: "#ef4444" }}>
                        Disconnecting…
                      </Text>
                    </HStack>
                  ) : (
                    <Pressable
                      onPress={() => handleDisconnect(item.platformKey)}
                      className="py-2 rounded-lg border border-red-200"
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 14,
                          fontWeight: "500",
                          color: "#ef4444",
                        }}
                      >
                        Disconnect
                      </Text>
                    </Pressable>
                  )}
                </VStack>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
