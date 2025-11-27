import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

type Props = {
  title: string;
  value?: string;
  expiry?: string;
  onUpload: () => void;
  onExpiryChange?: () => void; // made optional
};

export default function DocumentUploadCard({
  title,
  value,
  expiry,
  onUpload,
  onExpiryChange,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 8 }}>
        {title}
      </Text>

      {value ? (
        <Image
          source={{ uri: value }}
          style={{
            width: "100%",
            height: 120,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />
      ) : (
        <View
          style={{
            height: 120,
            backgroundColor: "#F3F4F6",
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons name="document-outline" size={36} color="#9CA3AF" />
          <Text style={{ color: "#9CA3AF", marginTop: 6 }}>No File</Text>
        </View>
      )}

      {/* Buttons */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* Upload */}
        <TouchableOpacity
          onPress={onUpload}
          style={{
            flex: 1,
            backgroundColor: COLORS.primary,
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Upload</Text>
        </TouchableOpacity>

        {/* Expiry */}
        <TouchableOpacity
          onPress={() => onExpiryChange?.()}
          style={{
            flex: 1,
            backgroundColor: "#E5E7EB",
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#111", fontWeight: "600" }}>
            {expiry ? `Expiry: ${expiry}` : "Set Expiry"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
