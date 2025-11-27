import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";

export default function CurrentProjectCard() {
  const projectId = "YOUR_PROJECT_ID"; // 👈 Later this comes dynamically
  const { takePhoto } = usePhotoUpload(projectId);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { height: 2, width: 0 },
      }}
    >
      {/* Top */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: COLORS.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="folder" size={26} color="#fff" />
        </View>

        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontWeight: "700", color: "#111" }}>
            Kitchen Renovation
          </Text>
          <Text style={{ color: "#6B7280" }}>📍 123 Main St</Text>
          <Text style={{ color: "#6B7280" }}>0 site • 0 receipts</Text>
        </View>
      </View>

      {/* Buttons */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
          justifyContent: "space-between",
        }}
      >
        {/* TAKE PHOTO */}
        <TouchableOpacity
          onPress={takePhoto}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff" }}>Take Photo</Text>
        </TouchableOpacity>

        {/* View Details */}
        <TouchableOpacity
          style={{
            backgroundColor: "#E5E7EB",
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#111" }}>View Details →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
