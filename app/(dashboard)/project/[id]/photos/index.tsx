"use client";

import { COLORS } from "@/constants/colors";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { fetchProjectPhotos } from "@/services/photos.service";
import { Photo } from "@/types/photo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
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

export default function ProjectPhotosScreen() {
  const { id: projectId } = useLocalSearchParams();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 👇 Use your hook
  const { takePhoto, uploading, success } = usePhotoUpload(String(projectId));

  // LOAD PHOTOS
  async function load() {
    try {
      setLoading(true);
      const data = await fetchProjectPhotos(String(projectId));
      setPhotos(data);
    } catch (err) {
      console.log("Failed to fetch project photos:", err);
    } finally {
      setLoading(false);
    }
  }

  // REFESH
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
  }, [projectId]);

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
          Project Photos
        </Text>

        <Text style={{ color: COLORS.primary, marginTop: 4 }}>
          {photos.length} photos
        </Text>
      </View>

      {/* EMPTY */}
      {photos.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", marginTop: 80 }}>
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
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {photos.map((photo, idx) => (
              <FadeInImage key={idx} uri={photo.url} />
            ))}
          </View>
        </ScrollView>
      )}

      {/* ---------------------------
          FLOATING ADD PHOTO BUTTON
      ---------------------------- */}
      <TouchableOpacity
        onPress={async () => {
          const ok = await takePhoto(); // 📸 uses your hook
          if (ok) load(); // 🔄 reload photos after success
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

      {/* ---------------------------
          UPLOADING OVERLAY
      ---------------------------- */}
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
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>
            Uploading photo...
          </Text>
        </View>
      )}

      {/* ---------------------------
          SUCCESS CHECKMARK
      ---------------------------- */}
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
            zIndex: 999,
          }}
        >
          <Ionicons name="checkmark-circle" size={90} color="#4ade80" />
        </View>
      )}
    </View>
  );
}

/* ----------------------------------------
   FADE-IN IMAGE COMPONENT
----------------------------------------- */
function FadeInImage({ uri }: { uri: string }) {
  const opacity = new Animated.Value(0);

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        width: "48%",
        height: 160,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 16,
        backgroundColor: "#f1f1f1",
        opacity,
      }}
    >
      <Image
        source={{ uri }}
        onLoad={onLoad}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      />
    </Animated.View>
  );
}
