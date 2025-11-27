import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";

export default function PhotosScreen() {
  const { takePhoto } = usePhotoUpload();

  // 🔹 Mock photos (you can replace with real API later)
  const [photos] = useState([
    { id: 1, uri: "https://picsum.photos/300?random=1" },
    { id: 2, uri: "https://picsum.photos/300?random=2" },
    { id: 3, uri: "https://picsum.photos/300?random=3" },
    { id: 4, uri: "https://picsum.photos/300?random=4" },
    { id: 5, uri: "https://picsum.photos/300?random=5" },
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* HEADER */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 60,
          paddingBottom: 20,
          backgroundColor: COLORS.background,
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: "700", color: COLORS.primaryDark }}>
          Site Photos
        </Text>
        <Text style={{ color: COLORS.primary, marginTop: 4 }}>
          {photos.length} photos uploaded
        </Text>
      </View>

      {/* PHOTO GRID */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {photos.map((p) => (
            <View
              key={p.id}
              style={{
                width: "48%",
                height: 160,
                borderRadius: 14,
                overflow: "hidden",
                marginBottom: 16,
                backgroundColor: "#eee",
              }}
            >
              <Image
                source={{ uri: p.uri }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FLOATING BUTTON */}
      <TouchableOpacity
        onPress={takePhoto}
        style={{
          position: "absolute",
          bottom: 30,
          right: 20,
          backgroundColor: COLORS.primary,
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          elevation: 6,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Ionicons name="camera" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
