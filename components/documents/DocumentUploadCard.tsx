// components/documents/DocumentUploadCard.tsx
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function DocumentUploadCard({
  title,
  subtitle,
  value,
  expiry,
  icon,
  statusColor = COLORS.primary,
  onUpload,
  onExpiryChange,
}: any) {
  const isMissing = !value;

  return (
    <View
      style={{
        backgroundColor: "#F9FAFB",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: isMissing ? 1.6 : 1,
        borderColor: isMissing ? COLORS.error : "#E5E7EB",
      }}
    >
      {/* HEADER */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <View
          style={{
            backgroundColor: statusColor + "22",
            padding: 10,
            borderRadius: 12,
            marginRight: 12,
          }}
        >
          <Ionicons name={icon} size={22} color={statusColor} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>{title}</Text>
          <Text style={{ color: "#6B7280", fontSize: 13 }}>{subtitle}</Text>
        </View>

        {value ? (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
        ) : (
          <Ionicons name="alert-circle" size={24} color={COLORS.error} />
        )}
      </View>

      {/* PREVIEW + ACTIONS */}
      {value ? (
        <View>
          <Image
            source={{ uri: value }}
            style={{
              width: "100%",
              height: 140,
              borderRadius: 12,
              marginBottom: 10,
            }}
          />

          {expiry && (
            <Text style={{ fontSize: 13, color: COLORS.primaryDark }}>
              Expires: {expiry}
            </Text>
          )}

          <TouchableOpacity onPress={onUpload}>
            <Text
              style={{
                marginTop: 10,
                color: COLORS.primary,
                fontWeight: "600",
              }}
            >
              Replace Document
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onUpload}
          style={{
            marginTop: 8,
            paddingVertical: 10,
            backgroundColor: COLORS.primary,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
            Upload Document
          </Text>
        </TouchableOpacity>
      )}

      {/* EXPIRY BUTTON */}
      {value && (
        <TouchableOpacity onPress={onExpiryChange} style={{ marginTop: 8 }}>
          <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
            Update Expiry Date
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
