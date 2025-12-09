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
  TextInput,
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
  const [search, setSearch] = useState("");
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
  const filteredReceipts = (
    projectFilter === "all"
      ? all.flatMap((p) => p.receipts)
      : all.find((p) => p.projectId === projectFilter)?.receipts ?? []
  ).filter((r) => {
    const filename = r.imageUrl?.split("/").pop()?.toLowerCase() ?? "";
    const searchTxt = search.toLowerCase();

    return (
      r.store.toLowerCase().includes(searchTxt) ||
      r.amount.toString().includes(searchTxt) ||
      r.date.toLowerCase().includes(searchTxt) ||
      filename.includes(searchTxt)
    );
  });

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

      {/* SEARCH BAR */}
      <View
        style={{
          backgroundColor: "#F1F5F9",
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 20,
          marginTop: 10,
        }}
      >
        <Ionicons name="search-outline" size={20} color="#6B7280" />
        <TextInput
          placeholder="Search receipts..."
          value={search}
          onChangeText={setSearch}
          style={{ flex: 1, marginLeft: 10 }}
        />
      </View>

      {/* FILTER CHIPS */}
      <View style={{ paddingVertical: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20 }}
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
      </View>

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
        alignSelf: "flex-start",
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
        padding: 18,
        borderRadius: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {imageUrl ? (
        <Animated.View
          style={{
            width: 70,
            height: 70,
            borderRadius: 14,
            overflow: "hidden",
            marginRight: 14,
            opacity,
            backgroundColor: "#f1f1f1",
          }}
        >
          <Image
            source={{ uri: imageUrl }}
            onLoad={onLoad}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </Animated.View>
      ) : (
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 14,
            backgroundColor: COLORS.primary + "18",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 14,
          }}
        >
          <Ionicons name="receipt-outline" size={30} color={COLORS.primary} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#111" }}>
          {store}
        </Text>
        <Text style={{ color: "#6B7280", marginTop: 4 }}>
          ${amount} — {date}
        </Text>
      </View>
    </View>
  );
}
