import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

export type IconName = keyof typeof Ionicons.glyphMap;

interface StatCardProps {
  icon: IconName;
  label: string;
  value: string | number;
}

export default function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <View
      style={{
        backgroundColor: COLORS.primary,
        padding: 16,
        width: "30%",
        borderRadius: 16,
        alignItems: "center",
      }}
    >
      <Ionicons name={icon} size={26} color="#fff" />
      <Text style={{ color: "#fff", fontWeight: "700", marginTop: 8 }}>
        {value}
      </Text>
      <Text style={{ color: "#DCE3FF", fontSize: 12 }}>{label}</Text>
    </View>
  );
}
