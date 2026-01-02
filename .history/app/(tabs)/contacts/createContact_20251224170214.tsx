import {
  createContactApi,
  updateContactApi,
} from "@/api/contact/contactApi";
import { getCampaignsApi } from "@/api/campaign/campaignApi";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { FormControl, Input, InputField } from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

type Contact = {
  id?: number;
  name: string;
  email: string;
  mobile: string;
  whatsapp: string;
  campaignIds: number[];
};

type CampaignOption = {
  id: number;
  name: string;
};

export default function CreateContact() {
  const { getToken } = useAuth();
  const [campaignOptions, setCampaignOptions] = useState<CampaignOption[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  const { contactId, record: recordStr } = useLocalSearchParams();
  const isEdit = !!contactId;

  const editingContact: Contact | null = recordStr
    ? JSON.parse(recordStr as string)
    : null;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Contact>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      whatsapp: "",
      campaignIds: [],
    },
    mode: "onChange",
  });

  const selectedCampaigns = watch("campaignIds");
  const hasResetRef = useRef(false);

  /* ================= PREFILL FORM ON EDIT ================= */
  useEffect(() => {
    if (!editingContact || hasResetRef.current) return;

    reset({
      name: editingContact.name ?? "",
      email: editingContact.email ?? "",
      mobile: editingContact.mobile ?? "",
      whatsapp: editingContact.whatsapp ?? "",
      campaignIds: editingContact.campaignIds ?? [],
    });

    hasResetRef.current = true;
  }, [editingContact]);

  /* ================= FETCH CAMPAIGNS ================= */
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoadingCampaigns(true);
      try {
        const token = await getToken();
        if (!token) throw new Error("Token missing");

        const data = await getCampaignsApi(token, 1, 50);
        setCampaignOptions(
          data?.campaigns?.map((c: any) => ({
            id: c.id,
            name: c.name,
          })) ?? []
        );
      } catch {
        Alert.alert("Error", "Failed to load campaigns");
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, []);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data: Contact) => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Auth token missing");

      if (isEdit) {
        await updateContactApi(Number(contactId), data, token);
        Alert.alert("Success", "Contact updated successfully");
      } else {
        await createContactApi(data, token);
        Alert.alert("Success", "Contact created successfully");
      }

      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  /* ================= UI ================= */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-gray-50"
    >
      <ScrollView className="px-6 py-6">
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", right: 10, padding: 8 }}
        >
          <Ionicons name="close" size={24} color="#334155" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Contact" : "Create Contact"}
        </Text>

        {/* CAMPAIGNS */}
        <FormControl>
          <Text className="font-semibold text-gray-700 mb-2">
            Associate with Campaigns
          </Text>

          {loadingCampaigns ? (
            <ActivityIndicator color="#dc2626" />
          ) : (
            <View className="border border-gray-300 rounded-lg p-4">
              {campaignOptions.map((campaign) => {
                const checked = selectedCampaigns.includes(campaign.id);
                return (
                  <TouchableOpacity
                    key={campaign.id}
                    onPress={() =>
                      setValue(
                        "campaignIds",
                        checked
                          ? selectedCampaigns.filter((id) => id !== campaign.id)
                          : [...selectedCampaigns, campaign.id]
                      )
                    }
                    className="flex-row items-center my-2"
                  >
                    <View className="w-5 h-5 mr-3 border rounded items-center justify-center">
                      {checked && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="#dc2626"
                        />
                      )}
                    </View>
                    <Text>{campaign.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </FormControl>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="mt-10 py-4 rounded-xl items-center"
          style={{ backgroundColor: "#dc2626" }}
        >
          <Text className="text-white text-lg font-semibold">
            {isEdit ? "Update Contact" : "Create Contact"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
