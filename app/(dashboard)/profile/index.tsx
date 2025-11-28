import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useAuthStore } from "@/store/auth.store";
import { getContractor } from "@/services/contractor.service";
import { router, useFocusEffect } from "expo-router";
import { logout } from "@/services/auth.service";

export default function ProfileOverview() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const uid = user?.uid;
  const [loading, setLoading] = useState(true);
  const [contractor, setContractor] = useState<any>(null);

  const [showLogout, setShowLogout] = useState(false);

  // Load contractor profile
  useFocusEffect(
    useCallback(() => {
      async function load() {
        setLoading(true);
        try {
          const data = await getContractor();
          setContractor(data);
        } catch (err) {
          console.log("Failed to load contractor:", err);
        } finally {
          setLoading(false);
        }
      }

      if (user?.uid) load();
    }, [user?.uid])
  );

  if (loading || !contractor) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const initials =
    contractor.name
      ?.split(" ")
      .map((s: string) => s[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <>
      <ScrollView
        style={{ flex: 1, padding: 20, backgroundColor: COLORS.background }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Avatar + Name Section */}
        <View style={{ alignItems: "center", marginBottom: 30, marginTop: 30 }}>
          <View
            style={{
              width: 95,
              height: 95,
              borderRadius: 50,
              backgroundColor: COLORS.primary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 30, fontWeight: "700" }}>
              {initials}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: COLORS.primaryDark,
            }}
          >
            {contractor.name}
          </Text>
          <Text style={{ color: COLORS.primary, marginTop: 2 }}>
            {contractor.email}
          </Text>
        </View>

        {/* Profile Details Card */}
        <View
          style={{
            backgroundColor: "#fff",
            padding: 22,
            borderRadius: 16,
            marginBottom: 20,
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 14,
              color: COLORS.primaryDark,
            }}
          >
            Profile Information
          </Text>

          <ProfileRow label="Name" value={contractor.name} />
          <ProfileRow label="Email" value={contractor.email} />
          <ProfileRow label="Trade" value={contractor.trade || "Not set"} />
          <ProfileRow label="Phone" value={contractor.phone || "Not set"} />
          <ProfileRow label="Status" value={contractor.status || "Available"} />

          <TouchableOpacity
            onPress={() => router.push("/(dashboard)/profile/edit")}
            style={{
              marginTop: 20,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: COLORS.primary,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Documents Button */}
        <TouchableOpacity
          onPress={() => router.push("/(dashboard)/profile/documents")}
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowOpacity: 0.06,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Documents</Text>
          <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => setShowLogout(true)}
          style={{
            marginTop: 30,
            backgroundColor: "#EF4444",
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Modal */}
      <Modal animationType="fade" transparent visible={showLogout}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "#fff",
              padding: 22,
              borderRadius: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
              Confirm Logout
            </Text>
            <Text style={{ color: "#6B7280", marginBottom: 20 }}>
              Are you sure you want to log out?
            </Text>

            <View
              style={{ flexDirection: "row", justifyContent: "flex-end", gap: 14 }}
            >
              <TouchableOpacity onPress={() => setShowLogout(false)}>
                <Text style={{ color: "#6B7280", fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await logout();
                  setUser(null);
                  router.replace("/(auth)/login");
                }}
                style={{
                  backgroundColor: "#EF4444",
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

// Reusable row component
function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: "#6B7280", fontSize: 14 }}>{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#111" }}>
        {value}
      </Text>
    </View>
  );
}
