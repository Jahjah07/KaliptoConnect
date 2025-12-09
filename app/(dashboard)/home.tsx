import ProjectListCard from "@/components/dashboard/ProjectListCard";
import StatCard from "@/components/dashboard/StatCard";
import Skeleton from "@/components/ui/Skeleton";
import { COLORS } from "@/constants/colors";
import { getContractor } from "@/services/contractor.service";
import { fetchContractorProjects } from "@/services/projects.service";
import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const [contractor, setContractor] = useState<any>(null);
  const router = useRouter();
  const missingFields = {
    name: !contractor?.name,
    email: !contractor?.email,
    phone: !contractor?.phoneNumber,
    trade: !contractor?.trade,
  };
  const requiredDocs = [
    "abn",
    "contractorLicense",
    "driversLicense",
    "publicLiabilityCopy",
    "workersInsuranceCopy",
  ];
  const missingDocuments = requiredDocs.filter(
    (doc) => !contractor?.[doc]
  );
  const missingFieldList = Object.keys(missingFields).filter(
    (key) => missingFields[key as keyof typeof missingFields]
  );
  const hasMissingDocs = missingDocuments.length > 0;
  const hasMissingFields = missingFieldList.length > 0;

  const showProfileCard = hasMissingDocs || hasMissingFields;
  const isProfileIncomplete = Object.values(missingFields).includes(true);
  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U";

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // 🔄 Auto-refresh when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      reloadDashboard().finally(() => setLoading(false));
    }, [])
  );

  const reloadDashboard = async () => {
    try {
      const data = await fetchContractorProjects();
      setProjects(Array.isArray(data) ? data : []);

      const contractorData = await getContractor();
      setContractor(contractorData);
    } catch (err) {
      console.log("❌ Refresh error:", err);
    }
  };

  if (loading) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.background }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* HEADER SKELETON */}
        <View style={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 30 }}>
          <Skeleton width={120} height={20} />
          <Skeleton width={180} height={28} style={{ marginTop: 10 }} />
          <Skeleton width={140} height={18} style={{ marginTop: 6 }} />

          <View
            style={{
              position: "absolute",
              right: 20,
              top: 60,
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "#E5E7EB",
            }}
          />
        </View>

        {/* WHITE BODY */}
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
          {/* STATS CARDS SKELETON */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Skeleton width={"30%"} height={90} radius={16} />
            <Skeleton width={"30%"} height={90} radius={16} />
            <Skeleton width={"30%"} height={90} radius={16} />
          </View>

          {/* CURRENT PROJECTS TITLE */}
          <Skeleton width={160} height={24} style={{ marginBottom: 12 }} />

          {/* 3 Cards */}
          <Skeleton width={"100%"} height={80} radius={16} style={{ marginBottom: 12 }} />
          <Skeleton width={"100%"} height={80} radius={16} style={{ marginBottom: 12 }} />
          <Skeleton width={"100%"} height={80} radius={16} style={{ marginBottom: 12 }} />

          {/* RECENT PROJECTS TITLE */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 30,
              marginBottom: 10,
            }}
          >
            <Skeleton width={150} height={24} />
            <Skeleton width={80} height={20} />
          </View>

          {/* 2 Cards */}
          <Skeleton width={"100%"} height={80} radius={16} style={{ marginBottom: 12 }} />
          <Skeleton width={"100%"} height={80} radius={16} />
        </View>
      </ScrollView>
    );
  }

  const requiredFields = ["name", "trade", "phone", "status"];

  const filledCount = requiredFields.filter(
    (field) => contractor?.[field]
  ).length;

  const completion = Math.round((filledCount / requiredFields.length) * 100);
  let progressColor = COLORS.primary;

  if (completion < 40) progressColor = COLORS.error; 
  else if (completion < 75) progressColor = COLORS.warning;
  else progressColor = COLORS.primary;               
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

  const onRefresh = async () => {
    setRefreshing(true);
    await reloadDashboard();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* HEADER */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 28,
        }}
      >
        <Text style={{ color: COLORS.primary, opacity: 0.7, fontSize: 15 }}>
          Welcome back,
        </Text>

        <Text
          style={{
            color: COLORS.primaryDark,
            fontSize: 30,
            fontWeight: "800",
            marginTop: 4,
            letterSpacing: -0.5,
          }}
        >
          {contractor?.name ?? "Contractor"}
        </Text>

        <Text
          style={{ color: COLORS.primary, marginTop: 4, fontSize: 14 }}
        >
          Kalipto Constructions Dashboard
        </Text>

        {/* Profile Bubble */}
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
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            {initials}
          </Text>
        </View>
      </View>

      {/* MAIN CONTENT AREA */}
      <View
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 24,
          paddingVertical: 26,
          marginTop: -12,

          // Max-width container for tablets
          width: "100%",
          alignSelf: "center",
        }}
      >
        {/* PROFILE COMPLETION CARD */}
        {showProfileCard && (
          <TouchableOpacity
            onPress={() => router.push("/(dashboard)/profile/documents")}
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 20,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 3,

              borderLeftWidth: 5,
              borderLeftColor: hasMissingDocs ? COLORS.error : progressColor,
            }}
          >
            {/* HEADER */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <Ionicons
                name={hasMissingDocs ? "document-attach-outline" : "alert-circle-outline"}
                size={30}
                color={hasMissingDocs ? COLORS.error : progressColor}
                style={{ marginRight: 12 }}
              />

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: COLORS.primaryDark,
                }}
              >
                {hasMissingDocs ? "Upload Required Documents" : "Complete Your Profile"}
              </Text>
            </View>

            {/* Missing Documents */}
            {hasMissingDocs && (
              <View>
                <Text style={{ fontWeight: "600", color: COLORS.error, marginBottom: 6 }}>
                  Missing Documents:
                </Text>

                {missingDocuments.map((doc) => (
                  <Text
                    key={doc}
                    style={{ color: "#6B7280", marginLeft: 6, marginBottom: 4 }}
                  >
                    • {doc
                      .replace(/([A-Z])/g, " $1")
                      .replace("Copy", "")
                      .trim()}
                  </Text>
                ))}

                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}
                >
                  <Text
                    style={{ color: COLORS.error, fontWeight: "700", marginRight: 4 }}
                  >
                    Upload Now
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.error} />
                </View>
              </View>
            )}

            {/* Missing Fields (only show if documents complete) */}
            {!hasMissingDocs && hasMissingFields && (
              <>
                <Text style={{ color: "#6B7280", marginBottom: 8 }}>
                  Missing:{" "}
                  {missingFieldList
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(", ")}
                </Text>

                {/* Progress Bar */}
                <View
                  style={{
                    width: "100%",
                    height: 10,
                    backgroundColor: "#E5E7EB",
                    borderRadius: 20,
                    overflow: "hidden",
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      width: `${completion}%`,
                      height: "100%",
                      backgroundColor: progressColor,
                    }}
                  />
                </View>

                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 4 }}
                >
                  <Text style={{ color: COLORS.primary, fontWeight: "700", marginRight: 4 }}>
                    Update Now
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
                </View>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* STATS SECTION */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 14,
            color: COLORS.primaryDark,
          }}
        >
          Overview
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 26,
          }}
        >
          <StatCard
            icon="folder"
            label="Projects"
            value={String(totalProjects)}
            onPress={() => router.push("/(dashboard)/project")}
          />
          <StatCard
            icon="camera"
            label="Photos"
            value={String(totalPhotos)}
            onPress={() => router.push("/(dashboard)/photos")}
          />
          <StatCard
            icon="image"
            label="Receipts"
            value={String(totalReceipts)}
            onPress={() => router.push("/(dashboard)/receipts")}
          />
        </View>

        {/* CURRENT PROJECTS */}
        <Text
          style={{
            fontWeight: "700",
            fontSize: 20,
            marginBottom: 12,
            color: COLORS.primaryDark,
          }}
        >
          Current Projects
        </Text>

        {currentProjects.length === 0 ? (
          <View
            style={{
              backgroundColor: "#F7FAFC",
              padding: 18,
              borderRadius: 14,
            }}
          >
            <Text style={{ color: "#6B7280" }}>No active projects.</Text>
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
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: 20,
              color: COLORS.primaryDark,
            }}
          >
            Recent Projects
          </Text>

          <TouchableOpacity onPress={() => router.push("/(dashboard)/project")}>
            <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
              View All →
            </Text>
          </TouchableOpacity>
        </View>

        {recentProjects.length === 0 ? (
          <Text style={{ color: "#6B7280" }}>No recent projects.</Text>
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
