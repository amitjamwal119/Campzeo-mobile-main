import { useEffect, useMemo, useState } from "react";
import { FlatList, TextInput, TouchableOpacity } from "react-native";
import { View, Text } from "@gluestack-ui/themed";
// import InvoiceCard, { Invoice } from "./invoiceComponents/InvoiceCard";
import { ThemedText } from "@/components/themed-text";
// import Pagination from "@/app/(common)/pagination";
import InvoiceCard, { InvoiceRecord } from "./invoiceComponents/invoiceCard";
import { Ionicons } from "@expo/vector-icons";
import Pagination from "@/app/(common)/pagination";

export default function Invoices() {
  const [search, setSearch] = useState("");

  // Pagination New state
  // const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  
  const invoices: InvoiceRecord[] = [
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
  {
    id: 5,
    organisation: "PixelWave Studios",
    plan: "Standard",
    amount: "₹ 2,999",
    status: "paid",
    invoiceDate: "2025-01-28",
    dueDate: "2025-02-28",
  },
  {
    id: 6,
    organisation: "SoftCraft Technologies",
    plan: "Basic",
    amount: "₹ 1,299",
    status: "pending",
    invoiceDate: "2025-02-02",
    dueDate: "2025-03-02",
  },
  {
    id: 7,
    organisation: "BrightVision Pvt Ltd",
    plan: "Premium",
    amount: "₹ 4,999",
    status: "paid",
    invoiceDate: "2025-02-05",
    dueDate: "2025-03-05",
  },
  {
    id: 8,
    organisation: "Quantum Solutions",
    plan: "Standard",
    amount: "₹ 2,499",
    status: "pending",
    invoiceDate: "2025-02-08",
    dueDate: "2025-03-08",
  },
  {
    id: 9,
    organisation: "GreenLeaf Corp",
    plan: "Basic",
    amount: "₹ 999",
    status: "paid",
    invoiceDate: "2025-02-10",
    dueDate: "2025-03-10",
  },
  {
    id: 10,
    organisation: "UrbanTech Pvt Ltd",
    plan: "Premium",
    amount: "₹ 4,999",
    status: "pending",
    invoiceDate: "2025-02-12",
    dueDate: "2025-03-12",
  },
  {
    id: 11,
    organisation: "NextGen Enterprises",
    plan: "Standard",
    amount: "₹ 2,499",
    status: "paid",
    invoiceDate: "2025-02-15",
    dueDate: "2025-03-15",
  },
  {
    id: 12,
    organisation: "Omega IT Services",
    plan: "Basic",
    amount: "₹ 1,499",
    status: "pending",
    invoiceDate: "2025-02-18",
    dueDate: "2025-03-18",
  },
  {
    id: 13,
    organisation: "Skyline Digital",
    plan: "Premium",
    amount: "₹ 4,999",
    status: "paid",
    invoiceDate: "2025-02-20",
    dueDate: "2025-03-20",
  },
  {
    id: 14,
    organisation: "Vertex Industries",
    plan: "Standard",
    amount: "₹ 2,499",
    status: "pending",
    invoiceDate: "2025-02-22",
    dueDate: "2025-03-22",
  },
  {
    id: 15,
    organisation: "InnovateHub Pvt Ltd",
    plan: "Basic",
    amount: "₹ 999",
    status: "paid",
    invoiceDate: "2025-02-25",
    dueDate: "2025-03-25",
  },
  {
    id: 16,
    organisation: "CyberWave Technologies",
    plan: "Premium",
    amount: "₹ 4,999",
    status: "pending",
    invoiceDate: "2025-02-26",
    dueDate: "2025-03-26",
  },
  {
    id: 17,
    organisation: "Matrix Solutions",
    plan: "Standard",
    amount: "₹ 2,499",
    status: "paid",
    invoiceDate: "2025-02-28",
    dueDate: "2025-03-28",
  },
  {
    id: 18,
    organisation: "DigitalCore Systems",
    plan: "Basic",
    amount: "₹ 1,299",
    status: "pending",
    invoiceDate: "2025-03-01",
    dueDate: "2025-04-01",
  },
  {
    id: 19,
    organisation: "BlueOcean Innovations",
    plan: "Premium",
    amount: "₹ 4,999",
    status: "paid",
    invoiceDate: "2025-03-03",
    dueDate: "2025-04-03",
  },
];


  // Total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(invoices.length / itemsPerPage));
  }, [invoices.length, itemsPerPage]);

  // Clamp invalid page numbers
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);


// Slice paginated logs
const paginatedInvoices = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return invoices.slice(startIndex, endIndex);
}, [invoices, currentPage, itemsPerPage]);


// Button Handler
const handlePageChange = (page: number) => {
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages ;
  setCurrentPage(page);
};


  // const pageLimit = 5;

  // Filter by search
  // const filtered = invoices.filter((x) =>
  //   x.organisation.toLowerCase().includes(search.toLowerCase())
  // );

  // const totalPages = Math.ceil(filtered.length / pageLimit);

  // const currentInvoices = filtered.slice(
  //   (page - 1) * pageLimit,
  //   page * pageLimit
  // );

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {/*                                                                                                                                                                                                                                                                                                             */}

      {/* Search Bar */}
      <View className="flex-row items-center mb-4 gap-5">
        <TextInput
          value={search}
          onChangeText={(value) => {
            setSearch(value);
            // setPage(1);
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
        data={paginatedInvoices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <InvoiceCard invoice={item} />}
        ListEmptyComponent={
          <Text className="text-center mt-12 text-gray-500">
            No invoices found
          </Text>
        }
        ListFooterComponent={() => (
           <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
                />
        )
         }
      />
    </View>
  );
}
