import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

export default function ReceiptsScreen() {
  const [receipts] = useState([]); // placeholder for now

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
    >
      {/* HEADER */}
      <View
        style={{
          marginTop: 10,
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: COLORS.primaryDark,
            }}
          >
            Receipts
          </Text>
          <Text style={{ color: COLORS.primary, marginTop: 4 }}>
            {receipts.length} total receipts
          </Text>
        </View>

        {/* Icon */}
        <View
          style={{
            backgroundColor: COLORS.primary,
            width: 56,
            height: 56,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="receipt-outline" size={30} color="#fff" />
        </View>
      </View>

      {/* EMPTY */}
      {receipts.length === 0 && (
        <View
          style={{
            marginTop: 40,
            alignItems: "center",
            opacity: 0.7,
          }}
        >
          <Ionicons name="document-text-outline" size={50} color="#9CA3AF" />
          <Text style={{ marginTop: 10, color: "#6B7280" }}>
            No receipts uploaded yet.
          </Text>
        </View>
      )}

      {/* PLACEHOLDER RECEIPT LIST */}
      {/* Remove this once API is added */}
      {receipts.length === 0 && (
        <>
          <ReceiptCardPlaceholder />
          <ReceiptCardPlaceholder />
        </>
      )}
    </ScrollView>
  );
}

function ReceiptCardPlaceholder() {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#E0E7FF",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="receipt-outline" size={20} color="#4A63FF" />
        </View>

        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontWeight: "700", color: "#111" }}>
            Store Purchase
          </Text>
          <Text style={{ color: "#6B7280" }}>$0.00 • Feb 10, 2025</Text>
        </View>
      </View>
    </View>
  );
}
