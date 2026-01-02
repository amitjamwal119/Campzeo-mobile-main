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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{record.name}</Text>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => onEdit(record)}>
            <Ionicons name="create-outline" size={22} color="#10b981" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={22} color="#ef4444" /> 
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onCopy(record)}>
            <Ionicons name="copy-outline" size={22} color="#3b82f6" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onToggleShow(record)}>
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
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontWeight: "bold", color: "#111827" }}>Email</Text>
            <Text style={{ color: "#374151" }}>{record.email}</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontWeight: "bold", color: "#111827" }}>Mobile</Text>
            <Text style={{ color: "#374151" }}>{record.mobile}</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontWeight: "bold", color: "#111827" }}>WhatsApp</Text>
            <Text style={{ color: "#374151" }}>{record.whatsapp}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
