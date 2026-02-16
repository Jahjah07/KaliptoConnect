import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProjectCard({
  label,
  subtitle,
  active,
  onPress,
}: {
  label: string;
  subtitle: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 160,
        padding: 14,
        marginRight: 12,
        borderRadius: 14,
        backgroundColor: "#fff",
        borderWidth: active ? 2 : 1,
        borderColor: active ? COLORS.primary : "#E5E7EB",
      }}
    >
      <Text style={{ fontWeight: "700", fontSize: 15 }}>{label}</Text>
      <Text style={{ marginTop: 6, color: "#6B7280", fontSize: 13 }}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

/* -----------------------------
   EMPTY STATE
------------------------------*/
export function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 80, height: "100%" }}>
      <Ionicons name="image-outline" size={50} color="#9CA3AF" />
      <Text style={{ fontSize: 18, color: "#374151", marginTop: 12 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 6 }}>
        {subtitle}
      </Text>
    </View>
  );
}