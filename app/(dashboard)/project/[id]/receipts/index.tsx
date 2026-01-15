"use client";

import { COLORS } from "@/constants/colors";
import { useReceiptUpload } from "@/hooks/useReceiptUpload";
import { fetchProjectReceipts } from "@/services/receipts.service";
import { Receipt } from "@/types/receipt";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function ProjectReceiptsScreen() {
  const { id: projectId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [pageLoading, setPageLoading] = useState(true);   // <-- renamed
  const [refreshing, setRefreshing] = useState(false);

  // 🧠 OCR Receipt Upload Hook
  const { takeReceiptPhoto, loading: uploadingOCR } = useReceiptUpload(String(projectId));

  // Load receipts
  async function load() {
    try {
      setPageLoading(true);
      const data = await fetchProjectReceipts(String(projectId));
      setReceipts(data);
    } catch (err) {
      console.log("Failed to fetch receipts:", err);
    } finally {
      setPageLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
  }, [projectId]);

  // MAIN LOADING SCREEN
  if (pageLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* HEADER */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 60,
          paddingBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            style={{ marginRight: 12 }}
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color={COLORS.primaryDark}
            />
          </Pressable>
          <Text style={{ fontSize: 26, fontWeight: "700", color: COLORS.primaryDark }}>
            Project Receipts
          </Text>
        </View>
        <Text style={{ color: COLORS.primary, marginTop: 4 }}>
          {receipts.length} receipts
        </Text>
      </View>

      {/* EMPTY */}
      {receipts.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", marginTop: 80, opacity: 0.7 }}>
          <Ionicons name="receipt-outline" size={60} color="#9CA3AF" />
          <Text style={{ marginTop: 10, color: "#6B7280", fontSize: 16 }}>
            No receipts yet
          </Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        >
          {receipts.map((receipt, idx) => (
            <ReceiptCard key={idx} receipt={receipt} />
          ))}
        </ScrollView>
      )}

      {/* FLOATING SCAN BUTTON */}
      <TouchableOpacity
        onPress={async () => {
          await takeReceiptPhoto();  
          // REVIEW SCREEN will handle upload
        }}
        style={{
          position: "absolute",
          bottom: 30,
          right: 20,
          backgroundColor: COLORS.primary,
          width: 64,
          height: 64,
          borderRadius: 32,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 8,
          zIndex: 999,
        }}
      >
        <Ionicons name="camera" size={30} color="#fff" />
      </TouchableOpacity>

      {/* OCR LOADING OVERLAY */}
      {uploadingOCR && (
        <View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>Processing receipt...</Text>
        </View>
      )}
    </View>
  );
}

/* ----------------------------------------
   RECEIPT CARD COMPONENT
----------------------------------------- */
function ReceiptCard({ receipt }: { receipt: Receipt }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        flexDirection: "row",
      }}
    >
      <Image
        source={{ uri: receipt.imageUrl }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          marginRight: 12,
          backgroundColor: "#eee",
        }}
      />

      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "700", fontSize: 16 }}>{receipt.store}</Text>
        <Text style={{ color: "#6B7280", marginTop: 2 }}>
          ${receipt.amount} • {receipt.date}
        </Text>
      </View>
    </View>
  );
}
