import { View } from "react-native";
import {
  Box,
  Text,
  VStack,
  HStack,
  Progress,
  ProgressFilledTrack,
  ScrollView,
} from "@gluestack-ui/themed";
import { ThemedText } from "@/components/themed-text";

export default function Insights() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
    >
      {/* Greeting Section */}
      <VStack space="xs" style={{ marginBottom: 24 }}>
        <ThemedText style={{ fontWeight: "700", fontSize: 20, lineHeight: 28 }}>
          Welcome back, Amit's Org
        </ThemedText>

        <Text style={{ fontSize: 14, color: "#6b7280", lineHeight: 20 }}>
          Here's what's happening with your account today
        </Text>
      </VStack>
        {/* Trial Plan Card */}
        <Box
          style={{
            backgroundColor: "#dc2626",
            padding: 20,
            borderRadius: 16,
            marginBottom: 24,
          }}
        >
          <ThemedText
            style={{ color: "white", fontSize: 16, fontWeight: "600" }}
          >
            FREE_TRIAL Plan
          </ThemedText>

          <ThemedText style={{ color: "white", marginTop: 4, fontSize: 14 }}>
            Trial ends on 12/23/2025
          </ThemedText>
        </Box>
      <ScrollView showsVerticalScrollIndicator={false}>


        {/* Vertical Stats Cards */}
        <VStack space="md" style={{ marginBottom: 24 }}>
          {/* Total Campaigns */}
          <Box
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 14, color: "#6b7280" }}>
              Total Campaigns
            </Text>

            <HStack
              justifyContent="space-between"
              alignItems="center"
              style={{ marginTop: 8 }}
            >
              <Text style={{ fontSize: 28, fontWeight: "700" }}>1</Text>
            </HStack>

            <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
              Active marketing campaigns
            </Text>
          </Box>

          {/* Total Contacts */}
          <Box
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 14, color: "#6b7280" }}>
              Total Contacts
            </Text>

            <HStack
              justifyContent="space-between"
              alignItems="center"
              style={{ marginTop: 8 }}
            >
              <Text style={{ fontSize: 28, fontWeight: "700" }}>3</Text>
            </HStack>

            <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
              Audience reach
            </Text>
          </Box>

          {/* Team Size */}
          <Box
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <Text style={{ fontSize: 14, color: "#6b7280" }}>Team Size</Text>

            <HStack
              justifyContent="space-between"
              alignItems="center"
              style={{ marginTop: 8 }}
            >
              <Text style={{ fontSize: 28, fontWeight: "700" }}>1</Text>
            </HStack>

            <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
              Active team members
            </Text>
          </Box>
        </VStack>

        {/* Tabs Row */}
        <HStack space="lg" style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
            Recent Activity
          </Text>

          <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
            Team Members
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#000",
              backgroundColor: "#f3f4f6",
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            Usage Details
          </Text>
        </HStack>

        {/* Usage Details Card */}
        <Box
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 4 }}>
            Usage Details
          </Text>

          <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
            Detailed breakdown of your usage and limits
          </Text>

          {/* Storage Row */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 4 }}>
            Storage
          </Text>

          <Progress
            value={48}
            style={{ height: 8, backgroundColor: "#fecaca", borderRadius: 10 }}
          >
            <ProgressFilledTrack style={{ backgroundColor: "#dc2626" }} />
          </Progress>

          <HStack justifyContent="flex-end">
            <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              2.4/5GB
            </Text>
          </HStack>

          {/* Footer note */}
          <Box
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: "#f3f4f6",
              borderRadius: 12,
            }}
          >
            <Text
              style={{ textAlign: "center", color: "#6b7280", fontSize: 14 }}
            >
              Detailed usage metrics coming soon.
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </View>
  );
}
