"use client";

import { COLORS } from "@/constants/colors";
import {
  fetchReceiptById,
  updateReceipt,
} from "@/services/receipts.edit.service";
import { Receipt } from "@/types/receipt";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function EditReceiptScreen() {
  const router = useRouter();
  const { receiptId } = useLocalSearchParams<{ receiptId: string }>();

  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------------------------------------
     LOAD RECEIPT
  ----------------------------------------*/
  useEffect(() => {
    if (!receiptId) return;

    (async () => {
      try {
        const data = await fetchReceiptById(receiptId);

        setReceipt(data);

        // ✅ Title
        if (data.title) {
          setTitle(data.title);
        } else {
          setTitle(`receipt-${data._id.slice(-3)}`);
        }

        setAmount(data.amount != null ? String(data.amount) : "");

        const baseDate =
          data.date ?? data.uploadedAt;

        setDate(baseDate?.slice(0, 10) ?? "");

        setTempDate(baseDate ? new Date(baseDate) : new Date());
      } catch (err) {
        console.error("Failed to load receipt:", err);
        alert("Failed to load receipt");
        router.back();
      } finally {
        setLoading(false);
      }
    })();
  }, [receiptId]);

  /* ---------------------------------------
     SAVE
  ----------------------------------------*/
  async function handleSave() {
    if (!receipt) return;

    const parsedAmount =
      amount.trim() === "" ? null : Number(amount);

    if (parsedAmount != null && Number.isNaN(parsedAmount)) {
      alert("Invalid amount");
      return;
    }

    try {
      setSaving(true);

      await updateReceipt(receipt._id, {
        title: title.trim() || `receipt-${receipt._id.slice(-3)}`,
        amount: parsedAmount,
        date: date || null,
      });

      Toast.show({
        type: "success",
        text1: "Receipt updated",
      });

      // ✅ Force refresh of previous screen
      router.replace({
        pathname: "/(dashboard)/project/[id]/receipts",
        params: { id: receipt.projectId, refresh: Date.now() },
      });

    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to save changes");
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

  if (!receipt) return null;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginTop: 40 }}>
        Edit Receipt
      </Text>

      {/* TITLE */}
      <Text style={{ marginTop: 20, fontWeight: "600" }}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="receipt-001"
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          marginTop: 6,
        }}
      />

      {/* AMOUNT */}
      <Text style={{ marginTop: 20, fontWeight: "600" }}>Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="numeric"
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          marginTop: 6,
        }}
      />

      {/* DATE */}
      <Text style={{ marginTop: 16, fontWeight: "600" }}>Date</Text>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          marginTop: 6,
        }}
      >
        <Text style={{ color: date ? "#111827" : "#9CA3AF" }}>
          {date || "Select date"}
        </Text>
      </TouchableOpacity>

      {/* SAVE */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={saving}
        style={{
          backgroundColor: COLORS.primary,
          padding: 16,
          borderRadius: 12,
          marginTop: 30,
          alignItems: "center",
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Save Changes
          </Text>
        )}
      </TouchableOpacity>

      {/* CANCEL */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          padding: 16,
          borderRadius: 12,
          backgroundColor: "#E5E7EB",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ fontWeight: "600" }}>Cancel</Text>
      </TouchableOpacity>

      {showDatePicker &&
        (Platform.OS === "ios" ? (
          <Modal transparent animationType="slide">
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <View style={{ backgroundColor: "#fff", padding: 16 }}>
                <DateTimePicker
                  value={tempDate ?? new Date()}
                  mode="date"
                  display="default"
                  onChange={(_, selectedDate) => {
                    if (selectedDate) setTempDate(selectedDate);
                  }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    title="Cancel"
                    onPress={() => setShowDatePicker(false)}
                  />
                  <Button
                    title="Done"
                    onPress={() => {
                      if (!tempDate) return;
                      setDate(tempDate.toLocaleDateString("en-CA"));
                      setShowDatePicker(false);
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={tempDate ?? new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event.type !== "set" || !selectedDate) return;
              setTempDate(selectedDate);
              setDate(selectedDate.toLocaleDateString("en-CA"));
            }}
          />
        ))}
    </View>
  );
}
