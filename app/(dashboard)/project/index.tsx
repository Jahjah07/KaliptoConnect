import ProjectListCard from "@/components/dashboard/ProjectListCard";
import { COLORS } from "@/constants/colors";
import { fetchContractorProjects } from "@/services/projects.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  async function loadProjects() {
    try {
      const data = await fetchContractorProjects();

      const sorted = [...(data || [])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setProjects(sorted);
    } catch (err) {
      console.log("Error loading projects:", err);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadProjects().finally(() => setLoading(false));
  }, []);

  // FILTER BY STATUS
  const filteredByStatus =
    filter === "All"
      ? projects
      : projects.filter((p) => p.status === filter);

  // FILTER BY SEARCH
  const filteredProjects = filteredByStatus.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 60, paddingTop: 60 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* HEADER */}
      <View
        style={{
          marginTop: 10,
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: COLORS.primaryDark,
            }}
          >
            My Projects
          </Text>

          <Text style={{ color: COLORS.primary, marginTop: 4 }}>
            {projects.length} total projects
          </Text>
        </View>

        <View
          style={{
            backgroundColor: COLORS.primary,
            width: 56,
            height: 56,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="folder-open" size={30} color="#fff" />
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
          marginBottom: 20,
        }}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color="#6B7280"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search projects..."
          value={search}
          onChangeText={setSearch}
          style={{ flex: 1, fontSize: 15 }}
        />
      </View>

      {/* FILTER BUTTONS */}
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {["All", "Active", "Pending", "Completed"].map((item) => {
          const active = filter === item;

          return (
            <TouchableOpacity
              key={item}
              onPress={() => setFilter(item)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
                backgroundColor: active ? COLORS.primary : "#F1F5F9",
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  color: active ? "#fff" : "#6B7280",
                  fontWeight: active ? "700" : "500",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : filteredProjects.length === 0 ? (
        <View
          style={{
            backgroundColor: "#F7FAFC",
            padding: 22,
            borderRadius: 16,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Ionicons
            name="folder-open-outline"
            size={40}
            color="#9CA3AF"
            style={{ marginBottom: 10 }}
          />
          <Text style={{ color: "#6B7280", fontSize: 16 }}>
            No matching projects.
          </Text>
        </View>
      ) : (
        filteredProjects.map((p) => (
          <ProjectListCard
            key={p._id}
            id={p._id}
            name={p.name}
            status={p.status}
          />
        ))
      )}
    </ScrollView>
  );
}
