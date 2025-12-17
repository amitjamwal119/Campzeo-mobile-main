import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, TextInput, TouchableOpacity } from "react-native";
import { View, Text } from "@gluestack-ui/themed";
// import InvoiceCard, { Invoice } from "./invoiceComponents/InvoiceCard";
import { ThemedText } from "@/components/themed-text";
// import Pagination from "@/app/(common)/pagination";
import InvoiceCard, { InvoiceRecord } from "./invoiceComponents/invoiceCard";
import { Ionicons } from "@expo/vector-icons";
import Pagination from "@/app/(common)/pagination";
import { useInfiniteQuery } from "@tanstack/react-query";
// import { Skeleton, VStack, HStack } from "@gluestack-ui/themed";


export default function Invoices() {
  const [search, setSearch] = useState("");

  // Pagination New state
  // const [page, setPage] = useState(1);
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;

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
  // const totalPages = useMemo(() => {
  //   return Math.max(1, Math.ceil(invoices.length / itemsPerPage));
  // }, [invoices.length, itemsPerPage]);

  // Clamp invalid page numbers
  // useEffect(() => {
  //   if (currentPage > totalPages) setCurrentPage(totalPages);
  //   if (currentPage < 1) setCurrentPage(1);
  // }, [currentPage, totalPages]);

  // Slice paginated logs
  // const paginatedInvoices = useMemo(() => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   return invoices.slice(startIndex, endIndex);
  // }, [invoices, currentPage, itemsPerPage]);

  // Button Handler
  // const handlePageChange = (page: number) => {
  //   if (page < 1) page = 1;
  //   if (page > totalPages) page = totalPages ;
  //   setCurrentPage(page);
  // };

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

  const fetchInvoices = async ({ pageParam = 1 }) => {
    //pageParam: Which page TanStack is loading now (page number)

    const PAGE_LIMIT = 7;
    const BASE_URL = "http://10.0.2.2:5000";

    const url = `${BASE_URL}/invoices?_page=${pageParam}&_limit=${PAGE_LIMIT}`;
    // pageParam is the current page number that TanStack Query passes to your fetch function automatically.
    // ✔ Why?
    // Because infinite scroll needs to know:
    // Which page am I loading right now?
    // Am I loading page 1? Page 2? Page 3?

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("failed to fetch Logs");
    }

    // header from JSON Server
    // Total count of logs entries
    // If server doesn't return the header We fallback to "0" so app doesn't crash.

    // FIXED base 10
    const totalCount = parseInt(res.headers.get("X-Total-Count") || "0", 10);

    // X-Total-Count: Total number of items in DB, used to compute last page

    const items = await res.json();

    const totalPages = Math.ceil(totalCount / PAGE_LIMIT);

    return {
      items,
      // This is the array of logs fetched from the server:
      // pageparam is just like page number and if page no. > totalpages will be null

      nextPage: pageParam < totalPages ? pageParam + 1 : null,
      // pageParam is just like page number and if page no. > totalpages will be null
      // If not null → infinite scroll continues
      // If null → infinite scroll stops
    };
  };

  // STEP 3 — Infinite Query Setup
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["logs"],

    //queryKey: A unique key for caching and controlling this infinite scroll query.

    queryFn: fetchInvoices,

    // TanStack will call your fetchLogs({ pageParam }) function automatically.

    initialPageParam: 1, //To tell TanStack Query what the first page is.

    getNextPageParam: (lastPage) => lastPage.nextPage,

    // This tells TanStack:
    // If lastPage.nextPage is a number → fetch next page
    // If null → stop infinite scroll
  });

  // STEP 4 — Flatten all pages into a single array
  const mergedInvoices = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.items);
  }, [data]);

  // STEP 5 — Trigger fetchNextPage() on scroll
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage]);

  // STEP 6 — Footer Loader Component
const renderFooter = () => {
  // When next page is loading
  if (isFetchingNextPage) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text>Loading more Invoices...</Text>
      </View>
    );
  }

// Step 7 - skeleton design 
const invoicesSkeleton = () => (
    // <View
    //   style={{
    //     backgroundColor: "white",
    //     padding: 16,
    //     borderRadius: 12,
    //     marginBottom: 12,
    //   }}
    // >
    //   <VStack space="lg">
    //     {/* Organisation + Status */}
    //     <HStack
    //       justifyContent="space-between"
    //       alignItems="center"
    //       mb="$2"
    //     >
    //       {/* Organisation Name */}
    //       <Skeleton h={20} w={180} rounded="$md" />

    //       {/* Status Badge */}
    //       <Skeleton h={20} w={70} rounded="$sm" />
    //     </HStack>

    //     {/* Plan */}
    //     <HStack justifyContent="space-between">
    //       <Skeleton h={16} w={100} rounded="$md" />
    //       <Skeleton h={16} w={120} rounded="$md" />
    //     </HStack>

    //     {/* Amount */}
    //     <HStack justifyContent="space-between">
    //       <Skeleton h={16} w={100} rounded="$md" />
    //       <Skeleton h={16} w={90} rounded="$md" />
    //     </HStack>

    //     {/* Invoice Date */}
    //     <HStack justifyContent="space-between">
    //       <Skeleton h={16} w={110} rounded="$md" />
    //       <Skeleton h={16} w={130} rounded="$md" />
    //     </HStack>

    //     {/* Due Date */}
    //     <HStack justifyContent="space-between">
    //       <Skeleton h={16} w={100} rounded="$md" />
    //       <Skeleton h={16} w={130} rounded="$md" />
    //     </HStack>
    //   </VStack>
    // </View>
        <View><Text>Loading Invoices...</Text></View>
    
)

  // When no more pages left
  if (!hasNextPage) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text style={{ color: "#6b7280" }}>No more Invoices</Text>
      </View>
    );
  }

  return null;
};

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
        data={mergedInvoices}
        // paginatedInvoices
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <InvoiceCard invoice={item} />}
         // STEP 5 — Infinite Scroll Trigger
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // triggers before reaching bottom
          onMomentumScrollBegin={() => {}}

        ListEmptyComponent={
          <Text className="text-center mt-12 text-gray-500">
            No invoices found
          </Text>
        }
        ListFooterComponent={() => (
          //    <Pagination
          // currentPage={currentPage}
          // totalPages={totalPages}
          // onPageChange={handlePageChange}
          //         />
          // <Text>Foomter</Text>
          renderFooter()
        )}
      />
    </View>
  );
}
