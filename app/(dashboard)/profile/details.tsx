import { COLORS } from "@/constants/colors";
import {
  getContractor,
  updateContractorProfile,
} from "@/services/contractor.service";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function PersonalDetailsScreen() {
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  // Dropdown modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);

  const STATUS_OPTIONS = ["Available", "Active", "Inactive"];

  const TRADE_OPTIONS = [
    "Carpenter",
    "Electrician",
    "Plumber",
    "Painter",
    "Mason",
    "Welder",
    "General Labor",
    "Foreman",
  ];

  useEffect(() => {
    async function load() {
      const data = await getContractor();
      setContractor(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !contractor) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const fields = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone Number" },
    {
      key: "trade",
      label: "Trade",
      isDropdown: true,
      onPress: () => setShowTradeModal(true),
    },
    {
      key: "status",
      label: "Status",
      isDropdown: true,
      onPress: () => setShowStatusModal(true),
    },
  ];

  const openEdit = (key: string, customPress?: () => void) => {
    if (customPress) return customPress(); // open dropdown
    setEditingField(key);
    setTempValue(contractor[key] || "");
  };

  const saveEdit = async () => {
    const updated = await updateContractorProfile({ [editingField!]: tempValue });
    setContractor(updated);
    setEditingField(null);

    Toast.show({
      type: "success",
      text1: "Saved Successfully",
      text2: `${editingField} updated`,
    });
  };

  const saveDropdownValue = async (key: string, value: string) => {
    const updated = await updateContractorProfile({ [key]: value });
    setContractor(updated);

    setShowStatusModal(false);
    setShowTradeModal(false);

    Toast.show({
      type: "success",
      text1: "Updated Successfully",
      text2: `${key} changed to ${value}`,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* HEADER */}
      <View
        style={{
          paddingTop: 60,
          paddingBottom: 18,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LEFT SIDE (Back + Title) */}
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

          <Text
            style={{
              fontSize: 26,
              fontWeight: "700",
              color: COLORS.primaryDark,
            }}
          >
            Personal Details
          </Text>
        </View>

        <Ionicons name="person-circle-outline" size={34} color={COLORS.primary} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View
          style={{
            backgroundColor: "#fff",
            marginHorizontal: 20,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            overflow: "hidden",
          }}
        >
          {fields.map((f, index) => {
            const value = contractor[f.key] || "Not set";
            const isMissing = value === "Not set";

            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => openEdit(f.key, f.onPress)}
                style={{
                  padding: 18,
                  borderBottomWidth: index !== fields.length - 1 ? 1 : 0,
                  borderColor: "#E5E7EB",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ fontSize: 13, color: "#6B7280" }}>{f.label}</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: isMissing ? "#EF4444" : "#111",
                      marginTop: 2,
                    }}
                  >
                    {value}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9CA3AF"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* EDIT TEXT MODAL */}
      <Modal visible={!!editingField} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            padding: 22,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 22,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 14 }}>
              Edit {editingField}
            </Text>

            <TextInput
              value={tempValue}
              onChangeText={setTempValue}
              style={{
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 12,
                padding: 12,
                fontSize: 16,
              }}
              placeholder="Enter value..."
              autoFocus
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: 20,
                gap: 12,
              }}
            >
              <TouchableOpacity onPress={() => setEditingField(null)}>
                <Text style={{ fontSize: 16, color: "#6B7280" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={saveEdit}
                style={{
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* STATUS DROPDOWN MODAL */}
      <OptionModal
        visible={showStatusModal}
        title="Select Status"
        options={STATUS_OPTIONS}
        onClose={() => setShowStatusModal(false)}
        onSelect={(val) => saveDropdownValue("status", val)}
      />

      {/* TRADE DROPDOWN MODAL */}
      <OptionModal
        visible={showTradeModal}
        title="Select Trade"
        options={TRADE_OPTIONS}
        onClose={() => setShowTradeModal(false)}
        onSelect={(val) => saveDropdownValue("trade", val)}
      />
    </View>
  );
}

/* ----------------------------
    DROPDOWN MODAL COMPONENT
-----------------------------*/
function OptionModal({
  visible,
  title,
  options,
  onClose,
  onSelect,
}: {
  visible: boolean;
  title: string;
  options: string[];
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          padding: 22,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
            {title}
          </Text>

          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => onSelect(opt)}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <Text style={{ fontSize: 16 }}>{opt}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 14, alignSelf: "flex-end" }}
          >
            <Text style={{ fontSize: 16, color: "#6B7280" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
