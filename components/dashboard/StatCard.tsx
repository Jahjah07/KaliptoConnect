// components/dashboard/StatCard.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

export default function StatCard({ icon, label, value, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        width: "32%",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        alignItems: "center",
      }}
    >
      <Ionicons name={icon} size={24} color={COLORS.primary} />

      <Text
        style={{
          fontSize: 12,
          color: "#6B7280",
          marginTop: 6,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: COLORS.primaryDark,
          marginTop: 2,
        }}
      >
        {value}
      </Text>
    </Pressable>
  );
}
