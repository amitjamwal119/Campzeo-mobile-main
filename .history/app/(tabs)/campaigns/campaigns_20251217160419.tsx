import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AnimatedNewButton({ onPress }: { onPress: () => void }) {
  const size = 60; // Button width & height
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Shared value for animation
  const rotation = useSharedValue(0);

  // Clockwise rotation animation
  rotation.value = withRepeat(
    withTiming(360, { duration: 2000, easing: Easing.linear }),
    -1, // Infinite
    false
  );

  // Animated strokeDashoffset
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: (rotation.value / 360) * circumference,
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G rotation="-90" originX={size / 2} originY={size / 2}>
          {/* Base border */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#0284c7"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Moving glowing border */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#00f0ff"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference / 4}, ${circumference}`}
            strokeLinecap="round"
            animatedProps={animatedProps}
          />
        </G>
      </Svg>

      {/* Your original button content */}
      <TouchableOpacity
        onPress={onPress}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: size / 2,
          backgroundColor: "#e0f2fe",
          flexDirection: "row",
        }}
      >
        <Ionicons name="add-circle-outline" size={20} color="#0284c7" />
        <Text style={{ marginLeft: 4, fontWeight: "600", color: "#0284c7" }}>New</Text>
      </TouchableOpacity>
    </View>
  );
}
