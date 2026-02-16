import { COLORS } from "@/constants/colors";
import { logout } from "@/services/auth.service";
import { getContractor } from "@/services/contractor.service";
import { useAuthStore } from "@/store/auth.store";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SettingsRow } from "../../../components/profile/SettingsRow";

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
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 60 }}
      >
        {/* AVATAR + NAME */}
        <View
          style={{
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <View
            style={{
              width: 116,
              height: 116,
              borderRadius: 58,
              borderWidth: 3,
              borderColor: COLORS.primary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 104,
                height: 104,
                borderRadius: 52,
                backgroundColor: COLORS.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 36, fontWeight: "700" }}>
                {initials}
              </Text>
            </View>
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
        {/* ACCOUNT SECTION */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            marginHorizontal: 20,
            marginBottom: 24,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#6B7280",
              marginVertical: 14,
            }}
          >
            Account
          </Text>

          <SettingsRow
            label="Personal Details"
            icon="person-outline"
            onPress={() => router.push("/(dashboard)/profile/details")}
          />

          <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />

          <SettingsRow
            label="Documents"
            icon="folder-outline"
            onPress={() => router.push("/(dashboard)/profile/documents")}
          />
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          onPress={() => setShowLogout(true)}
          style={{
            marginHorizontal: 20,
            marginBottom: 40,
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#EF4444",
          }}
        >
          <Text
            style={{
              color: "#EF4444",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Log Out
          </Text>
        </TouchableOpacity>

        {/* LEGAL SECTION */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            marginHorizontal: 20,
            marginBottom: 24,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#6B7280",
              marginVertical: 14,
            }}
          >
            Legal
          </Text>

          <SettingsRow
            label="Privacy Policy"
            icon="shield-checkmark-outline"
            onPress={() =>
              Linking.openURL("https://yourdomain.com/privacy-policy")
            }
          />

          <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />

          <SettingsRow
            label="Terms of Service"
            icon="document-text-outline"
            onPress={() =>
              Linking.openURL("https://yourdomain.com/terms-of-service")
            }
          />

          <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />

          <SettingsRow
            label="Delete Account"
            icon="trash-outline"
            danger
            onPress={() =>
              router.push("/(dashboard)/profile/delete-account")
            }
          />
        </View>
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
