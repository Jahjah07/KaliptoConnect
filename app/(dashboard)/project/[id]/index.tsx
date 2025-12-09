"use client";

import { COLORS } from "@/constants/colors";
import { geocodeLocation } from "@/services/geocode.service";
import { fetchProjectById } from "@/services/projects.service";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  const projectId = String(id);

  const [project, setProject] = useState<any>(null);
  const [coords, setCoords] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  // 🔄 Auto-refresh project data
  useFocusEffect(
    useCallback(() => {
      async function load() {
        setLoading(true);

        try {
          const data = await fetchProjectById(projectId);
          setProject(data);

          // Auto-geocode location → coordinates
          if (data.location) {
            const geo = await geocodeLocation(data.location);
            setCoords(geo);
          }
        } catch (err) {
          console.log("Failed to load project:", err);
        } finally {
          setLoading(false);
        }
      }

      load();
    }, [projectId])
  );

  if (loading || !project) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const photosCount = project.photos?.length ?? 0;
  const receiptsCount = project.receipts?.length ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, marginTop: 30 }}>
        
        {/* PROJECT TITLE */}
        <Text style={{ fontSize: 26, fontWeight: "700", color: COLORS.primaryDark }}>
          {project.name}
        </Text>

        <Text style={{ color: "#6B7280", marginTop: 4, marginBottom: 20 }}>
          {project.status || "No status available"}
        </Text>

        {/* QUICK STATS */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 14,
              marginRight: 10,
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text style={{ fontSize: 14, color: "#6B7280" }}>Photos</Text>
            <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 4 }}>
              {photosCount}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 14,
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text style={{ fontSize: 14, color: "#6B7280" }}>Receipts</Text>
            <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 4 }}>
              {receiptsCount}
            </Text>
          </View>
        </View>

        {/* LINKS */}
        <Link href={`/(dashboard)/project/${projectId}/photos`} asChild>
          <TouchableOpacity
            style={{
              padding: 16,
              backgroundColor: "#F3F4F6",
              borderRadius: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontWeight: "600", color: COLORS.primary }}>View Photos</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </Link>

        <Link href={`/(dashboard)/project/${projectId}/receipts`} asChild>
          <TouchableOpacity
            style={{
              padding: 16,
              backgroundColor: "#F3F4F6",
              borderRadius: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "600", color: COLORS.primary }}>View Receipts</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </Link>

        {/* ---------------------- */}
        {/* MAP SECTION (Auto-Geo) */}
        {/* ---------------------- */}
        {coords && (
          <View
            style={{
              height: 250,
              borderRadius: 14,
              overflow: "hidden",
              marginTop: 20,
              backgroundColor: "#e5e7eb",
            }}
          >
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              }}
            >
              <Marker
                coordinate={coords}
                title={project.name}
                description={project.location}
              />
            </MapView>
          </View>
        )}

      </ScrollView>
    </View>
  );
}
