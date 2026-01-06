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
  campaigns?: { id: number; name?: string }[]; // ✅ SAFE ADD
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

    // ✅ NORMALIZE campaignIds (important)
    const normalizedCampaignIds =
      editingContact.campaignIds?.length
        ? editingContact.campaignIds
        : editingContact.campaigns?.map((c) => c.id) ?? [];

    reset({
      name: editingContact.name ?? "",
      email: editingContact.email ?? "",
      mobile: editingContact.mobile ?? "",
      whatsapp: editingContact.whatsapp ?? "",
      campaignIds: normalizedCampaignIds,
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
        const options =
          data?.campaigns?.map((c: any) => ({
            id: c.id,
            name: c.name,
          })) ?? [];

        setCampaignOptions(options);

        // ✅ FORCE SET VALUE AFTER CAMPAIGNS LOAD (EDGE CASE FIX)
        if (editingContact?.campaignIds?.length) {
          setValue("campaignIds", editingContact.campaignIds);
        }
      } catch (err) {
        console.error("Failed to load campaigns:", err);
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
      if (!token) throw new Error("Authentication token not found");

      if (isEdit) {
        await updateContactApi(Number(contactId), data, token);
        Alert.alert("Success", "Contact updated successfully");
      } else {
        await createContactApi(data, token);
        Alert.alert("Success", "Contact created successfully");
      }

      router.back();
    } catch (error: any) {
      console.error("Contact Error:", error.response || error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  const requiredLabel = (label: string) => (
    <Text className="text-base mt-3 font-semibold text-gray-700">
      {label} <Text className="text-red-500">*</Text>
    </Text>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-gray-50"
    >
      <ScrollView className="flex-1 px-6 py-6">
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", right: 10, zIndex: 10, padding: 8 }}
        >
          <Ionicons name="close" size={24} color="#334155" />
        </TouchableOpacity>

        <View className="flex-row items-center mb-6">
          <View className="w-14 h-14 rounded-lg bg-[#dc2626] items-center justify-center">
            <Ionicons
              name={isEdit ? "person" : "person-add"}
              size={28}
              color="#fff"
            />
          </View>
          <View className="ml-4">
            <Text className="text-2xl font-bold text-gray-800">
              {isEdit ? "Edit Contact" : "Create Contact"}
            </Text>
            <Text className="text-sm text-gray-500">
              {isEdit
                ? "Update the contact details"
                : "Add a new contact to your list"}
            </Text>
          </View>
        </View>

        {/* ===== CAMPAIGNS ===== */}
        <FormControl>
          <Text className="text-base mt-3 font-semibold text-gray-700">
            Associate with Campaigns
          </Text>

          {loadingCampaigns ? (
            <ActivityIndicator size="small" color="#dc2626" />
          ) : campaignOptions.length === 0 ? (
            <Text>No campaigns available</Text>
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
                          ? selectedCampaigns.filter(
                              (id) => id !== campaign.id
                            )
                          : [...selectedCampaigns, campaign.id]
                      )
                    }
                    className="flex-row items-center my-2"
                  >
                    <View className="w-5 h-5 mr-3 border rounded items-center justify-center">
                      {checked && (
                        <Ionicons
                          name="checkmark-outline"
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
          className="w-full mt-10 mb-10 rounded-xl items-center justify-center py-4"
          style={{ backgroundColor: "#dc2626" }}
        >
          <Text className="text-white font-semibold text-lg">
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Contact"
              : "Create Contact"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
