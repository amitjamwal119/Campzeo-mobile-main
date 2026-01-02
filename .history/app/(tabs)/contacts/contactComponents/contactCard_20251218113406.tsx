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
    <View className="flex-row justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
      <Text className="text-sm font-medium text-gray-600">Email</Text>
      <Text className="text-sm text-gray-800">{record.email}</Text>
    </View>

    <View className="flex-row justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
      <Text className="text-sm font-medium text-gray-600">Mobile</Text>
      <Text className="text-sm text-gray-800">{record.mobile}</Text>
    </View>

    <View className="flex-row justify-between items-center bg-green-50 rounded-lg px-3 py-2">
      <Text className="text-sm font-medium text-green-700">WhatsApp</Text>
      <Text className="text-sm text-green-800">{record.whatsapp}</Text>
    </View>
  </View>
)}

    </View>
  );
}
