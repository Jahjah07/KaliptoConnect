import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  id: string;
  name: string;
  address?: string;

  projectStatus?: "Pending" | "Ongoing" | "Completed" | "Cancelled";
  assignmentStatus?: "Pending" | "Ongoing" | "Completed";
}

const assignmentColors: Record<string, string> = {
  Pending: "#F59E0B",
  Ongoing: "#22C55E",
  Completed: "#3B82F6",
};

export default function ProjectListCard({
  id,
  name,
  address,
  projectStatus,
  assignmentStatus,
}: Props) {
  const router = useRouter();

  const isCancelled = projectStatus === "Cancelled";

  const badgeColor = isCancelled
    ? "#EF4444"
    : assignmentColors[assignmentStatus ?? "Pending"] || "#6B7280";

  const badgeText = isCancelled
    ? "Cancelled"
    : assignmentStatus ?? "Pending";

  return (
    <TouchableOpacity
      onPress={() =>
        id &&
        router.push({
          pathname: "/(dashboard)/project/[id]",
          params: { id },
        })
      }
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

      <View style={{ marginLeft: 14, flex: 1 }}>
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

        {address && (
          <Text style={{ color: "#6B7280", fontSize: 13, marginBottom: 4 }}>
            {address}
          </Text>
        )}

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
            {badgeText}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}