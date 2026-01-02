import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Contact } from "lucide-react-native";
      import { LinearGradient } from "expo-linear-gradient";


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
      {/* import { LinearGradient } from "expo-linear-gradient"; */}

{record.show && (
  <LinearGradient
    colors={["#d9f99d", "#86efac"]}
    start={[0, 0]}
    end={[1, 1]}
    className="mt-3 p-3 rounded-xl"
  >
    <View className="space-y-2">
      <View className="flex-row justify-between">
        <Text className="text-sm font-medium text-gray-700">Email</Text>
        <Text className="text-sm font-bold text-gray-900">{record.email}</Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-sm font-medium text-gray-700">Mobile</Text>
        <Text className="text-sm font-bold text-gray-900">{record.mobile}</Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-sm font-medium text-gray-700">WhatsApp</Text>
        <Text className="text-sm font-bold text-gray-900">{record.whatsapp}</Text>
      </View>
    </View>
  </LinearGradient>
)}

    </View>
  );
}
