// app/(dashboard)/profile/documents.tsx
import DocumentUploadCard from "@/components/documents/DocumentUploadCard";
import { COLORS } from "@/constants/colors";
import { getContractor, updateContractorDocument } from "@/services/contractor.service";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import Toast from "react-native-toast-message";

export default function DocumentsScreen() {
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
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

    try {
      const safeName = contractor.name
        ? contractor.name.replace(/[^a-zA-Z0-9]/g, "_")
        : "unknown";

      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: `${field}.jpg`,
      } as any);

      formData.append(
        "upload_preset",
        Constants.expoConfig?.extra?.CLOUDINARY_UPLOAD_PRESET
      );

      // 👇 Save under contractors/{name}
      formData.append("folder", `contractors/${safeName}`);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${Constants.expoConfig?.extra?.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await cloudinaryRes.json();

      if (!data.secure_url) {
        Toast.show({
          type: "error",
          text1: "Upload Failed",
          text2: "Cloudinary did not return a valid URL.",
        });
        return;
      }

      const updated = await updateContractorDocument(field, data.secure_url);
      setContractor(updated);
      Toast.show({
        type: "success",
        text1: "Document Uploaded",
        text2: `${field} has been updated successfully`,
      });
    } catch (err) {
      console.log("❌ Upload failed:", err);
      Toast.show({
        type: "error",
        text1: "Upload Error",
        text2: "Something went wrong. Try again.",
      });
    }
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
      style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: 50 }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* HEADER */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
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
              fontSize: 28,
              fontWeight: "800",
              color: COLORS.primaryDark,
              letterSpacing: -0.5,
            }}
          >
            Documents
          </Text>
        </View>
        <Text style={{ marginTop: 4, color: "#6B7280" }}>
          Upload your required contractor documents.
        </Text>
      </View>

      {/* DOCUMENT SECTION */}
      <View
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 20,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 16,
            color: COLORS.primaryDark,
          }}
        >
          Required Documents
        </Text>

        {/* ABN */}
        <DocumentUploadCard
          title="ABN"
          subtitle="Registered Australian Business Number"
          icon="briefcase-outline"
          value={contractor.abn}
          expiry={contractor.abnExpiry}
          statusColor={!contractor.abn ? COLORS.error : COLORS.primary}
          onUpload={() => handleUpload("abn")}
          onExpiryChange={() => {
            setSelectedField("abn");
            setShowDatePicker(true);
          }}
        />

        {/* Contractor License */}
        <DocumentUploadCard
          title="Contractor License"
          subtitle="Your professional trade license"
          icon="shield-checkmark-outline"
          value={contractor.contractorLicense}
          expiry={contractor.contractorLicenseExpiry}
          statusColor={
            !contractor.contractorLicense ? COLORS.error : COLORS.primary
          }
          onUpload={() => handleUpload("contractorLicense")}
          onExpiryChange={() => {
            setSelectedField("contractorLicense");
            setShowDatePicker(true);
          }}
        />

        {/* Driver's License */}
        <DocumentUploadCard
          title="Driver's License"
          subtitle="Government-issued ID"
          icon="card-outline"
          value={contractor.driversLicense}
          expiry={contractor.driversLicenseExpiry}
          statusColor={
            !contractor.driversLicense ? COLORS.error : COLORS.primary
          }
          onUpload={() => handleUpload("driversLicense")}
          onExpiryChange={() => {
            setSelectedField("driversLicense");
            setShowDatePicker(true);
          }}
        />

        {/* Public Liability */}
        <DocumentUploadCard
          title="Public Liability Insurance"
          subtitle="Proof of insurance coverage"
          icon="document-lock-outline"
          value={contractor.publicLiabilityCopy}
          expiry={contractor.publicLiabilityExpiry}
          statusColor={
            !contractor.publicLiabilityCopy ? COLORS.error : COLORS.primary
          }
          onUpload={() => handleUpload("publicLiabilityCopy")}
          onExpiryChange={() => {
            setSelectedField("publicLiabilityCopy");
            setShowDatePicker(true);
          }}
        />

        {/* Workers Insurance */}
        <DocumentUploadCard
          title="Workers Insurance"
          subtitle="Workers compensation coverage"
          icon="document-text-outline"
          value={contractor.workersInsuranceCopy}
          expiry={contractor.workersInsuranceExpiry}
          statusColor={
            !contractor.workersInsuranceCopy ? COLORS.error : COLORS.primary
          }
          onUpload={() => handleUpload("workersInsuranceCopy")}
          onExpiryChange={() => {
            setSelectedField("workersInsuranceCopy");
            setShowDatePicker(true);
          }}
        />
      </View>

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
