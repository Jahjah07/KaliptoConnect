import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { Link } from "expo-router";

interface Props {
  id: string;
  name: string;
  address?: string;
  status?: string;
}

export default function ProjectListCard({ id, name, address, status }: Props) {
  return (
    <Link href={`/(dashboard)/project/${id}`} asChild>
      <TouchableOpacity
        style={{
          backgroundColor: "#fff",
          padding: 18,
          borderRadius: 14,
          marginBottom: 14,
          shadowOpacity: 0.05,
          shadowRadius: 6,
          shadowOffset: { height: 2, width: 0 },
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            backgroundColor: "#E0E7FF",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="folder" size={22} color={COLORS.primary} />
        </View>

        {/* Text */}
        <View style={{ marginLeft: 14 }}>
          <Text style={{ fontWeight: "700", color: "#111", fontSize: 16 }}>
            {name}
          </Text>
          <Text style={{ color: "#6B7280", marginTop: 2 }}>
            {status || "No status"}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
