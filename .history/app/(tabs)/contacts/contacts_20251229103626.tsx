import React, { useState, useCallback, useEffect } from "react";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Alert,
  Pressable,
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
  const [menuVisible, setMenuVisible] = useState(false);

  const { getToken } = useAuth();

  /* ================= FETCH CONTACTS ================= */
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found");

      const res = await getContactsApi(token, 1, 50, search);
      const contactsArray = res?.contacts ?? [];

      const mapped: ContactsRecord[] = contactsArray.map((item: any) => ({
        id: item.id,
        name: item.contactName,
        email: item.contactEmail,
        mobile: item.contactMobile,
        whatsapp: item.contactWhatsApp,
        show: true,
        campaigns: item.campaigns ?? [],
      }));

      setRecords(mapped);
    } catch (err) {
      console.log("GET CONTACTS ERROR:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [search])
  );

  /* ================= SORT ================= */
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
  Alert.alert("Delete Contact", `Delete ${record.name}?`, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          setLoading(true);

          const token = await getToken();
          if (!token) {
            Alert.alert("Error", "Authentication token missing");
            return;
          }

          await deleteContactApi([record.id], token);

          setRecords((prev) => prev.filter((r) => r.id !== record.id));
        } catch (e: any) {
          Alert.alert("Error", e.message || "Failed to delete");
        } finally {
          setLoading(false);
        }
      },
    },
  ]);
};


  const handleShare = async () => {
    if (!records.length) return;

    const message = records
      .map(
        (r) =>
          `NAME: ${r.name}\nEMAIL: ${r.email}\nMOBILE: ${r.mobile}\nWHATSAPP: ${r.whatsapp}\n`
      )
      .join("\n");

    await Share.share({ message });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleLoadToggle = () => {
    isAllVisible
      ? setVisibleCount(5)
      : setVisibleCount(filteredRecords.length);
  };

  const handleNew = () => {
    router.push("/contacts/createContact");
  };

  const toggleShow = (record: ContactsRecord) => {
    record.show = !record.show;
    setRecords([...records]);
  };

  /* ================= ADD / UPDATE ================= */
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
    <Pressable onPress={() => setMenuVisible(false)} className="flex-1">
      <View className="flex-1 p-4 bg-gray-100">
        {/* Loader */}
        {loading && (
          <View className="absolute inset-0 justify-center items-center bg-black/10 z-10">
            <ActivityIndicator size="large" />
          </View>
        )}

        {/* Top Bar */}
        <View className="flex-row items-center mb-4">
          {/* New */}
          <TouchableOpacity
            onPress={handleNew}
            className="flex-row items-center px-3 py-2 rounded-full bg-blue-100 mr-2"
          >
            <Ionicons name="add-circle-outline" size={20} color="#0284c7" />
            <Text className="ml-2 font-semibold text-blue-700">New</Text>
          </TouchableOpacity>

          {/* Search */}
          <TextInput
            value={search}
            onChangeText={(v) => {
              setSearch(v);
              setVisibleCount(5);
            }}
            placeholder="Search contacts..."
            className="flex-1 px-3 py-2 rounded-full border border-gray-300 bg-white"
          />

          {/* 3-dot */}
          <TouchableOpacity
            onPress={() => setMenuVisible(!menuVisible)}
            className="ml-2 p-2 rounded-full bg-gray-200"
          >
            <Ionicons name="ellipsis-vertical" size={20} />
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu */}
        {menuVisible && (
          <View className="absolute right-4 top-20 bg-white rounded-xl shadow-lg border border-gray-200 z-20">
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                handleShare();
              }}
              className="flex-row items-center px-4 py-3"
            >
              <Ionicons
                name="share-social-outline"
                size={18}
                color="#16a34a"
              />
              <Text className="ml-3 font-medium text-green-700">Share</Text>
            </TouchableOpacity>

            <View className="h-[1px] bg-gray-200 mx-3" />

            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                toggleSortOrder();
              }}
              className="flex-row items-center px-4 py-3"
            >
              <Ionicons name="funnel-outline" size={18} color="#f59e0b" />
              <Text className="ml-3 font-medium text-yellow-700">
                {sortOrder === "asc"
                  ? "Sort Z → A"
                  : sortOrder === "desc"
                  ? "Sort A → Z"
                  : "Sort"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Contact List */}
        <FlatList
          data={visibleRecords}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ContactCard
              record={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleShow={toggleShow}
              onCopy={() => {}}
            />
          )}
          ListEmptyComponent={
            !loading ? (
              <Text className="text-center mt-6">No Contacts Found</Text>
            ) : null
          }
          ListFooterComponent={
            filteredRecords.length > 5 ? (
              <TouchableOpacity
                onPress={handleLoadToggle}
                className={`py-3 my-2 rounded-xl items-center ${
                  isAllVisible ? "bg-red-100" : "bg-blue-100"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    isAllVisible ? "text-red-700" : "text-blue-700"
                  }`}
                >
                  {isAllVisible ? "See Less" : "Load More"}
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
    </Pressable>
  );
}
