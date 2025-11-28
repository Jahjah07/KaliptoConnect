// app/(dashboard)/profile/documents.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "@/constants/colors";
import { getContractor, updateContractorDocument } from "@/services/contractor.service";
import DocumentUploadCard from "@/components/documents/DocumentUploadCard";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DocumentsScreen() {
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // ---------------------------
  // LOAD CONTRACTOR PROFILE
  // ---------------------------
  useEffect(() => {
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

    load();
  }, []);

  // ---------------------------
  // IMAGE UPLOAD HANDLER
  // ---------------------------
  const handleUpload = async (field: string) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (res.canceled) return;

    const uri = res.assets[0].uri;

    const updated = await updateContractorDocument(field, uri);
    setContractor(updated);
  };

  // ---------------------------
  // EXPIRY DATE HANDLER
  // ---------------------------
  const handleExpiryChange = async (_: any, date?: Date) => {
    setShowDatePicker(false);

    if (selectedField && date) {
      const expiry = date.toISOString().slice(0, 10);

      // Map field → correct backend fields
      const updated = await updateContractorDocument(selectedField, "", expiry);

      setContractor(updated);
    }
  };

  if (loading || !contractor) {
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
        Documents
      </Text>

      {/* 1. ABN */}
      <DocumentUploadCard
        title="ABN"
        value={contractor.abn}
        expiry={contractor.abnExpiry}
        onUpload={() => handleUpload("abn")}
        onExpiryChange={() => {
          setSelectedField("abn");
          setShowDatePicker(true);
        }}
      />

      {/* 2. Contractor License */}
      <DocumentUploadCard
        title="Contractor License"
        value={contractor.contractorLicense}
        expiry={contractor.contractorLicenseExpiry}
        onUpload={() => handleUpload("contractorLicense")}
        onExpiryChange={() => {
          setSelectedField("contractorLicense");
          setShowDatePicker(true);
        }}
      />

      {/* 3. Driver's License */}
      <DocumentUploadCard
        title="Driver's License"
        value={contractor.driversLicense}
        expiry={contractor.driversLicenseExpiry}
        onUpload={() => handleUpload("driversLicense")}
        onExpiryChange={() => {
          setSelectedField("driversLicense");
          setShowDatePicker(true);
        }}
      />

      {/* 4. Public Liability */}
      <DocumentUploadCard
        title="Public Liability"
        value={contractor.publicLiabilityCopy}
        expiry={contractor.publicLiabilityExpiry}
        onUpload={() => handleUpload("publicLiabilityCopy")}
        onExpiryChange={() => {
          setSelectedField("publicLiabilityCopy");
          setShowDatePicker(true);
        }}
      />

      {/* 5. Workers Insurance */}
      <DocumentUploadCard
        title="Workers Insurance"
        value={contractor.workersInsuranceCopy}
        expiry={contractor.workersInsuranceExpiry}
        onUpload={() => handleUpload("workersInsuranceCopy")}
        onExpiryChange={() => {
          setSelectedField("workersInsuranceCopy");
          setShowDatePicker(true);
        }}
      />

      {/* DATE PICKER */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          minimumDate={new Date()}
          onChange={handleExpiryChange}
        />
      )}
    </ScrollView>
  );
}
