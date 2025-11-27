import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { COLORS } from "@/constants/colors";
import { fetchContractorProjects } from "@/services/projects.service";
import ProjectListCard from "@/components/dashboard/ProjectListCard";
import { Ionicons } from "@expo/vector-icons";

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchContractorProjects();
        setProjects(data || []);
      } catch (err) {
        console.log("Error loading projects:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
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

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : projects.length === 0 ? (
        <Text style={{ color: "#6B7280", marginTop: 20 }}>
          You have no projects yet.
        </Text>
      ) : (
        projects.map((p) => (
          <ProjectListCard
            key={p._id}
            id={p._id}
            name={p.name}
            address={p.address}
          />
        ))
      )}
    </ScrollView>
  );
}
