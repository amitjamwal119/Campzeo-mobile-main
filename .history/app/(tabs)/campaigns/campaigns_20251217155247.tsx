import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { TouchableOpacity, Animated, Easing, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useRef, useEffect } from "react";

export default function AnimatedBorderButton({ onPress }: { onPress: () => void }) {
  const size = 60; // Button size
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, circumference],
  });

  return (
    <View style={{ width: size, height: size, marginRight: 10 }}>
      <Svg width={size} height={size}>
        <G rotation="-90" originX={size / 2} originY={size / 2}>
          {/* Base Border */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#0284c7"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Moving Light */}
          <Animated.Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#00f0ff"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference / 4}, ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>

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
        }}
      >
        <Ionicons name="add-circle-outline" size={24} color="#0284c7" />
        <Text style={{ position: "absolute", bottom: -18, color: "#0284c7", fontWeight: "600" }}>
          New
        </Text>
      </TouchableOpacity>
    </View>
  );
}
