import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { getProjectById } from "@/services/api";
import { COLORS } from "@/constants/colors";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  const projectId = String(id);

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { takePhoto } = usePhotoUpload(projectId);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getProjectById(projectId);
        setProject(data.project);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading || !project) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>{project.name}</Text>
      <Text style={{ color: "#6B7280", marginBottom: 20 }}>
        {project.address}
      </Text>

      {/* TAKE PHOTO */}
      <TouchableOpacity
        onPress={takePhoto}
        style={{
          backgroundColor: COLORS.primary,
          paddingVertical: 12,
          paddingHorizontal: 18,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
          Take Photo
        </Text>
      </TouchableOpacity>

      {/* NAVIGATION BUTTONS */}
      <Link href={`/(dashboard)/project/${projectId}/photos`} asChild>
        <TouchableOpacity
          style={{
            padding: 14,
            backgroundColor: "#F3F4F6",
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontWeight: "600", color: COLORS.primary }}>
            View Photos →
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href={`/(dashboard)/project/${projectId}/receipts`} asChild>
        <TouchableOpacity
          style={{
            padding: 14,
            backgroundColor: "#F3F4F6",
            borderRadius: 10,
          }}
        >
          <Text style={{ fontWeight: "600", color: COLORS.primary }}>
            View Receipts →
          </Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}
