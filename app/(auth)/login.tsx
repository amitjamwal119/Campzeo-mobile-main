import { View, Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Input, Button, InputField } from "@gluestack-ui/themed";



export default function Login() {
  // const routePage = useRouter();

  return (
    <View className="flex-1">
      {/* Background Gradient */}
      <LinearGradient
        colors={["#ffb07c", "#ffffff", "#ffe2d0"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        {/* BlurView Card */}
        <BlurView
          intensity={50}
          tint="light"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
          }}
          className="w-[85%] max-w-[400px] rounded-2xl p-6 overflow-hidden bg-[rgba(251,221,221,0.65)] gap-7 ">
          {/* CampZeo Logo */}
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
            <InputField placeholder="Email" type="text" />
          </Input>

          {/* Password Input */}
          <Input>
            <InputField placeholder="Password" type="password" />
          </Input>

          {/* Login Button */}
          <Button
            // onPress={() => router.push("/(tabs)")}
            className="bg-orange-500 rounded-2xl py-3"
          >
            <Text className="text-white font-semibold text-center text-lg">
              Log In
            </Text>
          </Button>
        </BlurView>
      </LinearGradient>
    </View>
  );
}
