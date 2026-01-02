import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ContactsRecord {
  id: number;
  name: string;
  email: string;
  mobile: string;
  whatsapp: string;
  campaigns?: { id: number; name: string }[]; // <-- Add campaigns here
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
        <Text className="font-bold text-lg text-gray-900">{record.name}</Text>

        <View className="flex-row">
          <TouchableOpacity onPress={() => onEdit(record)} className="mx-1">
            <Ionicons name="create-outline" size={22} color="#10b981" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDelete(record)} className="mx-1">
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
          {[ 
            { label: "Email", value: record.email, icon: "mail-outline", color: "0000ff" },
            { label: "Mobile", value: record.mobile, icon: "call-outline", color: "6b7280" },
            { label: "WhatsApp", value: record.whatsapp, icon: "logo-whatsapp", color: "16a34a" },
          ].map((item, index) => (
            <View key={index} className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <Ionicons name={item.icon as any} size={18} color={`#${item.color}`} />
                <Text className="text-base font-bold text-gray-700">{item.label}</Text>
              </View>
              <View className="bg-gray-100 px-2 py-0.5 rounded-full">
                <Text className="text-base text-gray-800">{item.value}</Text>
              </View>
            </View>
          ))}

          {/* Campaigns Section */}
          <View className="mt-3">
            <Text className="text-base font-semibold text-gray-700 mb-1">
              Campaigns
            </Text>
            {record.campaigns && record.campaigns.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {record.campaigns.map((camp) => (
                  <View
                    key={camp.id}
                    className="px-3 py-1 bg-gray-100 rounded-full border border-gray-300"
                  >
                    <Text className="text-sm text-gray-800">{camp.name}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-400">No campaigns</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
