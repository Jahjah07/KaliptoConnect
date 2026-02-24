"use client";

import { COLORS } from "@/constants/colors";
import { updateAssignmentStatus } from "@/services/assignment.service";
import { geocodeLocation } from "@/services/geocode.service";
import { fetchProjectById, fetchProjectStats } from "@/services/projects.service";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  const projectId = String(id);
  const navigation = useNavigation();
  const [project, setProject] = useState<any>(null);
  const [coords, setCoords] = useState<any>(null);
  const [stats, setStats] = useState<{ photos: number; receipts: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const loadProject = useCallback(async () => {
    try {
      setLoading(true);

      const [projectData, statsData] = await Promise.all([
        fetchProjectById(projectId),
        fetchProjectStats(projectId),
      ]);

      setProject(projectData);
      setStats(statsData);

      if (projectData.projectLocation?.address) {
        const geo = await geocodeLocation(projectData.projectLocation.address);
        setCoords(geo);
      }
    } catch (err) {
      // error handled silently
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // 🔄 Auto-refresh project data
  useFocusEffect(
    useCallback(() => {
      loadProject();
    }, [loadProject])
  );

  const handleStart = async () => {
    try {
      await updateAssignmentStatus(project.assignment_id, "Ongoing");
      await loadProject(); // 🔥 real-time refresh
    } catch (err) {
      // error handled silently
    }
  };

  const handleComplete = async () => {
    try {
      await updateAssignmentStatus(project.assignment_id, "Completed");
      await loadProject(); // 🔥 real-time refresh
    } catch (error: unknown) {
      let message = "Unable to complete the job.";

    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.error ||
        error.message ||
        message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    setErrorMessage(message);
    }
  };

  if (loading || !project) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const photosCount = stats?.photos ?? 0;
  const receiptsCount = stats?.receipts ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120, marginTop: 50 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            style={{ marginRight: 12 }}
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color={COLORS.primaryDark}
            />
          </Pressable>
          {/* PROJECT TITLE */}
          <Text style={{ fontSize: 26, fontWeight: "700", color: COLORS.primaryDark }}>
            {project.name}
          </Text>
        </View>
        
          <Text style={{ color: "#6B7280", marginTop: 4, marginBottom: 20 }}>
            {project.contractorStatus}
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

      {project.contractorStatus === "Pending" && (
          <TouchableOpacity
            onPress={handleStart}
            style={{
              backgroundColor: COLORS.primary,
              padding: 16,
              borderRadius: 14,
              margin: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Start Job
            </Text>
          </TouchableOpacity>
        )}
        {project.contractorStatus === "Ongoing" && (
          <TouchableOpacity
            onPress={handleComplete}
            style={{
              backgroundColor: "#005356",
              padding: 16,
              borderRadius: 14,
              margin: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Mark as Completed
            </Text>
          </TouchableOpacity>
        )}

        {errorMessage && (
          <View
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              alignItems: "center",
              padding: 24,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 24,
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  marginBottom: 10,
                }}
              >
                Cannot Complete Job
              </Text>

              <Text style={{ color: "#6B7280", marginBottom: 20 }}>
                {errorMessage}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setErrorMessage(null);
                  router.push(`/(dashboard)/project/${projectId}/photos`);
                }}
                style={{
                  backgroundColor: COLORS.primary,
                  padding: 14,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  Go to Photos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setErrorMessage(null)}
                style={{
                  padding: 12,
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text style={{ color: "#c23434" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
    </View>
  );
}
