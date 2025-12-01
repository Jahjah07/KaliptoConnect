import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from "react-native";
import { COLORS } from "@/constants/colors";
import { fetchAllPhotos } from "@/services/photos.service";
import { ProjectPhotosGroup, Photo } from "@/types/photo";

export default function PhotosScreen() {
  const [all, setAll] = useState<ProjectPhotosGroup[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchAllPhotos();
      setAll(data);
    } catch (err) {
      console.log("Failed to load all photos:", err);
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

  // Flatten all photos if filter = "all"
  const filteredPhotos: Photo[] =
    projectFilter === "all"
      ? all.flatMap((p) => p.photos)
      : all.find((p) => p.projectId === projectFilter)?.photos ?? [];

  // Show loading spinner
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
        <Text style={{ fontSize: 26, fontWeight: "700", color: COLORS.primaryDark }}>
          Site Photos
        </Text>

        <Text style={{ color: COLORS.primary, marginTop: 4 }}>
          {filteredPhotos.length} photos
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

      {/* EMPTY STATE */}
      {filteredPhotos.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginTop: 80,
          }}
        >
          <Text style={{ fontSize: 18, color: "#6B7280" }}>No photos available</Text>
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
            {filteredPhotos.map((photo, index) => (
              <FadeInImage key={index} uri={photo.url} />
            ))}
          </View>
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
   FADE-IN IMAGE COMPONENT
--------------------------*/
function FadeInImage({ uri }: { uri: string }) {
  const opacity = new Animated.Value(0);

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
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
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <Image
        source={{ uri }}
        onLoad={onLoad}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </Animated.View>
  );
}
