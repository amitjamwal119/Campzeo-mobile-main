import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  Avatar,
  AvatarImage,
  Box,
  Divider,
  HStack,
  Modal,
  ModalBackdrop,
  ModalContent,
  Pressable,
  VStack,
} from "@gluestack-ui/themed";
import {
  Briefcase,
  LockKeyhole,
  Mail,
  User,
  UserPen,
} from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";

import { ModalBody, ModalCloseButton, ModalHeader } from "@gluestack-ui/themed";
import { useState } from "react";
import ChangePassword from "../(auth)/changePassword";
import EditProfile from "../(auth)/editProfile";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

export default function UserProfile() {
  const [ShowEditProfile, setEditProfile] = useState(false);

  const [showChangePas, setChangePas] = useState(false);

  const routePage = useRouter();

  const { user } = useUser();

  if (!user) return null;

  return (
    <ThemedView className="flex-1 p-5 pt-20">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- Profile Header ---------- */}
        <HStack>
          <Pressable
            onPress={() => {
              routePage.back();
            }}
          >
            <Ionicons name="arrow-back-outline" size={22} color="#334155" />
          </Pressable>
        </HStack>
        <VStack className="items-center mb-8">
          <Avatar size="xl" className="mb-4">
            <AvatarImage
              source={{
                uri: user.imageUrl,
                // "https://i.pravatar.cc/300?img=12"
              }}
              alt="Profile Picture"
            />
            {/* <AvatarFallbackText>A</AvatarFallbackText> */}
          </Avatar>

          <ThemedText className="text-2xl font-semibold">
            {user.firstName} {user.lastName}
          </ThemedText>

          <ThemedText className="text-base text-gray-500">
            Software Engineer
          </ThemedText>
        </VStack>

        {/* ---------- Details Card ---------- */}
        <Box className="bg-white/10 px-4 py-5 rounded-2xl">
          <VStack space="md">
            {/* UserName */}
            <HStack className="items-center gap-3">
              <User size={22} color="#D55B35" />

              <VStack>
                <ThemedText className="text-sm text-gray-400">
                  Username
                </ThemedText>
                <ThemedText className="text-base font-medium">
                  {user.username}
                </ThemedText>
              </VStack>
            </HStack>

            <Divider />

            {/* EMAIL */}
            <HStack className="items-center gap-3">
              <Mail size={20} color="#D55B35" />
              <VStack>
                <ThemedText className="text-sm text-gray-400">Email</ThemedText>
                <ThemedText className="text-base font-medium">
                  {user.primaryEmailAddress?.emailAddress}
                </ThemedText>
              </VStack>
            </HStack>

            <Divider />

            {/* PHONE */}
            {/* <HStack className="items-center gap-3">
              <Phone size={20} color="#D55B35" />
              <VStack>
                <ThemedText className="text-sm text-gray-400">Phone</ThemedText>
                <ThemedText className="text-base font-medium">
                  +91 78072 71261 
                </ThemedText>
              </VStack>
            </HStack>
            <Divider /> 
            */}

            {/* Organisation */}
            <HStack className="items-center gap-3">
              <Briefcase size={20} color="#D55B35" />
              <VStack>
                <ThemedText className="text-sm text-gray-400">
                  Organisation
                </ThemedText>
                <ThemedText className="text-base font-medium">
                  Software Engineer
                </ThemedText>
              </VStack>
            </HStack>
            <Divider />
          </VStack>
        </Box>

        {/* ---------- Buttons ---------- */}
        <VStack className="mt-8" space="md">
          {/* EDIT PROFILE */}
          <TouchableOpacity
            className="bg-[#D55B35] rounded-xl py-4 flex-row items-center justify-center gap-2"
            onPress={() => setEditProfile(true)}
          >
            <UserPen size={20} color="white" />
            <ThemedText style={{ color: "white", fontWeight: "600" }}>
              Edit Profile
            </ThemedText>
          </TouchableOpacity>

          <Modal
            isOpen={ShowEditProfile}
            onClose={() => {
              setEditProfile(false);
            }}
            size="lg"
          >
            <ModalBackdrop />
            <ModalContent>
              <ModalHeader>
                <ModalCloseButton></ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                {/* =====EPF Form Child====== */}
                <EditProfile
                  closeEPF={() => {
                    setEditProfile(false);
                  }}
                />
              </ModalBody>

              {/* <ModalFooter>
                <Button
                  variant="outline"
                  action="secondary"
                  className="mr-3"
                  onPress={() => {
                    setEditProfile(false);
                  }}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  onPress={() => {
                    setEditProfile(false);
                  }}
                >
                  <ButtonText>Save</ButtonText>
                </Button>
              </ModalFooter> */}
            </ModalContent>
          </Modal>

          {/* CHANGE PASSWORD */}
          <TouchableOpacity
            className="bg-black rounded-xl py-4 flex-row items-center justify-center gap-2"
            onPress={() => setChangePas(true)}
          >
            <LockKeyhole size={20} color="white" />
            <ThemedText style={{ color: "white", fontWeight: "600" }}>
              Change Password
            </ThemedText>
          </TouchableOpacity>

          <Modal
            isOpen={showChangePas}
            onClose={() => {
              setChangePas(false);
            }}
            size="lg"
          >
            <ModalBackdrop />
            <ModalContent>
              <ModalHeader>
                <ModalCloseButton>
                  {/* <Icon as={CloseIcon} /> */}
                </ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                {/* <ThemedText>
                  This is the Change Password body. You can add any content
                  here.
                </ThemedText> */}

                <ChangePassword
                  closeCP={() => {
                    setChangePas(false);
                  }}
                />
              </ModalBody>

              {/* <ModalFooter>
                <Button
                  variant="outline"
                  action="secondary"
                  className="mr-3"
                  onPress={() => {
                    setChangePas(false);
                  }}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  onPress={() => {
                    setChangePas(false);
                  }}
                >
                  <ButtonText>Save</ButtonText>
                </Button>
              </ModalFooter> */}
            </ModalContent>
          </Modal>
        </VStack>
      </ScrollView>
    </ThemedView>
  );
}
