import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ContactsRecord {
  id: number;
  name: string;
  email: string;
  mobile: string;
  whatsapp: string;
  campaigns?: string[]; // Array of campaign names
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
  const [modalVisible, setModalVisible] = useState(false);

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
          {[
            { label: "Email", value: record.email, icon: "mail-outline" },
            { label: "Mobile", value: record.mobile, icon: "call-outline" },
            { label: "WhatsApp", value: record.whatsapp, icon: "logo-whatsapp" },
            { label: "Campaigns", value: record.campaigns, icon: "albums-outline" },
          ].map((item, index) => (
            <View key={index} className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <Ionicons name={item.icon as any} size={18} color="#6b7280" />
                <Text className="text-base font-bold text-gray-700">{item.label}</Text>
              </View>

              {/* Show value or campaign count button */}
              {item.label === "Campaigns" ? (
                item.value && item.value.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="px-3 py-1 rounded-full border border-gray-300"
                  >
                    <Text className="text-base font-semibold text-gray-800">
                      {item.value.length} Campaign{item.value.length > 1 ? "s" : ""}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text className="text-gray-500">No Campaigns</Text>
                )
              ) : (
                <View className="bg-gray-100 px-2 py-0.5 rounded-full">
                  <Text className="text-base text-gray-800">{item.value}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Modal for Campaign Names */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text className="text-lg font-bold mb-4">Campaigns</Text>
            <ScrollView className="mb-4" style={{ maxHeight: 200 }}>
              {record.campaigns?.map((c, i) => (
                <Text key={i} className="text-gray-700 mb-2">
                  {i + 1}. {c}
                </Text>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: "#dc2626",
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text className="text-white font-semibold text-base">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
