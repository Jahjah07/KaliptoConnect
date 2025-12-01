import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { fetchProjectById } from "@/services/projects.service";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  const projectId = String(id);

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { takePhoto } = usePhotoUpload(projectId);

  // 🔄 Auto-refresh project data
  useFocusEffect(
    useCallback(() => {
      async function load() {
        setLoading(true);
        try {
          const data = await fetchProjectById(projectId);
          setProject(data);
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
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* PROJECT TITLE */}
        <Text style={{ fontSize: 26, fontWeight: "700", color: COLORS.primaryDark }}>
          {project.name}
        </Text>

        <Text style={{ color: "#6B7280", marginTop: 4, marginBottom: 20 }}>
          {project.location || "No address provided"}
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
            <Text style={{ fontWeight: "600", color: COLORS.primary }}>
              View Photos
            </Text>
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
            <Text style={{ fontWeight: "600", color: COLORS.primary }}>
              View Receipts
            </Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </Link>
      </ScrollView>

      {/* FLOATING CAMERA BUTTON */}
      <TouchableOpacity
        onPress={async () => {
          try {
            setUploading(true);

            const done = await takePhoto();

            setUploading(false);

            if (done) {
              setSuccess(true);
              setTimeout(() => setSuccess(false), 1000);

              // refresh project
              setLoading(true);
              const data = await fetchProjectById(projectId);
              setProject(data);
              setLoading(false);
            }
          } catch (err) {
            console.log("Upload Error:", err);
            setUploading(false);
          }
        }}
        style={{
          position: "absolute",
          bottom: 30,
          right: 20,
          backgroundColor: COLORS.primary,
          width: 64,
          height: 64,
          borderRadius: 32,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 8,
        }}
      >
        <Ionicons name="camera" size={30} color="#fff" />
      </TouchableOpacity>


      {/* UPLOADING OVERLAY */}
      {uploading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>Uploading photo...</Text>
        </View>
      )}

      {/* SUCCESS CHECKMARK */}
      {success && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: 30,
              borderRadius: 50,
            }}
          >
            <Ionicons name="checkmark-circle" size={80} color="#4ade80" />
          </View>
        </View>
      )}

    </View>
  );
}
