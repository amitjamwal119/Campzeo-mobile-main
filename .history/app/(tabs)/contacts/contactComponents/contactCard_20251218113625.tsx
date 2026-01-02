import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Contact } from "lucide-react-native";

export interface ContactsRecord {
  id: number;
  name: string;
  email: string;
  mobile: string;
  whatsapp: string;
  show?: boolean;
}

interface RecordCardProps {
  record: ContactsRecord;
  onEdit: (record: ContactsRecord) => void;
  onDelete: (record: ContactsRecord) => void;
  onCopy: (record: ContactsRecord) => void;
  onToggleShow: (record: ContactsRecord) => void;
}

export default function ContactCard({
  record,
  onEdit,
  onDelete,
  onCopy,
  onToggleShow,
}: RecordCardProps) {

  // Delete with confirmation
  const handleDelete = () => {
    onDelete(record);
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      {/* Name + Icons */}
      <View className="flex-row justify-between items-center">
        <Text className="font-bold text-lg text-gray-900">
          {record.name}
        </Text>

        <View className="flex-row">
          <TouchableOpacity onPress={() => onEdit(record)} className="mx-1">
            <Ionicons name="create-outline" size={22} color="#10b981" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDelete} className="mx-1">
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onCopy(record)} className="mx-1">
            <Ionicons name="copy-outline" size={22} color="#3b82f6" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onToggleShow(record)}
            className="mx-1"
          >
            <Ionicons
              name={record.show ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#6b7280"
            />
          </TouchableOpacity>
        </View>
      </View>


      {/* Details */}
      {record.show && (
  <View className="mt-3 space-y-2">
    <View className="flex-row justify-between items-center">
      <View className="flex-row items-center gap-2">
        <View className="w-2 h-2 bg-blue-500 rounded-full" />
        <Ionicons name="mail-outline" size={16} color="#6b7280" />
        <Text className="text-sm text-gray-700">Email</Text>
      </View>
      <Text className="text-sm text-gray-900">{record.email}</Text>
    </View>

    <View className="flex-row justify-between items-center">
      <View className="flex-row items-center gap-2">
        <View className="w-2 h-2 bg-gray-500 rounded-full" />
        <Ionicons name="call-outline" size={16} color="#6b7280" />
        <Text className="text-sm text-gray-700">Mobile</Text>
      </View>
      <Text className="text-sm text-gray-900">{record.mobile}</Text>
    </View>

    <View className="flex-row justify-between items-center">
      <View className="flex-row items-center gap-2">
        <View className="w-2 h-2 bg-green-500 rounded-full" />
        <Ionicons name="logo-whatsapp" size={16} color="#22c55e" />
        <Text className="text-sm text-gray-700">WhatsApp</Text>
      </View>
      <Text className="text-sm text-gray-900">{record.whatsapp}</Text>
    </View>
  </View>
)}

    </View>
  );
}
