import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import StatCard from "@/components/dashboard/StatCard";
import ProjectListCard from "@/components/dashboard/ProjectListCard";
import { fetchContractorProjects } from "@/services/projects.service";
import { useAuthStore } from "@/store/auth.store";
import { useFocusEffect, useRouter } from "expo-router";
import { auth } from "@/lib/firebase";
export default function Home() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U";

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Auto-refresh when the screen is focused
  useFocusEffect(
    useCallback(() => {
      async function load() {
        setLoading(true);
        try {
          const data = await fetchContractorProjects();
          setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
          console.log("❌ Dashboard load error:", err);
        } finally {
          setLoading(false);
        }
      }

      load();
    }, [])
  );


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // 📌 TOTALS
  const totalProjects = projects.length;

  const totalPhotos = projects.reduce(
    (sum, p) => sum + (p.photos?.length || 0),
    0
  );

  const totalReceipts = projects.reduce(
    (sum, p) => sum + (p.receipts?.length || 0),
    0
  );

  // 📌 FILTERS
  const currentProjects = projects.filter(
    (p) => p.status === "Pending" || p.status === "Active"
  );

  const recentProjects = projects
    .filter((p) => p.status === "Completed" || p.status === "Cancelled")
    .slice(0, 6);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* HEADER */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 60,
          paddingBottom: 30,
        }}
      >
        <Text style={{ color: COLORS.primary, opacity: 0.7 }}>Welcome back,</Text>

        <Text
          style={{
            color: COLORS.primaryDark,
            fontSize: 26,
            fontWeight: "700",
            marginTop: 4,
          }}
        >
          {user?.displayName ?? "User"}
        </Text>

        <Text style={{ color: COLORS.primary, marginTop: 2 }}>
          Kalipto Constructions
        </Text>

        {/* Profile Icon */}
        <View
          style={{
            position: "absolute",
            right: 20,
            top: 60,
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: COLORS.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>{initials}</Text>
        </View>
      </View>

      {/* WHITE CONTAINER */}
      <View
        style={{
          backgroundColor: "#F7F9FC",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingHorizontal: 20,
          paddingTop: 24,
          marginTop: -20,
        }}
      >
        {/* STATS CARDS */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <StatCard icon="folder" label="Projects" value={String(totalProjects)} onPress={() => router.push("/projects")}/>
          <StatCard icon="camera" label="Site Photos" value={String(totalPhotos)} onPress={() => router.push("/photos")}/>
          <StatCard icon="image" label="Receipts" value={String(totalReceipts)} onPress={() => router.push("/receipts")}/>
        </View>

        {/* CURRENT PROJECTS */}
        <Text
          style={{
            fontWeight: "700",
            fontSize: 18,
            color: "#1F2937",
            marginBottom: 12,
          }}
        >
          Current Projects
        </Text>

        {currentProjects.length === 0 ? (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 16,
              shadowOpacity: 0.05,
              shadowRadius: 4,
              shadowOffset: { height: 2, width: 0 },
            }}
          >
            <Text style={{ color: "#6B7280" }}>You have no active projects.</Text>
          </View>
        ) : (
          currentProjects.map((p) => (
            <ProjectListCard
              key={p._id}
              id={p._id}
              name={p.name}
              status={p.status}
            />
          ))
        )}

        {/* RECENT PROJECTS */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 30,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "700", fontSize: 18, color: "#1F2937" }}>
            Recent Projects
          </Text>

          <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
            View All →
          </Text>
        </View>

        {recentProjects.length === 0 ? (
          <Text style={{ color: "#6B7280" }}>No completed projects.</Text>
        ) : (
          recentProjects.map((p) => (
            <ProjectListCard
              key={p._id}
              id={p._id}
              name={p.name}
              status={p.status}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
