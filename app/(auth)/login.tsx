import { useSignIn } from "@clerk/clerk-expo";
import { Button, Input, InputField } from "@gluestack-ui/themed";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import GoogleAuth from "./googleAuth";

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Start the sign-in process
  const onSignInPress = async () => {
    if (!isLoaded) return;
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });

      // Find the email code strategy
      const isEmailCodeFactor = supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );

      if (isEmailCodeFactor) {
        // Send the email code
        const { emailAddressId } = isEmailCodeFactor as any; // Type assertion if needed for older Clerk types
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailAddressId,
        });

        setPendingVerification(true);
        setError(""); // Clear any previous errors
      } else {
        setError("Email code verification not supported for this account.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      const code = err?.errors?.[0]?.code;
      if (code === "form_identifier_not_found") {
        setError("Account not found. Please register first.");
      } else {
        const msg =
          err?.errors?.[0]?.message || "Failed to send verification code";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the code
  const onPressVerify = async () => {
    if (!isLoaded) return;
    if (!code) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Reset state just in case, though we are navigating away
        setPendingVerification(false);
        setEmail("");
        setCode("");
        router.replace("/(tabs)/dashboard");
      } else {
        console.log(result);
        setError("Verification incomplete. Please check your code.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const msg = err?.errors?.[0]?.message || "Verification failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={["#ffb07c", "#ffffff", "#ffe2d0"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <BlurView
          intensity={50}
          tint="light"
          className="w-[85%] max-w-[400px] rounded-lg p-6 bg-[rgba(251,221,221,0.65)] gap-7"
        >
          {/* Logo */}
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

          {!pendingVerification ? (
            <>
              {/* Step 1: Email Input */}
              <Input>
                <InputField
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </Input>

              {/* Error Display */}
              {error !== "" && (
                <Text className="text-red-600 font-medium text-center">
                  {error}
                </Text>
              )}

              {/* Get Code Button */}
              <Button
                onPress={onSignInPress}
                isDisabled={loading}
                className="bg-orange-500 rounded-2xl py-3"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold text-center text-lg">
                    Get Verification Code
                  </Text>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Step 2: Code Input */}
              <View>
                <Text className="text-gray-600 text-center mb-2">
                  Enter the code sent to {email}
                </Text>
                <Input>
                  <InputField
                    placeholder="Verification Code"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                  />
                </Input>
              </View>

              {/* Error Display */}
              {error !== "" && (
                <Text className="text-red-600 font-medium text-center">
                  {error}
                </Text>
              )}

              {/* Verify Code Button */}
              <Button
                onPress={onPressVerify}
                isDisabled={loading}
                className="bg-orange-500 rounded-2xl py-3"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold text-center text-lg">
                    Verify Code / Sign In
                  </Text>
                )}
              </Button>

              {/* Back Button (optional, to correct email) */}
              <Button
                variant="link"
                onPress={() => {
                  setPendingVerification(false);
                  setError("");
                  setCode("");
                }}
                className="mt-2"
              >
                <Text className="text-gray-500 text-sm">Change Email</Text>
              </Button>
            </>
          )}

          {/* Google Auth Button */}
          <GoogleAuth />
        </BlurView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

// <Button
//             onPress={() => router.replace("/(tabs)/dashboard")}
//             className="bg-blue-600 rounded-2xl py-3 mt-2"
//           >
//             <Text className="text-white font-semibold text-center text-lg">
//               Skip Login (Dev Mode)
//             </Text>
//           </Button>
