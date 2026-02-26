"use client";

import { COLORS } from "@/constants/colors";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { fetchProjectPhotos } from "@/services/photos.service";
import { fetchProjectById } from "@/services/projects.service";
import { Photo } from "@/types/photo";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function ProjectPhotosScreen() {
  const { id: projectId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [contractorStatus, setContractorStatus] = useState<string | null>(null);
  const { takePhoto, uploading, success } = usePhotoUpload(String(projectId));
  const [filter, setFilter] = useState<"all" | "before" | "after">("all");
  const filteredPhotos = filter === "all" ? photos : photos.filter((p) => p.type === filter);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);

      const [photoData, projectData] = await Promise.all([
        fetchProjectPhotos(String(projectId)),
        fetchProjectById(String(projectId)), // 🔥 add this
      ]);

      setPhotos(photoData);
      setContractorStatus(projectData.contractorStatus); // 🔥 or projectData.assignment.status
    } catch (err) {
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [projectId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  // MAIN LOADING
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
      <View style={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10 }}>
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
            Project Photos
          </Text>
        </View>
        <Text style={{ color: COLORS.primary, marginTop: 4 }}>
          {photos.length} photos
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        {[
          { label: "All", value: "all" },
          { label: "Before", value: "before" },
          { label: "After", value: "after" },
        ].map((tab) => {
          const active = filter === tab.value;

          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setFilter(tab.value as any)}
              style={{
                flex: 1,
                marginHorizontal: 4,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: active ? COLORS.primary : "#E5E7EB",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: active ? "#fff" : "#374151",
                  fontWeight: "600",
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CONTENT (ALWAYS SCROLLABLE) */}
      <FlatList
        data={filteredPhotos}
        keyExtractor={(item) => item._id}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
        contentContainerStyle={{
          paddingBottom: 140,
        }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 80 }}>
            <Ionicons
              name="image-outline"
              size={60}
              color="#9CA3AF"
              style={{ opacity: 0.6 }}
            />
            <Text style={{ marginTop: 10, color: "#6B7280", fontSize: 16 }}>
              No photos available
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <MemoizedPhoto
            uri={item.url}
            onPress={() => setPreviewUri(item.url)}
          />
        )}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews
      />

      {/* FLOATING ADD PHOTO BUTTON */}
      {contractorStatus !== "Completed" && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
          }}
        >
          <View style={{ flexDirection: "row", gap: 12 }}>

            {/* BEFORE */}
            <TouchableOpacity
              disabled={contractorStatus !== "Ongoing"}
              onPress={async () => {
                const ok = await takePhoto("before");
                if (ok) load();
              }}
              style={{
                flex: 1,
                backgroundColor: "#468d84",
                paddingVertical: 16,
                borderRadius: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Add Before
              </Text>
            </TouchableOpacity>

            {/* AFTER */}
            <TouchableOpacity
              disabled={contractorStatus !== "Ongoing"}
              onPress={async () => {
                const ok = await takePhoto("after");
                if (ok) load();
              }}
              style={{
                flex: 1,
                backgroundColor:
                  contractorStatus === "Ongoing"
                    ? "#005356"
                    : "#9CA3AF",
                paddingVertical: 16,
                borderRadius: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Add After
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      )}

      {/* UPLOADING OVERLAY */}
      {uploading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>
            Uploading photo...
          </Text>
        </View>
      )}

      {/* SUCCESS */}
      {success && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="checkmark-circle" size={90} color="#4ade80" />
        </View>
      )}

      {previewUri && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#000",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => setPreviewUri(null)}
            style={{ position: "absolute", top: 60, right: 20, zIndex: 2 }}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </Pressable>

          <Image
            source={{ uri: previewUri }}
            contentFit="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      )}
    </View>
  );
}

/* ----------------------------------------
   FADE-IN IMAGE COMPONENT
----------------------------------------- */
const MemoizedPhoto = React.memo(
  ({ uri, onPress }: { uri: string; onPress?: () => void }) => {
    return (
      <View
        style={{
          flex: 1,
          height: 160,
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 16,
          backgroundColor: "#f1f1f1",
          marginHorizontal: 4,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onPress}>
          <Image
            source={{ uri }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </Pressable>
      </View>
    );
  }
);