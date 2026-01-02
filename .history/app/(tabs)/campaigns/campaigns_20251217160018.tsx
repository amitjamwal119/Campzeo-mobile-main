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

export default function campaigns() {
  const size = 60;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const rotation = useSharedValue(0);

  rotation.value = withRepeat(
    withTiming(360, { duration: 2000, easing: Easing.linear }),
    -1,
    false
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: (rotation.value / 360) * circumference,
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G rotation="-90" originX={size / 2} originY={size / 2}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#0284c7"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#00f0ff"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference / 4}, ${circumference}`}
            animatedProps={animatedProps}
            strokeLinecap="round"
          />
        </G>
      </Svg>

      <TouchableOpacity
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
        }}
      >
        <Ionicons name="add-circle-outline" size={24} color="#0284c7" />
        <Text
          style={{
            position: "absolute",
            bottom: -18,
            color: "#0284c7",
            fontWeight: "600",
          }}
        >
          New
        </Text>
      </TouchableOpacity>
    </View>
  );
}
