"use client";

import { COLORS } from "@/constants/colors";
import { deleteAccount } from "@/services/deleteAccount.service";
import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DeleteAccountScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  async function confirmDelete() {
    Alert.alert(
      "Delete Account",
      "This action is permanent. All your data, including photos, receipts, and records, will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: handleDelete,
        },
      ]
    );
  }

  async function handleDelete() {
    try {
      setLoading(true);
      await deleteAccount();
      setUser(null);
      router.replace("/(auth)/login");
    } catch (err) {
      Alert.alert(
        "Unable to Delete Account",
        "For security reasons, please log in again and retry account deletion."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      {/* ICON */}
      <View
        style={{
          alignItems: "center",
          marginTop: 40,
          marginBottom: 24,
        }}
      >
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
        Deleting your account will permanently remove all your data from our
        systems. This includes your profile, uploaded photos, receipts, and all
        associated records.
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
        <InfoRow text="Your account profile will be removed" />
        <Divider />
        <InfoRow text="All uploaded photos and receipts will be deleted" />
        <Divider />
        <InfoRow text="This action cannot be undone" danger />
      </View>

      {/* DELETE BUTTON */}
      <TouchableOpacity
        onPress={confirmDelete}
        disabled={loading}
        style={{
          backgroundColor: "#EF4444",
          paddingVertical: 16,
          borderRadius: 14,
          alignItems: "center",
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
            Permanently Delete Account
          </Text>
        )}
      </TouchableOpacity>

      {/* CANCEL */}
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
  );
}

/* ----------------------------
   Small helper components
----------------------------- */

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
