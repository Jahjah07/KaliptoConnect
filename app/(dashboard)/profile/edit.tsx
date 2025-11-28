import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { COLORS } from "@/constants/colors";
import { getContractor, updateContractorProfile } from "@/services/contractor.service";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfile() {
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [name, setName] = useState("");
  const [trade, setTrade] = useState("");
  const [phone, setPhone] = useState("");

  // Status dropdown
  const [status, setStatus] = useState("Available");
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getContractor();

      setContractor(data);
      setName(data.name || "");
      setTrade(data.trade || "");
      setPhone(data.phone || "");
      setStatus(data.status || "Available");

      setLoading(false);
    }

    load();
  }, []);

  async function onSave() {
    if (!name.trim()) {
      Alert.alert("Missing Name", "Please enter your name.");
      return;
    }

    setSaving(true);

    try {
      await updateContractorProfile({
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
      style={{ flex: 1, padding: 20, backgroundColor: COLORS.background, marginTop: 20 }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* 🔙 Back Button */}
      <TouchableOpacity
        onPress={() => router.push("/(dashboard)/profile")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          paddingVertical: 6,
        }}
      >
        <Ionicons
          name="chevron-back"
          size={26}
          color={COLORS.primaryDark}
          style={{ marginRight: 4 }}
        />
        <Text
          style={{
            fontSize: 18,
            color: COLORS.primaryDark,
            fontWeight: "600",
          }}
        >
          Back
        </Text>
      </TouchableOpacity>
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

      {/* NAME */}
      <Label text="Full Name" />
      <StyledInput value={name} onChangeText={setName} />

      {/* TRADE */}
      <Label text="Trade" />
      <StyledInput
        value={trade}
        placeholder="e.g. Carpenter, Plumber"
        onChangeText={setTrade}
      />

      {/* PHONE */}
      <Label text="Phone Number" />
      <StyledInput
        value={phone}
        placeholder="Enter phone number"
        keyboardType="number-pad"
        onChangeText={setPhone}
      />

      {/* STATUS DROPDOWN */}
      <Label text="Status" />
      <TouchableOpacity
        style={dropdownStyle.container}
        onPress={() => setShowStatusModal(true)}
      >
        <Text style={dropdownStyle.text}>{status}</Text>
      </TouchableOpacity>

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
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          {saving ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>

      {/* STATUS MODAL */}
      <StatusModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        selected={status}
        onSelect={(value) => {
          setStatus(value);
          setShowStatusModal(false);
        }}
      />
    </ScrollView>
  );
}

/* -------------------------
      STATUS MODAL
-------------------------- */

function StatusModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const statuses = ["Available", "Active", "Inactive"];

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          padding: 30,
        }}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 14,
              textAlign: "center",
            }}
          >
            Select Status
          </Text>

          {statuses.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => onSelect(s)}
              style={{
                padding: 14,
                borderRadius: 10,
                backgroundColor: selected === s ? COLORS.primary : "#f5f5f5",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: selected === s ? "#fff" : "#000",
                  fontWeight: "600",
                }}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
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

/* -------------------------
      DROPDOWN STYLE
-------------------------- */

const dropdownStyle = {
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  text: {
    fontSize: 16,
    color: "#111",
  },
};
