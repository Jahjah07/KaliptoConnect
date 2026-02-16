import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";

interface Props {
  title: string;
  value?: string;
  loading?: boolean;
  progress?: number | null;
  badgeText?: string;
  badgeColor?: string;

  onPrimaryAction: () => void;
  onReplace?: () => void;
  onSetExpiry?: () => void;
  onDelete?: () => void;
}

export default function DocumentUploadCard({
  title,
  value,
  loading = false,
  progress = null,
  badgeText,
  badgeColor = COLORS.primary,

  onPrimaryAction,
  onReplace,
  onSetExpiry,
  onDelete,
}: Props) {
  const hasDoc = Boolean(value);
  const isUploading = loading && typeof progress === "number";

  return (
    <View
      style={{
        backgroundColor: "#F9FAFB",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: hasDoc ? 1 : 1.5,
        borderColor: hasDoc ? "#E5E7EB" : COLORS.error,
      }}
    >
      {/* ---------- HEADER ---------- */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <View
          style={{
            backgroundColor: badgeColor + "22",
            padding: 10,
            borderRadius: 12,
            marginRight: 12,
          }}
        >
          <Ionicons
            name={hasDoc ? "document-text" : "alert-circle"}
            size={22}
            color={badgeColor}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>{title}</Text>

          {badgeText && (
            <Text style={{ fontSize: 13, color: badgeColor, marginTop: 2 }}>
              {badgeText}
            </Text>
          )}
        </View>

        {hasDoc && (
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={COLORS.primary}
          />
        )}
      </View>

      {/* ---------- PRIMARY ACTION ---------- */}
      <Pressable
        onPress={onPrimaryAction}
        disabled={loading}
        style={{
          paddingVertical: 12,
          borderRadius: 12,
          backgroundColor: hasDoc ? "#E5E7EB" : COLORS.primary,
          alignItems: "center",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color={hasDoc ? COLORS.primary : "#fff"} />
        ) : (
          <Text
            style={{
              color: hasDoc ? COLORS.primaryDark : "#fff",
              fontWeight: "700",
            }}
          >
            {hasDoc ? "View Document" : "Upload Document"}
          </Text>
        )}
      </Pressable>

      {/* ---------- UPLOAD PROGRESS ---------- */}
      {isUploading && (
        <Text
          style={{
            marginTop: 8,
            fontSize: 13,
            color: COLORS.primary,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Uploading… {progress}%
        </Text>
      )}

      {/* ---------- SECONDARY ACTIONS ---------- */}
      {hasDoc && !loading && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 12,
          }}
        >
          {onReplace && (
            <Pressable onPress={onReplace}>
              <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                Replace
              </Text>
            </Pressable>
          )}

          {onSetExpiry && (
            <Pressable onPress={onSetExpiry}>
              <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                Set Expiry
              </Text>
            </Pressable>
          )}

          {onDelete && (
            <Pressable onPress={onDelete}>
              <Text style={{ color: COLORS.error, fontWeight: "600" }}>
                Delete
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
