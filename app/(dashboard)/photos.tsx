import ProjectCard, { EmptyState } from "@/components/photos/ProjectTabCard";
import { COLORS } from "@/constants/colors";
import { fetchProjectPhotos } from "@/services/photos.service";
import { fetchContractorProjects } from "@/services/projects.service";
import { Photo, ProjectPhotosGroup } from "@/types/photo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function PhotosScreen() {
  const [groups, setGroups] = useState<ProjectPhotosGroup[]>([]);
  const [projectFilter, setProjectFilter] = useState<"all" | string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const sortedGroups = [...groups].sort((a, b) => {
    const diff =
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime();

    return sortOrder === "newest" ? diff : -diff;
  });
  /* -----------------------------
     Load projects + photos
  ------------------------------*/
  async function load() {
    try {
      setLoading(true);

      const projects = await fetchContractorProjects();

      const result: ProjectPhotosGroup[] = await Promise.all(
        projects.map(async (project) => {
          const photos: Photo[] = await fetchProjectPhotos(project._id);

          return {
            projectId: project._id,
            projectName: project.name,
            photos,
            createdAt: project.createdAt,
          };
        })
      );

      setGroups(result);
    } catch (err) {
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
    <FlatList
      data={filteredPhotos}
      keyExtractor={(item) => item._id}
      numColumns={2}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      columnWrapperStyle={{
        justifyContent: "space-between",
        paddingHorizontal: 24,
      }}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
      ListHeaderComponent={
        <>
          {/* HEADER */}
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 60,
              paddingBottom: 10,
              backgroundColor: COLORS.background,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "700",
                  color: COLORS.primaryDark,
                }}
              >
                Site Photos
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setSortOrder((prev) =>
                    prev === "newest" ? "oldest" : "newest"
                  )
                }
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: "#F3F4F6",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name={sortOrder === "newest" ? "arrow-down" : "arrow-up"}
                  size={16}
                  color="#374151"
                />
                <Text
                  style={{
                    marginLeft: 6,
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  {sortOrder === "newest" ? "Newest" : "Oldest"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: COLORS.primary, marginTop: 4 }}>
              {filteredPhotos.length} photos
            </Text>
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

          {/* PROJECT CARDS (horizontal ScrollView is OK) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 12,
            }}
          >
            <ProjectCard
              label="All Projects"
              active={projectFilter === "all"}
              subtitle={`${allPhotos.length} photos`}
              onPress={() => setProjectFilter("all")}
            />

            {sortedGroups.map((p) => (
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
        </>
      }
      ListEmptyComponent={
        <EmptyState
          title={
            projectFilter === "all"
              ? "No photos yet"
              : "No photos for this project"
          }
          subtitle="Photos uploaded on site will appear here"
        />
      }
      renderItem={({ item }) => (
        <MemoizedFadeInImage uri={item.url} />
      )}
      initialNumToRender={8}
      maxToRenderPerBatch={6}
      windowSize={5}
      removeClippedSubviews
    />
  );
}

/* -----------------------------
   FADE-IN IMAGE
------------------------------*/
const MemoizedFadeInImage = React.memo(({ uri }: { uri: string }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  return (
    <Animated.View
      style={{
        flex: 1,
        height: 160,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 16,
        backgroundColor: "#f1f1f1",
        marginHorizontal: 4,
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
        contentFit="cover"
      />
    </Animated.View>
  );
});