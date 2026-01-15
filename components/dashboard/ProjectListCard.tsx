import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  id: string;
  name: string;
  address?: string;
  status?: string;
}

const statusColors: any = {
  Active: "#22C55E",
  Pending: "#F59E0B",
  Completed: "#3B82F6",
};

export default function ProjectListCard({ id, name, address, status }: Props) {
  const router = useRouter();
  const badgeColor = statusColors[status ?? "Pending"] || "#6B7280";

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(dashboard)/project/${id}`)}
        style={{
          backgroundColor: "#fff",
          padding: 18,
          borderRadius: 14,
          marginBottom: 16,
          shadowOpacity: 0.05,
          shadowRadius: 6,
          shadowOffset: { height: 2, width: 0 },
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Left Icon */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: COLORS.primary + "15",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="folder-outline" size={22} color={COLORS.primary} />
        </View>

        {/* Right Content */}
        <View style={{ marginLeft: 14, flex: 1 }}>
          {/* Project Name */}
          <Text
            style={{
              fontWeight: "700",
              color: "#111",
              fontSize: 16,
              marginBottom: 4,
            }}
          >
            {name}
          </Text>

          {/* Address (if any) */}
          {address && (
            <Text style={{ color: "#6B7280", fontSize: 13, marginBottom: 4 }}>
              {address}
            </Text>
          )}

          {/* Status Badge */}
          {status && (
            <View
              style={{
                backgroundColor: badgeColor + "22",
                paddingVertical: 4,
                paddingHorizontal: 12,
                borderRadius: 10,
                alignSelf: "flex-start",
                marginTop: 2,
              }}
            >
              <Text
                style={{
                  color: badgeColor,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                {status}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
  );
}
