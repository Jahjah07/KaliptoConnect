import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export function SettingsRow({
  label,
  onPress,
  icon,
  danger = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  danger?: boolean;
  disabled?: boolean;
}) {
  const textColor = disabled
    ? "#9CA3AF"
    : danger
    ? "#EF4444"
    : "#111";

  const iconColor = disabled
    ? "#D1D5DB"
    : danger
    ? "#EF4444"
    : COLORS.primary;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={!disabled ? onPress : undefined}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={iconColor}
          />
        )}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: textColor,
          }}
        >
          {label}
        </Text>
      </View>

      {!danger && !disabled && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#9CA3AF"
        />
      )}
    </TouchableOpacity>
  );
}