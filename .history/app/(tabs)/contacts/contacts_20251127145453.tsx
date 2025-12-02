import { useState } from "react";
import { FlatList, TextInput, TouchableOpacity, Share } from "react-native";
import { View, Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import RecordCard, { Record } from "./contactComponents/contactCard";
import Pagination from "./contactComponents/pagination";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";

export default function Contacts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const [records, setRecords] = useState<Record[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      mobile: "1234567890",
      whatsapp: "1234567890",
      show: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      mobile: "0987654321",
      whatsapp: "0987654321",
      show: true,
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      mobile: "1112223333",
      whatsapp: "1112223333",
      show: true,
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      mobile: "2223334444",
      whatsapp: "2223334444",
      show: true,
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie@example.com",
      mobile: "3334445555",
      whatsapp: "3334445555",
      show: true,
    },
    {
      id: 6,
      name: "David Lee",
      email: "david@example.com",
      mobile: "4445556666",
      whatsapp: "4445556666",
      show: true,
    },
  ]);

  const pageLimit = 5;

  // Filter + Search
  let filteredRecords = records.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );
  if (sortOrder === "asc")
    filteredRecords.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortOrder === "desc")
    filteredRecords.sort((a, b) => b.name.localeCompare(a.name));

  const totalPages = Math.ceil(filteredRecords.length / pageLimit);
  const currentRecords = filteredRecords.slice(
    (page - 1) * pageLimit,
    page * pageLimit
  );

  // ✅ Updated handleEdit to navigate to createContact with record data
  const handleEdit = (record: Record) => {
    router.push({
      pathname: "/contacts/createContact",
      params: { record: JSON.stringify(record) },
    });
  };

  const handleDelete = (record: Record) =>
    setRecords((prev) => prev.filter((r) => r.id !== record.id));

  const handleCopy = (record: Record) => {
    const text = `Name: ${record.name}\nEmail: ${record.email}\nMobile: ${record.mobile}\nWhatsApp: ${record.whatsapp}`;
    navigator.clipboard.writeText(text);
    console.log("Copied:", text);
  };

  const toggleShow = (record: Record) => {
    record.show = !record.show;
    setRecords([...records]);
  };

  const handleNew = () => router.push("/contacts/createContact");

  const handleShare = async () => {
    if (!records.length) return;
    const header = `Name\tEmail\tMobile\tWhatsApp\n`;
    const message =
      header +
      records
        .map((r) => `${r.name}\t${r.email}\t${r.mobile}\t${r.whatsapp}`)
        .join("\n");
    try {
      await Share.share({ message });
    } catch (e) {
      console.log(e);
    }
  };

  const toggleSortOrder = () => {
    const next = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(next);
    setPage(1);
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {/* Top Bar */}
      <View className="flex-row items-center mb-4">
        {/* New Contact Button */}
        <TouchableOpacity
          onPress={handleNew}
          className="flex-row items-center justify-center px-3 py-2 rounded-xl bg-blue-100 mr-2"
        >
          <Ionicons name="add-circle" size={20} color="#0284c7" />
          <Text className="ml-2 font-semibold text-blue-700">New</Text>
        </TouchableOpacity>

        {/* Search Input */}
        <TextInput
          value={search}
          onChangeText={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search contacts..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white mr-2"
        />

        {/* Share Button */}
        <TouchableOpacity
          onPress={handleShare}
          className="px-3 py-2 rounded-xl bg-green-100 mr-2"
        >
          <Ionicons name="share-social" size={20} color="#16a34a" />
        </TouchableOpacity>

        {/* Sort Button */}
        <TouchableOpacity
          onPress={toggleSortOrder}
          className="flex-row items-center px-3 py-2 rounded-xl bg-yellow-100"
        >
          <Ionicons name="funnel-outline" size={20} color="#f59e0b" />
          <Text className="ml-2 font-semibold text-yellow-700">
            {sortOrder === "asc"
              ? "A → Z"
              : sortOrder === "desc"
              ? "Z → A"
              : "Sort"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Records List */}
      <FlatList
        data={currentRecords}
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
          <Text className="text-center mt-12 text-gray-500">
            No records found
          </Text>
        }
        ListFooterComponent={
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        }
      />
    </View>
  );
}
