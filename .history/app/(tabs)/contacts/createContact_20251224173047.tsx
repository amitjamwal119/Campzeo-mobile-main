import {
  createContactApi,
  updateContactApi,
  getContactByIdApi,
} from "@/api/contact/contactApi";
import { getCampaignsApi } from "@/api/campaign/campaignApi";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { FormControl, Input, InputField } from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
  const { contactId } = useLocalSearchParams();
  const isEdit = !!contactId;

  const [campaignOptions, setCampaignOptions] = useState<CampaignOption[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Contact>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      whatsapp: "",
      campaignIds: [],
    },
  });

  const selectedCampaigns = watch("campaignIds");

  /* ================= FETCH CONTACT (EDIT MODE) ================= */
  useEffect(() => {
    if (!contactId) return;

    const fetchContact = async () => {
      setLoadingContact(true);
      try {
        const token = await getToken();
        if (!token) throw new Error("Token missing");

        const res = await getContactByIdApi(Number(contactId), token);

        reset({
          name: res.contactName ?? "",
          email: res.contactEmail ?? "",
          mobile: res.contactMobile ?? "",
          whatsapp: res.contactWhatsApp ?? "",
          campaignIds: res.campaigns?.map((c: any) => c.id) ?? [],
        });
      } catch (err) {
        console.log("FETCH CONTACT ERROR:", err);
        Alert.alert("Error", "Failed to load contact");
      } finally {
        setLoadingContact(false);
      }
    };

    fetchContact();
  }, [contactId]);

  /* ================= FETCH CAMPAIGNS ================= */
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoadingCampaigns(true);
      try {
        const token = await getToken();
        if (!token) throw new Error("Token missing");

        const res = await getCampaignsApi(token, 1, 50);
        setCampaignOptions(
          res?.campaigns?.map((c: any) => ({
            id: c.id,
            name: c.name,
          })) ?? []
        );
      } catch (err) {
        console.log("FETCH CAMPAIGNS ERROR:", err);
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
      if (!token) throw new Error("Token missing");

      if (isEdit) {
        await updateContactApi(Number(contactId), data, token);
        Alert.alert("Success", "Contact updated successfully");
      } else {
        await createContactApi(data, token);
        Alert.alert("Success", "Contact created successfully");
      }

      router.back();
    } catch (err: any) {
      console.log("SAVE CONTACT ERROR:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  const requiredLabel = (label: string) => (
    <Text className="text-base mt-3 font-semibold text-gray-700">
      {label} <Text className="text-red-500">*</Text>
    </Text>
  );

  /* ================= UI ================= */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-gray-50"
    >
      {(loadingContact || loadingCampaigns) && (
        <View className="absolute inset-0 z-20 items-center justify-center bg-black/10">
          <ActivityIndicator size="large" color="#dc2626" />
        </View>
      )}

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

        {/* ================= FORM ================= */}
        <FormControl isInvalid={!!errors.name}>
          <FormControl.Label>{requiredLabel("Name")}</FormControl.Label>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field: { onChange, value } }) => (
              <Input className="border rounded-xl">
                <InputField value={value} onChangeText={onChange} />
              </Input>
            )}
          />
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormControl.Label>{requiredLabel("Email")}</FormControl.Label>
          <Controller
            control={control}
            name="email"
            rules={{ required: "Email is required" }}
            render={({ field: { onChange, value } }) => (
              <Input className="border rounded-xl">
                <InputField value={value} onChangeText={onChange} />
              </Input>
            )}
          />
        </FormControl>

        <FormControl isInvalid={!!errors.mobile}>
          <FormControl.Label>{requiredLabel("Mobile")}</FormControl.Label>
          <Controller
            control={control}
            name="mobile"
            rules={{ required: "Mobile is required" }}
            render={({ field: { onChange, value } }) => (
              <Input className="border rounded-xl">
                <InputField value={value} onChangeText={onChange} />
              </Input>
            )}
          />
        </FormControl>

        <FormControl isInvalid={!!errors.whatsapp}>
          <FormControl.Label>{requiredLabel("WhatsApp")}</FormControl.Label>
          <Controller
            control={control}
            name="whatsapp"
            rules={{ required: "WhatsApp is required" }}
            render={({ field: { onChange, value } }) => (
              <Input className="border rounded-xl">
                <InputField value={value} onChangeText={onChange} />
              </Input>
            )}
          />
        </FormControl>

        {/* ================= CAMPAIGNS ================= */}
        <Text className="text-base mt-4 font-semibold text-gray-700">
          Associate with Campaigns
        </Text>

        <View className="border rounded-lg p-4 mt-2">
          {campaignOptions.map((campaign) => {
            const checked = selectedCampaigns.includes(campaign.id);
            return (
              <TouchableOpacity
                key={campaign.id}
                className="flex-row items-center my-2"
                onPress={() =>
                  setValue(
                    "campaignIds",
                    checked
                      ? selectedCampaigns.filter((id) => id !== campaign.id)
                      : [...selectedCampaigns, campaign.id]
                  )
                }
              >
                <Ionicons
                  name={checked ? "checkbox" : "square-outline"}
                  size={20}
                  color="#dc2626"
                />
                <Text className="ml-3">{campaign.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="mt-10 rounded-xl py-4 items-center"
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
