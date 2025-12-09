import { COLORS } from "@/constants/colors";
import { fetchAllPhotos } from "@/services/photos.service";
import { Photo, ProjectPhotosGroup } from "@/types/photo";
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

export default function PhotosScreen() {
  const [all, setAll] = useState<ProjectPhotosGroup[]>([]);
  const [projectFilter, setProjectFilter] = useState("all");
  const [search, setSearch] = useState(""); // 🔍 search input
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

  // 1️⃣ Filter by project
  const filteredByProject: Photo[] =
    projectFilter === "all"
      ? all.flatMap((p) => p.photos)
      : all.find((p) => p.projectId === projectFilter)?.photos ?? [];

  // 2️⃣ Filter by search
  const filteredPhotos = filteredByProject.filter((photo) => {
    const filename = photo.url.split("/").pop()?.toLowerCase() ?? "";
    return filename.includes(search.toLowerCase());
  });


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
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 10 }}>
        <Text style={{ fontSize: 26, fontWeight: "700", color: COLORS.primaryDark }}>
          Site Photos
        </Text>

        <Text style={{ color: COLORS.primary, marginTop: 2 }}>
          {filteredPhotos.length} photos
        </Text>

        {/* Icon */}
        <View
          style={{
            position: "absolute",
            right: 24,
            top: 60,
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: COLORS.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="camera" size={24} color="#fff" />
        </View>
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
          marginHorizontal: 24,
          marginTop: 10,
        }}
      >
        <Ionicons name="search-outline" size={20} color="#6B7280" />
        <TextInput
          placeholder="Search photos..."
          value={search}
          onChangeText={setSearch}
          style={{ marginLeft: 10, flex: 1 }}
        />
      </View>

      {/* FILTER CHIPS */}
      <View style={{ paddingVertical: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20 }}
        >
          <FilterChip
            label="All Projects"
            active={projectFilter === "all"}
            onPress={() => setProjectFilter("all")}
          />

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

      {/* EMPTY STATE */}
      {filteredPhotos.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginTop: 80,
          }}
        >
          <Ionicons name="image-outline" size={50} color="#9CA3AF" />
          <Text style={{ fontSize: 18, color: "#6B7280", marginTop: 10 }}>
            No photos found
          </Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
        >
          {/* Photo Grid */}
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
