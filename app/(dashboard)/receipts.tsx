import { COLORS } from "@/constants/colors";
import { fetchAllReceipts } from "@/services/receipts.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Types
interface Receipt {
  id: string;
  amount: number;
  date: string;
  store: string;
  imageUrl?: string;
}

interface ProjectReceiptsGroup {
  projectId: string;
  projectName: string;
  receipts: Receipt[];
}

export default function ReceiptsScreen() {
  const [all, setAll] = useState<ProjectReceiptsGroup[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchAllReceipts();
      setAll(data);
    } catch (err) {
      console.log("Failed to load receipts:", err);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
  }, []);

  // Flatten receipts if showing ALL
  const filteredReceipts: Receipt[] =
    projectFilter === "all"
      ? all.flatMap((p) => p.receipts)
      : all.find((p) => p.projectId === projectFilter)?.receipts ?? [];

  // Loading spinner
  if (loading) {
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
        <Text
          style={{ fontSize: 26, fontWeight: "700", color: COLORS.primaryDark }}
        >
          Receipts
        </Text>

        <Text style={{ color: COLORS.primary, marginTop: 4 }}>
          {filteredReceipts.length} receipts
        </Text>
      </View>

      {/* FILTER CHIPS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingLeft: 20, marginVertical: 10 }}
      >
        {/* ALL PROJECTS */}
        <FilterChip
          label="All Projects"
          active={projectFilter === "all"}
          onPress={() => setProjectFilter("all")}
        />

        {/* INDIVIDUAL PROJECT TAGS */}
        {all.map((p) => (
          <FilterChip
            key={p.projectId}
            label={p.projectName}
            active={projectFilter === p.projectId}
            onPress={() => setProjectFilter(p.projectId)}
          />
        ))}
      </ScrollView>

      {/* CONTENT */}
      {filteredReceipts.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginTop: 80,
            opacity: 0.7,
          }}
        >
          <Ionicons name="document-text-outline" size={60} color="#9CA3AF" />
          <Text style={{ marginTop: 10, color: "#6B7280", fontSize: 16 }}>
            No receipts available
          </Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        >
          {filteredReceipts.map((receipt) => (
            <ReceiptCard key={receipt.id} receipt={receipt} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

/* -------------------------
   FILTER CHIP COMPONENT
--------------------------*/
function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 14,
        backgroundColor: active ? COLORS.primary : "#E5E7EB",
        borderRadius: 18,
        marginRight: 10,
      }}
    >
      <Text
        style={{
          color: active ? "#fff" : "#374151",
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* -------------------------
   RECEIPT CARD
--------------------------*/
function ReceiptCard({ receipt }: { receipt: Receipt }) {
  const { store, amount, date, imageUrl } = receipt;

  const opacity = new Animated.Value(0);

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

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
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {/* IMAGE / PLACEHOLDER */}
        {imageUrl ? (
          <Animated.View
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              overflow: "hidden",
              marginRight: 12,
              opacity,
              backgroundColor: "#f1f1f1",
            }}
          >
            <Image
              source={{ uri: imageUrl }}
              onLoad={onLoad}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </Animated.View>
        ) : (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              backgroundColor: "#E0E7FF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name="receipt-outline" size={26} color="#4A63FF" />
          </View>
        )}

        {/* DETAILS */}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ fontWeight: "700", fontSize: 16, color: "#111" }}>
            {store}
          </Text>
          <Text style={{ color: "#6B7280", marginTop: 2 }}>
            ${amount} • {date}
          </Text>
        </View>
      </View>
    </View>
  );
}
