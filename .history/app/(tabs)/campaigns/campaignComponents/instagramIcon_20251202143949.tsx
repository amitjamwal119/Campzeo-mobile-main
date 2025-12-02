import React from "react";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function InstagramIcon() {
  return (
    <LinearGradient
      colors={['#F58529', '#DD2A7B', '#8134AF', '#515BD4']} // Instagram gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FontAwesome name="instagram" size={24} color="#fff" />
    </LinearGradient>
  );
}
