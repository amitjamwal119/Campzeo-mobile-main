import React, { useState, useCallback, useEffect } from "react";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Alert,
} from "react-native";
import { View, Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import ContactCard, { ContactsRecord } from "./contactComponents/contactCard";
import { router, useLocalSearchParams } from "expo-router";
import {
  getContactsApi,
  deleteContactApi,
} from "@/api/contact/contactApi";
import { useAuth } from "@clerk/clerk-expo";
import { useFocusEffect } from "@react-navigation/native";

export default function Contacts() {
  const [visibleCount, setVisibleCount] = useState(10);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [records, setRecords] = useState<ContactsRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  /* ================= FETCH CONTACTS ================= */
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found");

      const res = await getContactsApi(token, 1, 50, search);

      const contactsArray = res?.contacts ?? [];
      if (!contactsArray.length) {
        setRecords([]);
        return;
      }

      const mapped: ContactsRecord[] = contactsArray.map((item: any) => ({
        id: item.id,
        name: item.contactName,
        email: item.contactEmail,
        mobile: item.contactMobile,
        whatsapp: item.contactWhatsApp,
        show: true,
      }));

      setRecords(mapped);
    } catch (err: any) {
      console.log("GET CONTACTS ERROR:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  /* Fetch on focus + search change */
  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [search])
  );

  /* ================= SORT & FILTER ================= */
  const filteredRecords = [...records].sort((a, b) => {
    if (sortOrder === "asc") return a.name.localeCompare(b.name);
    if (sortOrder === "desc") return b.name.localeCompare(a.name);
    return 0;
  });

  const visibleRecords = filteredRecords.slice(0, visibleCount);
  const isAllVisible = visibleCount >= filteredRecords.length;

  /* ================= ACTIONS ================= */
const handleEdit = (record: ContactsRecord) => {
  router.push({
    pathname: "/contacts/createContact",
    params: {
      contactId: String(record.id),
      record: JSON.stringify(record), 
    },
  });
};

  const handleDelete = (record: ContactsRecord) => {
    Alert.alert(
      "Delete Contact",
      `Are you sure you want to delete ${record.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const token = await getToken();
              if (!token) throw new Error("Authentication token not found");

              // 👇 Option 1: single ID in array
              await deleteContactApi([record.id], token);

              // Update UI after success
              setRecords((prev) =>
                prev.filter((r) => r.id !== record.id)
              );
            } catch (error: any) {
              console.log("DELETE CONTACT ERROR:", error);
              Alert.alert(
                "Error",
                error.message || "Failed to delete contact"
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCopy = (record: ContactsRecord) => {
    // Future feature
  };

  const toggleShow = (record: ContactsRecord) => {
    record.show = !record.show;
    setRecords([...records]);
  };

  const handleNew = () => {
    router.push({
      pathname: "/contacts/createContact",
      params: { callback: "newContact" },
    });
  };

  const handleShare = async () => {
    if (!records.length) return;

    const message = records
      .map(
        (r, i) =>
          `*NAME:* ${r.name ?? "N/A"}\n*EMAIL:* ${r.email ?? "N/A"}\n*MOBILE:* ${r.mobile ?? "N/A"}\n*WHATSAPP:* ${r.whatsapp ?? "N/A"}\n`
      )
      .join("\n");

    try {
      await Share.share({ message });
    } catch (e) {
      console.log(e);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleLoadToggle = () => {
    if (isAllVisible) setVisibleCount(5);
    else setVisibleCount(filteredRecords.length);
  };

  /* ================= ADD / UPDATE CONTACT ================= */
  const handleAddOrUpdate = useCallback((newContact: ContactsRecord) => {
    setRecords((prev) => {
      const index = prev.findIndex((r) => r.id === newContact.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = newContact;
        return updated;
      }
      return [...prev, { ...newContact, show: true }];
    });
  }, []);

  const { newContact } = useLocalSearchParams();
  useEffect(() => {
    if (newContact) {
      handleAddOrUpdate(JSON.parse(newContact as string));
    }
  }, [newContact]);

  /* ================= UI ================= */
  return (
    <View className="flex-1 p-4 bg-gray-100">
      {/* Loader */}
      {loading && (
        <View className="absolute top-0 bottom-0 left-0 right-0 justify-center items-center bg-black/10 z-10">
          <ActivityIndicator size="large" />
        </View>
      )}

      {/* Top Bar */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          onPress={handleNew}
          className="flex-row items-center px-3 py-2 rounded-full bg-blue-100 mr-2"
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#0284c7"
          />
          <Text className="ml-2 font-semibold text-blue-700">
            New
          </Text>
        </TouchableOpacity>

        <TextInput
          value={search}
          onChangeText={(value) => {
            setSearch(value);
            setVisibleCount(5);
          }}
          placeholder="Search contacts..."
          className="flex-1 px-3 py-2 rounded-full border border-gray-300 bg-white mr-2"
        />

        <TouchableOpacity
          onPress={handleShare}
          className="px-3 py-2 rounded-full bg-green-100 mr-2"
        >
          <Ionicons
            name="share-social-outline"
            size={20}
            color="#16a34a"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleSortOrder}
          className="flex-row items-center px-3 py-2 rounded-full bg-yellow-100"
        >
          <Ionicons
            name="funnel-outline"
            size={20}
            color="#f59e0b"
          />
          <Text className="ml-2 font-semibold text-yellow-700">
            {sortOrder === "asc"
              ? "A → Z"
              : sortOrder === "desc"
                ? "Z → A"
                : "Sort"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contact List */}
      <FlatList
        data={visibleRecords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ContactCard
            record={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onToggleShow={toggleShow}
          />
        )}
        ListEmptyComponent={() =>
          loading ? null : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No Contacts Found
            </Text>
          )
        }
        ListFooterComponent={
          filteredRecords.length > 5 ? (
            <TouchableOpacity
              onPress={handleLoadToggle}
              className={`py-3 my-2 rounded-xl items-center ${isAllVisible ? "bg-red-100" : "bg-blue-100"
                }`}
            >
              <Text
                className={`font-semibold ${isAllVisible
                    ? "text-red-700"
                    : "text-blue-700"
                  }`}
              >
                {isAllVisible ? "See Less" : "Load More"}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}
