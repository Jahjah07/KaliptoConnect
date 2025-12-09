"use client";

import { COLORS } from "@/constants/colors";
import { uploadReceipt } from "@/services/receipts.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ReceiptReviewScreen() {
  const router = useRouter();
  const { id: projectId, base64, amount, store, date } = useLocalSearchParams();

  const [storeName, setStoreName] = useState(store as string);
  const [receiptAmount, setReceiptAmount] = useState(amount as string);
  const [receiptDate, setReceiptDate] = useState(date as string);

  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    try {
      setLoading(true);

      await uploadReceipt(
        String(projectId),
        base64 as string,
        Number(receiptAmount),
        storeName,
        receiptDate
      );

      router.replace(`/(dashboard)/project/${projectId}/receipts`);

    } catch (err) {
      console.log("Upload failed:", err);
      alert("Failed to upload receipt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginTop: 50 }}>
        Review Receipt
      </Text>

      {/* IMAGE */}
      <Image
        source={{ uri: base64 as string }}
        style={{
          width: "100%",
          height: 250,
          borderRadius: 12,
          marginTop: 20,
          backgroundColor: "#eee",
        }}
        resizeMode="contain"
      />

      {/* FORM */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Store</Text>
        <TextInput
          value={storeName}
          onChangeText={setStoreName}
          style={{
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 10,
            marginBottom: 16,
          }}
        />

        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Amount</Text>
        <TextInput
          value={receiptAmount}
          keyboardType="numeric"
          onChangeText={setReceiptAmount}
          style={{
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 10,
            marginBottom: 16,
          }}
        />

        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Date</Text>
        <TextInput
          value={receiptDate}
          onChangeText={setReceiptDate}
          style={{
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 10,
            marginBottom: 16,
          }}
        />
      </View>

      {/* BUTTONS */}
      <TouchableOpacity
        onPress={handleUpload}
        disabled={loading}
        style={{
          backgroundColor: COLORS.primary,
          padding: 16,
          borderRadius: 12,
          marginTop: 10,
          alignItems: "center",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>Upload Receipt</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          padding: 16,
          borderRadius: 12,
          backgroundColor: "#E5E7EB",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ fontWeight: "600", color: "#111" }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
