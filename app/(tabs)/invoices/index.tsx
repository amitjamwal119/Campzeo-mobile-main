import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { fetchInvoices } from "@/api/invoicesApi";
import { Invoice } from "@/types/types";

export default function Invoices() {
  const { user, isLoaded } = useUser();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const loadInvoices = async () => {
      try {
        const data = await fetchInvoices(user.id);
        setInvoices(data.invoices);
      } catch (error) {
        console.log("Error loading invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [isLoaded, user]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-4">

      {invoices.length === 0 ? (
        <View className="items-center mt-10">
          <Text className="text-gray-500">No invoices found</Text>
        </View>
      ) : (
        invoices.map((item) => (
          <View
            key={item.id}
            className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200"
          >
            <View className="flex-row justify-between mb-2">
              <Text className="font-semibold text-gray-800">
                Invoice ID: #{item.id}
              </Text>
              <Text
                className={`font-semibold ${
                  item.status === "PAID"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {item.status}
              </Text>
            </View>

            <Text className="text-sm text-gray-600 mb-1">
              Date: {new Date(item.invoiceDate).toLocaleDateString()}
            </Text>

            <Text className="text-sm text-gray-600 mb-1">
              Description: {item.description}
            </Text>

            <Text className="text-base font-bold text-gray-900 mt-2">
              Amount: ₹{item.amount}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
