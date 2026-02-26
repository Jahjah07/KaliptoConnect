import { cancelAccountDeletion } from "@/services/deleteAccount.service";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

type Props = {
  accountStatus?: "active" | "pending_deletion" | "deleted";
  deletionScheduledAt?: string | Date | null;
  onCancelled?: () => void;
};

export function AccountLifecycleBanner({
  accountStatus,
  deletionScheduledAt,
  onCancelled,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (accountStatus !== "pending_deletion") return null;

  const formattedDate = deletionScheduledAt
    ? new Date(deletionScheduledAt).toLocaleDateString()
    : "soon";

  async function handleCancel() {
    try {
      setLoading(true);
      await cancelAccountDeletion();

      Toast.show({
        type: "success",
        text1: "Deletion Cancelled",
        text2: "Your account is fully active again.",
      });

      onCancelled?.();
    } catch {
      Toast.show({
        type: "error",
        text1: "Unable to Cancel",
        text2: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{
        backgroundColor: "#FEF3C7",
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#F59E0B",
      }}
    >
      <Text
        style={{
          fontWeight: "700",
          color: "#92400E",
          marginBottom: 6,
        }}
      >
        Account Scheduled for Deletion
      </Text>

      <Text style={{ color: "#78350F", fontSize: 13 }}>
        Your account will be permanently deleted on {formattedDate}.
      </Text>

      <TouchableOpacity
        disabled={loading}
        onPress={handleCancel}
        style={{
          marginTop: 14,
          backgroundColor: "#F59E0B",
          paddingVertical: 10,
          borderRadius: 10,
          alignItems: "center",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Cancel Deletion
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}