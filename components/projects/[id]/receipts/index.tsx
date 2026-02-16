"use client";

import { ReceiptCard } from "@/components/receipts/ReceiptCard";
import { COLORS } from "@/constants/colors";
import { useReceiptUpload } from "@/hooks/useReceiptUpload";
import { fetchProjectReceipts } from "@/services/receipts.service";
import { Receipt } from "@/types/receipt";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProjectReceiptsScreen() {
  const { id } = useLocalSearchParams();
  const projectId = String(id || "");

  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Camera upload hook
  const { takeReceiptPhoto, uploading } =
    useReceiptUpload(projectId);

  /* ---------------------------------------
     LOAD RECEIPTS
  ----------------------------------------*/
  async function load() {
    if (!projectId) return;

    try {
      setPageLoading(true);
      const data = await fetchProjectReceipts(projectId);
      setReceipts(data);
    } catch (err) {
      console.log("Failed to fetch receipts:", err);
    } finally {
      setPageLoading(false);
    }
  }

  /* ---------------------------------------
     PULL TO REFRESH
  ----------------------------------------*/
  const onRefresh = useCallback(async () => {
    if (!projectId) return;
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [projectId]);

  /* ---------------------------------------
     SCROLL TO TOP + RELOAD
  ----------------------------------------*/
  const scrollToTopAndReload = async () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    await onRefresh();
  };

  /* ---------------------------------------
     INITIAL LOAD
  ----------------------------------------*/
  useEffect(() => {
    if (projectId) load();
  }, [projectId]);

  /* ---------------------------------------
     AUTO REFRESH AFTER UPLOAD
  ----------------------------------------*/
  useEffect(() => {
    if (!uploading) {
      onRefresh();
    }
  }, [uploading]);

  if (pageLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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

          <Pressable onPress={scrollToTopAndReload}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "700",
                color: COLORS.primaryDark,
              }}
            >
              Project Receipts
            </Text>
          </Pressable>
        </View>

        <Text style={{ color: COLORS.primary, marginTop: 4 }}>
          {receipts.length} receipts
        </Text>
      </View>

      {/* EMPTY STATE */}
      {receipts.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginTop: 80,
            opacity: 0.7,
          }}
        >
          <Ionicons
            name="receipt-outline"
            size={60}
            color="#9CA3AF"
          />
          <Text
            style={{
              marginTop: 10,
              color: "#6B7280",
              fontSize: 16,
            }}
          >
            No receipts yet
          </Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 120,
          }}
        >
          {receipts.map((receipt) => (
            <ReceiptCard
              key={receipt._id}
              receipt={receipt}
              projectId={projectId}
            />
          ))}
        </ScrollView>
      )}

      {/* CAMERA BUTTON */}
      <TouchableOpacity
        onPress={takeReceiptPhoto}
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
          elevation: 8,
          zIndex: 999,
        }}
      >
        <Ionicons name="camera" size={30} color="#fff" />
      </TouchableOpacity>

      {/* UPLOADING OVERLAY */}
      {uploading && (
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>
            Uploading receipt...
          </Text>
        </View>
      )}
    </View>
  );
}
