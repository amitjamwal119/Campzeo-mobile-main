import React, { useState } from "react";
import { FlatList, TextInput, TouchableOpacity, Share } from "react-native";
import { View, Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import RecordCard, { ContactsRecord } from "./contactComponents/contactCard";
import { router } from "expo-router";
 
export default function Contacts() {
  const [visibleCount, setVisibleCount] = useState(5);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
 
  const [records, setRecords] = useState<ContactsRecord[]>([
    { id: 1, name: "John Doe", email: "john@example.com", mobile: "1234567890", whatsapp: "1234567890", show: true },
    { id: 2, name: "Jane Smith", email: "jane@example.com", mobile: "0987654321", whatsapp: "0987654321", show: true },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", mobile: "9876543210", whatsapp: "9876543210", show: true },
    { id: 4, name: "Bob Brown", email: "bob@example.com", mobile: "4561237890", whatsapp: "4561237890", show: true },
    { id: 5, name: "Charlie Davis", email: "charlie@example.com", mobile: "3216549870", whatsapp: "3216549870", show: true },
    { id: 6, name: "Diana Evans", email: "diana@example.com", mobile: "6549873210", whatsapp: "6549873210", show: true },
    { id: 7, name: "Ethan Foster", email: "ethan@example.com", mobile: "7891234560", whatsapp: "7891234560", show: true },
    { id: 8, name: "Fiona Green", email: "fiona@example.com", mobile: "1472583690", whatsapp: "1472583690", show: true },
    { id: 9, name: "George Hill", email: "george@example.com", mobile: "9638527410", whatsapp: "9638527410", show: true },
    { id: 10, name: "Hannah Irving", email: "hannah@example.com", mobile: "8527419630", whatsapp: "8527419630", show: true },
    { id: 11, name: "Ian Jacobs", email: "ian@example.com", mobile: "7413698520", whatsapp: "7413698520", show: true },
    { id: 12, name: "Julia King", email: "julia@example.com", mobile: "3692581470", whatsapp: "3692581470", show: true },
  ]);
 
  // Filter + Search + Sort
  const filteredRecords = records
    .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name);
      if (sortOrder === "desc") return b.name.localeCompare(a.name);
      return 0;
    });
 
  const visibleRecords = filteredRecords.slice(0, visibleCount);
  const isAllVisible = visibleCount >= filteredRecords.length;
 
  // Handlers
  const handleEdit = (record: ContactsRecord) => {
    router.push({
      pathname: "/contacts/createContact",
      params: { record: JSON.stringify(record) },
    });
  };
 
  const handleDelete = (record: ContactsRecord) => {
    setRecords((prev) => prev.filter((r) => r.id !== record.id));
  };
 
  const handleCopy = (record: ContactsRecord) => {
    // Clipboard copy can be implemented here
  };
 
  const toggleShow = (record: ContactsRecord) => {
    record.show = !record.show;
    setRecords([...records]);
  };
 
  const handleNew = () => router.push("/contacts/createContact");
 
  const handleShare = async () => {
    if (!records.length) return;
    const header = `Name\tEmail\tMobile\tWhatsApp\n`;
    const message =
      header +
      records.map((r) => `${r.name}\t${r.email}\t${r.mobile}\t${r.whatsapp}`).join("\n");
    try {
      await Share.share({ message });
    } catch (e) {
      console.log(e);
    }
  };
 
  const toggleSortOrder = () => {
    const next = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(next);
  };
 
  const handleLoadToggle = () => {
    if (isAllVisible) setVisibleCount(5);
    else setVisibleCount(filteredRecords.length);
  };
 
  return (
    <View className="flex-1 p-4 bg-gray-100">
      {/* Top Bar */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          onPress={handleNew}
          className="flex-row items-center justify-center px-3 py-2 rounded-xl bg-blue-100 mr-2"
        >
          <Ionicons name="add-circle" size={20} color="#0284c7" />
          <Text className="ml-2 font-semibold text-blue-700">New</Text>
        </TouchableOpacity>
 
        <TextInput
          value={search}
          onChangeText={(value) => {
            setSearch(value);
            setVisibleCount(5);
          }}
          placeholder="Search contacts..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white mr-2"
        />
 
        <TouchableOpacity
          onPress={handleShare}
          className="px-3 py-2 rounded-xl bg-green-100 mr-2"
        >
          <Ionicons name="share-social" size={20} color="#16a34a" />
        </TouchableOpacity>
 
        <TouchableOpacity
          onPress={toggleSortOrder}
          className="flex-row items-center px-3 py-2 rounded-xl bg-yellow-100"
        >
          <Ionicons name="funnel-outline" size={20} color="#f59e0b" />
          <Text className="ml-2 font-semibold text-yellow-700">
            {sortOrder === "asc" ? "A → Z" : sortOrder === "desc" ? "Z → A" : "Sort"}
          </Text>
        </TouchableOpacity>
      </View>
 
      {/* Contact List */}
      <FlatList
        data={visibleRecords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RecordCard
            record={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopy={handleCopy}
            onToggleShow={toggleShow}
          />
        )}
        ListEmptyComponent={
          <Text className="text-center mt-12 text-gray-500">No records found</Text>
        }
        ListFooterComponent={
          filteredRecords.length > 5 ? (
            <TouchableOpacity
              onPress={handleLoadToggle}
              className={`py-3 my-2 rounded-xl items-center ${isAllVisible ? "bg-red-100" : "bg-blue-100"}`}
            >
              <Text className={`font-semibold ${isAllVisible ? "text-red-700" : "text-blue-700"}`}>
                {isAllVisible ? "See Less" : "Load More"}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}
 