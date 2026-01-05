import { Box, Text, VStack, HStack, ScrollView } from "@gluestack-ui/themed";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { getCampaigns, getContacts, getUser } from "@/api/dashboardApi";

export default function Insights() {
  const [userData, setUserData] = useState<any>(null);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [contactsData, setContactsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const user = await getUser();
        const campaigns = await getCampaigns();
        const contacts = await getContacts();

        setUserData(user);
        setCampaignData(campaigns);
        setContactsData(contacts);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#D55B35" />
        <ThemedText
          style={{
            marginTop: 12,
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          Loading dashboard…
        </ThemedText>
      </ThemedView>
    );
  }

  const organisation = userData?.organisation;
  const organisationName = organisation?.name ?? "Organisation";

  const totalCampaigns =
    campaignData?.pagination?.total ?? campaignData?.campaigns?.length ?? 0;

  const totalContacts =
    contactsData?.pagination?.total ?? contactsData?.contacts?.length ?? 0;

  const planName = organisation?.subscriptions?.[0]?.plan?.name ?? "FREE TRIAL";

  const trialEndDate = organisation?.trialEndDate
    ? new Date(organisation.trialEndDate).toLocaleDateString()
    : "N/A";

  return (
    <ThemedView style={styles.container}>
      {/* ================= HEADER ================= */}
      <HStack space="xs" style={styles.header}>
        <ThemedText style={styles.heading}>Welcome back,</ThemedText>

        <ThemedText style={styles.orgName}>{organisationName}</ThemedText>
      </HStack>
      {/* <Text style={styles.subText}>
          Here’s what’s happening with your account today
        </Text> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= PLAN CARD ================= */}
        <Box style={styles.planCard}>
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Text style={styles.planLabel}>Current Plan</Text>
              <ThemedText style={styles.planName}>{planName}</ThemedText>
            </VStack>

            <Box style={styles.trialBadge}>
              <Text style={styles.trialText}>Trial</Text>
            </Box>
          </HStack>

          <Text style={styles.trialDate}>Trial ends on {trialEndDate}</Text>
        </Box>

        {/* ================= STATS ================= */}
        <VStack space="md" style={styles.section}>
          {/* Campaigns */}
          <Box style={styles.statCard}>
            <Text style={styles.statLabel}>Total Campaigns</Text>
            <ThemedText style={styles.statValue}>{totalCampaigns}</ThemedText>
            <Text style={styles.statHelper}>Active marketing campaigns</Text>
          </Box>

          {/* Contacts */}
          <Box style={styles.statCard}>
            <Text style={styles.statLabel}>Total Contacts</Text>
            <ThemedText style={styles.statValue}>{totalContacts}</ThemedText>
            <Text style={styles.statHelper}>Audience reach</Text>
          </Box>

          {/* Team Size */}
          <Box style={styles.statCard}>
            <Text style={styles.statLabel}>Team Size</Text>
            <ThemedText style={styles.statValue}>1</ThemedText>
            <Text style={styles.statHelper}>Active team members</Text>
          </Box>
        </VStack>

        {/* ================= TEAM MEMBER ================= */}
        <Box style={styles.teamCard}>
          <Text style={styles.teamLabel}>Team Members</Text>

          <ThemedText style={styles.teamName}>
            {userData?.firstName} {userData?.lastName}
          </ThemedText>

          <ThemedText style={styles.teamEmail}>{userData?.email}</ThemedText>
        </Box>
      </ScrollView>
    </ThemedView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: 14,
  },
  header: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
  },
  orgName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#D55B35",
  },
  subText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  planCard: {
    backgroundColor: "#D55B35",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  planLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  planName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  trialBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  trialText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  trialDate: {
    color: "#fff",
    fontSize: 13,
    marginTop: 12,
  },
  section: {
    marginBottom: 24,
  },
  statCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 20,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 8,
    lineHeight:30
  },
  statHelper: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
  },
  teamCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  teamLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "600",
  },
  teamEmail: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 4,
  },
});
