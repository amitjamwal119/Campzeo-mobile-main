import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { View, Text, Input } from "@gluestack-ui/themed";
import { Controller, useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

import {
  createContactApi,
  updateContactApi,
} from "@/api/contact/contactApi";
import { getCampaignsApi } from "@/api/campaign/campaignApi";
import { getToken } from "@/utils/auth";

type ContactForm = {
  name: string;
  email: string;
  mobile: string;
  whatsapp: string;
  campaignIds: number[];
};

export default function CreateEditContact() {
  const { contactId, editingContact } = useLocalSearchParams();
  const isEdit = Boolean(contactId);

  const hasResetRef = useRef(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      whatsapp: "",
      campaignIds: [],
    },
  });

  /* ================= FETCH CAMPAIGNS ================= */
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await getCampaignsApi(token, 1, 50);

        // SAFETY AGAINST 404 / undefined
        const list =
          res?.data?.campaigns ||
          res?.campaigns ||
          res?.data ||
          [];

        setCampaigns(list);
      } catch (err) {
        console.log("Campaign fetch error", err);
      }
    };

    fetchCampaigns();
  }, []);

  /* ================= PREFILL EDIT DATA ================= */
  useEffect(() => {
    if (!editingContact || hasResetRef.current) return;

    try {
      const parsed =
        typeof editingContact === "string"
          ? JSON.parse(editingContact)
          : editingContact;

      reset({
        name: parsed.name ?? "",
        email: parsed.email ?? "",
        mobile: parsed.mobile ?? "",
        whatsapp: parsed.whatsapp ?? "",
        campaignIds: parsed.campaignIds ?? [],
      });

      hasResetRef.current = true;
    } catch (e) {
      console.log("Edit parse error", e);
    }
  }, [editingContact]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data: ContactForm) => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Token missing");

      if (isEdit) {
        await updateContactApi(Number(contactId), data, token);
        Alert.alert("Success", "Contact updated");
      } else {
        await createContactApi(data, token);
        Alert.alert("Success", "Contact created");
      }

      router.back();
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Something went wrong");
    }
  };

  /* ================= UI ================= */
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-xl font-bold mb-4">
        {isEdit ? "Edit Contact" : "Create Contact"}
      </Text>

      {/* NAME */}
      <Controller
        control={control}
        name="name"
        rules={{ required: "Name required" }}
        render={({ field }) => (
          <Input
            placeholder="Name"
            value={field.value}
            onChangeText={field.onChange}
            className="mb-3"
          />
        )}
      />

      {/* EMAIL */}
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            placeholder="Email"
            value={field.value}
            onChangeText={field.onChange}
            className="mb-3"
          />
        )}
      />

      {/* MOBILE */}
      <Controller
        control={control}
        name="mobile"
        render={({ field }) => (
          <Input
            placeholder="Mobile"
            keyboardType="numeric"
            value={field.value}
            onChangeText={field.onChange}
            className="mb-3"
          />
        )}
      />

      {/* WHATSAPP */}
      <Controller
        control={control}
        name="whatsapp"
        render={({ field }) => (
          <Input
            placeholder="WhatsApp"
            keyboardType="numeric"
            value={field.value}
            onChangeText={field.onChange}
            className="mb-4"
          />
        )}
      />

      {/* ================= CAMPAIGNS ================= */}
      <Text className="text-base font-semibold mb-2">
        Associate with Campaigns
      </Text>

      <Controller
        control={control}
        name="campaignIds"
        render={({ field: { value, onChange } }) => (
          <View className="space-y-2 mb-6">
            {campaigns.length === 0 && (
              <Text className="text-gray-500">
                No campaigns found
              </Text>
            )}

            {campaigns.map((campaign) => {
              const checked = value.includes(campaign.id);

              return (
                <TouchableOpacity
                  key={campaign.id}
                  onPress={() => {
                    if (checked) {
                      onChange(
                        value.filter((id) => id !== campaign.id)
                      );
                    } else {
                      onChange([...value, campaign.id]);
                    }
                  }}
                  className="flex-row items-center bg-white border border-gray-300 rounded-xl px-4 py-3"
                >
                  <Ionicons
                    name={
                      checked ? "checkbox" : "square-outline"
                    }
                    size={22}
                    color={checked ? "#dc2626" : "#64748b"}
                  />
                  <Text className="ml-3">
                    {campaign.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />

      {/* SUBMIT */}
      <TouchableOpacity
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        className="bg-red-600 rounded-xl py-3"
      >
        <Text className="text-white text-center font-semibold">
          {isEdit ? "Update Contact" : "Create Contact"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
