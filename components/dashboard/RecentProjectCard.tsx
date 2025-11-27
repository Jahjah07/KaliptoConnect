import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RecentProjectCard() {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { height: 2, width: 0 },
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#E0E7FF",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="folder-open" size={20} color="#4A63FF" />
        </View>

        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontWeight: "700", color: "#111" }}>
            Kitchen Renovation
          </Text>
          <Text style={{ color: "#6B7280" }}>📍 123 Main St</Text>
        </View>
      </View>
    </View>
  );
}
