import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export function SettingsRow({
  label,
  onPress,
  icon,
  danger = false,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={danger ? "#EF4444" : COLORS.primary}
          />
        )}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: danger ? "#EF4444" : "#111",
          }}
        >
          {label}
        </Text>
      </View>

      {!danger && (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );
}
