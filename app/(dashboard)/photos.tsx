import ProjectCard, { EmptyState } from "@/components/photos/ProjectTabCard";
import { COLORS } from "@/constants/colors";
import { fetchProjectPhotos } from "@/services/photos.service";
import { fetchContractorProjects } from "@/services/projects.service";
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
  View
} from "react-native";

export default function PhotosScreen() {
  const [groups, setGroups] = useState<ProjectPhotosGroup[]>([]);
  const [projectFilter, setProjectFilter] = useState<"all" | string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* -----------------------------
     Load projects + photos
  ------------------------------*/
  async function load() {
    try {
      setLoading(true);

      const projects = await fetchContractorProjects();
      const result: ProjectPhotosGroup[] = [];

      for (const project of projects) {
        const photos: Photo[] = await fetchProjectPhotos(project._id);

        result.push({
          projectId: project._id,
          projectName: project.name,
          photos,
        });
      }

      setGroups(result);
    } catch (err) {
      console.log("Failed to load photos:", err);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  /* -----------------------------
     Derived data
  ------------------------------*/
  const allPhotos = groups.flatMap((g) => g.photos);

  const activePhotos =
    projectFilter === "all"
      ? allPhotos
      : groups.find((g) => g.projectId === projectFilter)?.photos ?? [];

  const filteredPhotos = activePhotos.filter((photo) => {
    const filename = photo.url.split("/").pop()?.toLowerCase() ?? "";
    return filename.includes(search.toLowerCase());
  });

  /* -----------------------------
     Loading state
  ------------------------------*/
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
  <ScrollView
    style={{ flex: 1, height: "100%", backgroundColor: COLORS.background }}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >  
    <View style={{ flex: 1, backgroundColor: COLORS.background, height: "100%" }}>
      {/* HEADER */}
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 10 }}>
        <Text style={{ fontSize: 26, fontWeight: "700", color: COLORS.primaryDark }}>
          Site Photos
        </Text>

        <Text style={{ color: COLORS.primary, marginTop: 2 }}>
          {filteredPhotos.length} photos
        </Text>

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

      {/* SEARCH */}
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

      {/* PROJECT CARDS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 12 }}
      >
        <ProjectCard
          label="All Projects"
          active={projectFilter === "all"}
          subtitle={`${allPhotos.length} photos`}
          onPress={() => setProjectFilter("all")}
        />

        {groups.map((p) => (
          <ProjectCard
            key={p.projectId}
            label={p.projectName}
            subtitle={
              p.photos.length === 0
                ? "No photos yet"
                : `${p.photos.length} photos`
            }
            active={projectFilter === p.projectId}
            onPress={() => setProjectFilter(p.projectId)}
          />
        ))}
      </ScrollView>

      {/* CONTENT */}
      {filteredPhotos.length === 0 ? (
        <EmptyState
          title={
            projectFilter === "all"
              ? "No photos yet"
              : "No photos for this project"
          }
          subtitle="Photos uploaded on site will appear here"
        />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
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
  </ScrollView>
  );
}

/* -----------------------------
   FADE-IN IMAGE
------------------------------*/
function FadeInImage({ uri }: { uri: string }) {
  const opacity = new Animated.Value(0);

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
        onLoad={() =>
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start()
        }
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </Animated.View>
  );
}
