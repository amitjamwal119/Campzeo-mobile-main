import { useState } from "react";
import { FlatList, TextInput, TouchableOpacity } from "react-native";
import { View, Text } from "@gluestack-ui/themed";
// import InvoiceCard, { Invoice } from "./invoiceComponents/InvoiceCard";
import { ThemedText } from "@/components/themed-text";
import Pagination from "@/app/(common)/pagination";
import InvoiceCard, { Invoice } from "./invoiceComponents/invoiceCard";
import { Ionicons } from "@expo/vector-icons";

export default function Invoices() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [invoices] = useState<Invoice[]>([
    {
      id: 1,
      organisation: "TechSoft Pvt Ltd",
      plan: "Premium",
      amount: "₹ 4,999",
      status: "paid",
      invoiceDate: "2025-01-10",
      dueDate: "2025-02-10",
    },
    {
      id: 2,
      organisation: "Alpha Enterprises",
      plan: "Basic",
      amount: "₹ 999",
      status: "pending",
      invoiceDate: "2025-01-15",
      dueDate: "2025-02-15",
    },
    {
      id: 3,
      organisation: "NeoTech Innovations",
      plan: "Standard",
      amount: "₹ 2,499",
      status: "paid",
      invoiceDate: "2025-01-20",
      dueDate: "2025-02-20",
    },
    {
      id: 4,
      organisation: "Creative Labs",
      plan: "Premium",
      amount: "₹ 4,999",
      status: "pending",
      invoiceDate: "2025-01-25",
      dueDate: "2025-02-25",
    },
  ]);

  const pageLimit = 5;

  // Filter by search
  const filtered = invoices.filter((x) =>
    x.organisation.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageLimit);

  const currentInvoices = filtered.slice(
    (page - 1) * pageLimit,
    page * pageLimit
  );

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <ThemedText
        style={{ fontSize: 30, fontWeight: 700, lineHeight: 36 }}
        className="text-center my-5"
      >
        Invoices
      </ThemedText>

      {/* Search Bar */}
      <View className="flex-row items-center mb-4 gap-5">
        <TextInput
          value={search}
          onChangeText={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search organisation..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white"
        />

        {/* Share */}
                        <TouchableOpacity
                          // onPress={handleShare}
                          className="px-3 py-2 rounded-xl bg-green-100 mr-2"
                        >
                          <Ionicons name="share-social" size={20} color="#16a34a" />
                        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={currentInvoices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <InvoiceCard invoice={item} />}
        ListEmptyComponent={
          <Text className="text-center mt-12 text-gray-500">
            No invoices found
          </Text>
        }
        ListFooterComponent={<Pagination />}
      />
    </View>
  );
}
