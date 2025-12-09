import { COLORS } from "@/constants/colors";
import { logout } from "@/services/auth.service";
import { getContractor } from "@/services/contractor.service";
import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileOverview() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

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
        style={{ flex: 1, backgroundColor: COLORS.background }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* HEADER */}
        <View
          style={{
            paddingTop: 70,
            paddingBottom: 20,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: COLORS.primaryDark,
            }}
          >
            Profile
          </Text>
          <Text style={{ color: COLORS.primary, marginTop: 6 }}>
            Manage your information
          </Text>
        </View>

        {/* AVATAR + NAME */}
        <View
          style={{
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <View
            style={{
              width: 110,
              height: 110,
              borderRadius: 60,
              backgroundColor: COLORS.primary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 40,
                fontWeight: "700",
              }}
            >
              {initials}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: COLORS.primaryDark,
            }}
          >
            {contractor.name}
          </Text>
          <Text style={{ color: COLORS.primary, marginTop: 4 }}>
            {contractor.email}
          </Text>
        </View>

        {/* PERSONAL DETAILS CARD */}
        <TouchableOpacity
          onPress={() => router.push("/(dashboard)/profile/details")}
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 18,
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Personal Details
          </Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        {/* DOCUMENTS CARD */}
        <TouchableOpacity
          onPress={() => router.push("/(dashboard)/profile/documents")}
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 18,
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Documents
          </Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          onPress={() => setShowLogout(true)}
          style={{
            marginHorizontal: 20,
            backgroundColor: "#EF4444",
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
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

      {/* LOGOUT MODAL */}
      <LogoutModal
        show={showLogout}
        setShow={setShowLogout}
        setUser={setUser}
      />
    </>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: "#6B7280", fontSize: 14 }}>{label}</Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#111",
          marginTop: 2,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function LogoutModal({
  show,
  setShow,
  setUser,
}: {
  show: boolean;
  setShow: (v: boolean) => void;
  setUser: any;
}) {
  return (
    <Modal animationType="fade" transparent visible={show}>
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
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 8,
              color: COLORS.primaryDark,
            }}
          >
            Confirm Logout
          </Text>

          <Text style={{ color: "#6B7280", marginBottom: 18 }}>
            Are you sure you want to log out?
          </Text>

          <View
            style={{ flexDirection: "row", justifyContent: "flex-end", gap: 16 }}
          >
            <TouchableOpacity onPress={() => setShow(false)}>
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
                paddingHorizontal: 18,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
