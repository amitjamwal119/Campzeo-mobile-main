import { View, Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Input, Button, InputField } from "@gluestack-ui/themed";
import { useState } from "react";
// import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function SignInScreen() {
  const router = useRouter();
  // const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // const handleSendCode = async () => {
  //   if (!isLoaded) return;

  //   setLoading(true);
  //   setErrorMsg("");

  //   try {
  //     const result = await signIn.create({
  //       identifier: email,
  //     });

  //     if (result.firstFactorVerification) {
  //       setPendingVerification(true);
  //     }
  //   } catch (err) {
  //     console.log("Error sending code:", err);
  //     const msg =
  //       (err as any)?.errors?.[0]?.message ||
  //       (err as any)?.message ||
  //       "Failed to send code";

  //     setErrorMsg(msg);
  //   }

  //   setLoading(false);
  // };

  // const handleVerifyCode = async () => {
  //   if (!isLoaded) return;

  //   setLoading(true);
  //   setErrorMsg("");

  //   try {
  //     const result = await signIn.attemptFirstFactor({
  //       strategy: "email_code",
  //       code,
  //     });

  //     if (result.status === "complete") {
  //       await setActive({ session: result.createdSessionId });
  //       router.replace("/(tabs)/dashboard");
  //     }
  //   } catch (err) {
  //     console.log("Code verify error:", err);
  //     const msg =
  //       (err as any)?.errors?.[0]?.message ||
  //       (err as any)?.message ||
  //       "Invalid code";

  //     setErrorMsg(msg);
  //   }

  //   setLoading(false);
  // };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#ffb07c", "#ffffff", "#ffe2d0"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <BlurView
          intensity={50}
          tint="light"
          className="w-[85%] max-w-[400px] rounded-2xl p-6 overflow-hidden bg-[rgba(251,221,221,0.65)] gap-7"
        >
          <Image
            source={require("../../assets/app-images/logo-1.png")}
            style={{
              width: 150,
              height: 50,
              alignSelf: "center",
              marginBottom: 25,
            }}
            resizeMode="contain"
          />

          {/* Email Input */}
          <Input>
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </Input>

          {/* OTP input */}
          {pendingVerification && (
            <Input>
              <InputField
                placeholder="Enter 6-digit code"
                keyboardType="numeric"
                value={code}
                onChangeText={setCode}
              />
            </Input>
          )}

          {/* Error */}
          {errorMsg !== "" && (
            <Text className="text-red-600 font-medium text-center">
              {errorMsg}
            </Text>
          )}

          {/* Main Auth Button */}
          {!pendingVerification ? (
            <Button
              // onPress={handleSendCode}
              className="bg-orange-500 rounded-2xl py-3"
              isDisabled={loading}
            >
              <Text className="text-white font-semibold text-center text-lg">
                {loading ? "Sending code..." : "Send Code"}
              </Text>
            </Button>
          ) : (
            <Button
              // onPress={handleVerifyCode}
              className="bg-green-500 rounded-2xl py-3"
              isDisabled={loading}
            >
              <Text className="text-white font-semibold text-center text-lg">
                {loading ? "Verifying..." : "Verify Code"}
              </Text>
            </Button>
          )}

          {/* 🔥 DEV MODE BUTTON */}
          <Button
            onPress={() => router.replace("/(tabs)/dashboard")}
            className="bg-blue-600 rounded-2xl py-3 mt-2"
          >
            <Text className="text-white font-semibold text-center text-lg">
              Skip Login (Dev Mode)
            </Text>
          </Button>

        </BlurView>
      </LinearGradient>
    </View>
  );
}
