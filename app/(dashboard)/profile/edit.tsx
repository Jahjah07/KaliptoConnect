import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { COLORS } from "@/constants/colors";
import { useAuthStore } from "@/store/auth.store";
import { getContractor, updateContractorProfile } from "@/services/contractor.service";
import { router } from "expo-router";

export default function EditProfile() {
  const user = useAuthStore((s) => s.user);
  const uid = user?.uid;

  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // editable fields
  const [name, setName] = useState("");
  const [trade, setTrade] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Available");

  useEffect(() => {
    async function load() {
      if (!uid) return;
      const data = await getContractor(uid);

      setContractor(data);
      setName(data.name || "");
      setTrade(data.trade || "");
      setPhone(data.phone || "");
      setStatus(data.status || "Available");

      setLoading(false);
    }

    load();
  }, [uid]);

  async function onSave() {
    if (!uid) return;

    if (!name.trim()) {
      Alert.alert("Missing Name", "Please enter your name.");
      return;
    }

    setSaving(true);

    try {
      await updateContractorProfile(uid, {
        name,
        trade,
        phone,
        status,
      });

      Alert.alert("Success", "Profile updated!");
      router.back();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, padding: 20, backgroundColor: COLORS.background }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          color: COLORS.primaryDark,
          marginBottom: 20,
        }}
      >
        Edit Profile
      </Text>

      {/* FIELD */}
      <Label text="Full Name" />
      <StyledInput value={name} onChangeText={setName} />

      <Label text="Trade" />
      <StyledInput
        value={trade}
        placeholder="e.g. Carpenter, Plumber"
        onChangeText={setTrade}
      />

      <Label text="Phone Number" />
      <StyledInput
        value={phone}
        placeholder="Enter phone number"
        keyboardType="number-pad"
        onChangeText={setPhone}
      />

      <Label text="Status" />
      <StyledInput
        value={status}
        placeholder="Available / Active / Inactive"
        onChangeText={setStatus}
      />

      {/* SAVE BUTTON */}
      <TouchableOpacity
        onPress={onSave}
        disabled={saving}
        style={{
          marginTop: 30,
          paddingVertical: 14,
          borderRadius: 12,
          backgroundColor: COLORS.primary,
          alignItems: "center",
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          {saving ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* -------------------------
      REUSABLE COMPONENTS
-------------------------- */

function Label({ text }: { text: string }) {
  return (
    <Text style={{ color: "#6B7280", marginBottom: 6, marginTop: 16 }}>
      {text}
    </Text>
  );
}

function StyledInput(props: any) {
  return (
    <TextInput
      {...props}
      style={{
        backgroundColor: "#fff",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        fontSize: 16,
      }}
    />
  );
}
