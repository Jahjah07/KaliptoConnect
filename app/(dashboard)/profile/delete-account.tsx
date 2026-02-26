"use client";

import { COLORS } from "@/constants/colors";
import { requestAccountDeletion } from "@/services/deleteAccount.service";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function DeleteAccountScreen() {
  const [loading, setLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const navigation = useNavigation();
  async function handleDelete() {
    try {
      setLoading(true);
      setConfirmVisible(false);

      await requestAccountDeletion();

      Toast.show({
        type: "success",
        text1: "Deletion Scheduled",
        text2:
          "Your account will be permanently deleted in 7 days. You can cancel anytime before then.",
      });

      router.replace("/home");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Deletion Failed",
        text2:
          "For security reasons, please log in again and retry.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.background }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        <Pressable
          onPress={() => router.push("/(dashboard)/profile")}
          hitSlop={10}
          style={{ flex: 1, flexDirection: "row", marginRight: 12, marginTop: 40 }}
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color={COLORS.primaryDark}
          />
          <Text
            style={{
              color: COLORS.primaryDark,
              fontSize: 16,
              marginTop: 4,
            }}
          >
            Back
          </Text>
        </Pressable>
        {/* ICON */}
        <View style={{ alignItems: "center", marginTop: 40, marginBottom: 24 }}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: "#FEE2E2",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="trash-outline" size={36} color="#EF4444" />
          </View>
        </View>

        {/* TITLE */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#111",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Delete Account
        </Text>

        {/* DESCRIPTION */}
        <Text
          style={{
            fontSize: 15,
            lineHeight: 22,
            color: "#6B7280",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          Deleting your account will permanently remove all your data.
          This action cannot be undone after the grace period.
        </Text>

        {/* INFO CARD */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <InfoRow text="Your profile will be removed" />
          <Divider />
          <InfoRow text="You have 7 days to cancel deletion" danger />
        </View>

        {/* DELETE BUTTON */}
        <TouchableOpacity
          onPress={() => setConfirmVisible(true)}
          disabled={loading}
          style={{
            backgroundColor: "#EF4444",
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Schedule Account Deletion
            </Text>
          )}
        </TouchableOpacity>

        {!loading && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginTop: 20, alignItems: "center" }}
          >
            <Text style={{ color: COLORS.primary, fontSize: 16 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* CONFIRM MODAL */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 12,
              }}
            >
              Confirm Deletion
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                marginBottom: 20,
              }}
            >
              Your account will be permanently deleted after 7 days.
              You can cancel anytime before then.
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: "#E5E7EB",
                  alignItems: "center",
                }}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={{ fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: "#EF4444",
                  alignItems: "center",
                }}
                onPress={handleDelete}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

/* ---------------------------- */

function InfoRow({
  text,
  danger,
}: {
  text: string;
  danger?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Ionicons
        name={danger ? "warning-outline" : "checkmark-circle-outline"}
        size={20}
        color={danger ? "#EF4444" : "#10B981"}
      />
      <Text
        style={{
          fontSize: 15,
          color: danger ? "#EF4444" : "#111",
          fontWeight: danger ? "600" : "500",
          flex: 1,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 14,
      }}
    />
  );
}