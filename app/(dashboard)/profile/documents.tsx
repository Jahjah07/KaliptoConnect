// app/(dashboard)/profile/documents.tsx
import DocumentUploadCard from "@/components/documents/DocumentUploadCard";
import { COLORS } from "@/constants/colors";
import { scheduleExpiryReminder } from "@/hooks/useNotification";
import {
  deleteContractorDocument,
  getContractor,
  getContractorDocumentPresign,
  saveContractorDocumentMetadata,
  type AllowedDocumentField
} from "@/services/contractor.service";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
/* ---------------------------------------
   Helpers
---------------------------------------- */

function getExpiryInfo(expiry?: string) {
  if (!expiry) return null;

  const daysLeft = Math.ceil(
    (new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0)
    return { label: "Expired", color: COLORS.error };

  if (daysLeft <= 30)
    return { label: `Expires in ${daysLeft} days`, color: COLORS.warning };

  return { label: `Expires in ${daysLeft} days`, color: COLORS.primary };
}

/* ---------------------------------------
   Screen
---------------------------------------- */

export default function DocumentsScreen() {
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busyField, setBusyField] = useState<AllowedDocumentField | null>(null);
  const [dateField, setDateField] = useState<AllowedDocumentField | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tempDate, setTempDate] = React.useState<Date | null>(null);
  const scheme = useColorScheme();

  useEffect(() => {
    getContractor().then((data) => {
      setContractor(data);
      setLoading(false);
    });
  }, []);

  function validateFileSize(
    size: number,
    mimeType: string
  ): string | null {
    const MB = 1024 * 1024;

    if (mimeType.startsWith("image/") && size > 8 * MB) {
      return "Images must be under 8 MB";
    }

    if (mimeType === "application/pdf" && size > 15 * MB) {
      return "PDF files must be under 15 MB";
    }

    return null;
  }

  /* ---------- Actions ---------- */

  async function pickAndUpload(field: AllowedDocumentField) {
    Alert.alert("Upload Document", "", [
      {
        text: "Take Photo",
        onPress: async () => {
          const permission =
            await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) {
            Toast.show({ type: "error", text1: "Camera permission required" });
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
          });

          if (!result.canceled) {
            await uploadAsset(field, result.assets[0]);
          }
        },
      },
      {
        text: "Choose from Gallery",
        onPress: async () => {
          const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

          if (!permission.granted) {
            if (!permission.canAskAgain) {
              // User permanently denied
              Alert.alert(
                "Photo Permission Required",
                "Please enable photo access in your device settings to upload images.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Open Settings",
                    onPress: () => Linking.openSettings(),
                  },
                ]
              );
            } else {
              Alert.alert(
                "Permission Required",
                "We need access to your photos to upload images."
              );
            }

            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
          });

          if (!result.canceled) {
            await uploadAsset(field, result.assets[0]);
          }
        },
      },
      {
        text: "Choose PDF from Files",
        onPress: async () => {
          const res = await DocumentPicker.getDocumentAsync({
            type: "application/pdf",
          });

          if (!res.canceled) {
            await uploadAsset(field, res.assets[0]);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  async function uploadAsset(field: AllowedDocumentField, asset: any) {
    try {
      setBusyField(field);
      setUploadProgress(0);

      const mimeType =
        asset.mimeType ||
        (asset.uri.endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg");

      const sizeError = validateFileSize(asset.size ?? 0, mimeType);
      if (sizeError) {
        Toast.show({ type: "error", text1: sizeError });
        return;
      }

      const { uploadUrl, objectKey } =
        await getContractorDocumentPresign({
          field,
          mimeType,
        });

      const fileBase64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const binary = Uint8Array.from(
        atob(fileBase64),
        (c) => c.charCodeAt(0)
      );

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", mimeType);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(
              Math.round((e.loaded / e.total) * 100)
            );
          }
        };

        xhr.onload = () =>
          xhr.status < 300 ? resolve() : reject();
        xhr.onerror = reject;
        xhr.send(binary);
      });

      const fileUrl = `https://kaliptoconstructionscdn.com/${objectKey}`;

      await saveContractorDocumentMetadata({
        field,
        fileUrl,
        objectKey,
      });

      setContractor(await getContractor());

      Toast.show({
        type: "success",
        text1: "Upload complete",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Upload failed",
      });
    } finally {
      setBusyField(null);
      setUploadProgress(null);
    }
  }

  function preview(url?: string) {
    if (!url) return;
    if (url.endsWith(".pdf")) {
      WebBrowser.openBrowserAsync(url);
    } else {
      setPreviewUrl(url);
    }
  }

  function confirmDelete(field: AllowedDocumentField) {
    Alert.alert(
      "Delete document?",
      "This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setBusyField(field);
            await deleteContractorDocument(field);
            setContractor(await getContractor());
            setBusyField(null);
          },
        },
      ]
    );
  }

  async function refreshContractor() {
    setRefreshing(true);
    try {
      const data = await getContractor();
      setContractor(data);
    } finally {
      setRefreshing(false);
    }
  }

  /* ---------- Render ---------- */

  if (loading || !contractor) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const docs = [
    { field: "abn", title: "ABN", value: contractor.abn, expiry: contractor.abnExpiry },
    { field: "contractorLicense", title: "Contractor License", value: contractor.contractorLicense, expiry: contractor.contractorLicenseExpiry },
    { field: "validId", title: "Valid Id", value: contractor.validId, expiry: contractor.validIdExpiry },
    { field: "publicLiabilityCopy", title: "Public Liability", value: contractor.publicLiabilityCopy, expiry: contractor.publicLiabilityCopyExpiry },
    { field: "workersInsuranceCopy", title: "Workers Insurance", value: contractor.workersInsuranceCopy, expiry: contractor.workersInsuranceCopyExpiry },
  ] as const;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ paddingBottom: 120 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshContractor}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* ---------- HEADER ---------- */}
      <View style={{ paddingTop: 50, paddingHorizontal: 20, marginBottom: 20, marginTop: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => router.replace("/profile")}
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
            }}
          >
            Documents
          </Text>
        </View>

        <Text style={{ marginTop: 4, color: "#6B7280" }}>
          Upload and manage your required contractor documents.
        </Text>
      </View>

      {/* ---------- CONTENT ---------- */}
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

        {docs.map((doc) => {
          const expiry = getExpiryInfo(doc.expiry);

          return (
            <DocumentUploadCard
              key={doc.field}
              title={doc.title}
              value={doc.value}
              loading={busyField === doc.field}
              progress={busyField === doc.field ? uploadProgress : null}
              badgeText={expiry?.label}
              badgeColor={expiry?.color}
              onPrimaryAction={() =>
                doc.value ? preview(doc.value) : pickAndUpload(doc.field)
              }
              onReplace={() => pickAndUpload(doc.field)}
              onSetExpiry={() => {
                const existingExpiry = doc.expiry
                  ? new Date(doc.expiry)
                  : new Date();

                setTempDate(existingExpiry);
                setDateField(doc.field);
              }}
              onDelete={() => confirmDelete(doc.field)}
            />
          );
        })}
      </View>

      {/* ---------- DATE PICKER ---------- */}
      {dateField && (
        Platform.OS === "ios" ? (
          <Modal
            transparent
            animationType="slide"
            onRequestClose={() => setDateField(null)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <View style={{ backgroundColor: "#1c1c1e", padding: 16 }}>
                <DateTimePicker
                  value={tempDate ?? new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(_, date) => {
                    if (date) setTempDate(date);
                  }}
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Button title="Cancel" onPress={() => setDateField(null)} />
                  <Button
                    title="Done"
                    onPress={async () => {
                      if (!tempDate || !dateField) return;

                      const field = dateField;
                      const expiry = tempDate.toLocaleDateString("en-CA");

                      setDateField(null);

                      await saveContractorDocumentMetadata({ field, expiry });
                      await scheduleExpiryReminder(field, expiry);
                      setContractor(await getContractor());
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={new Date()}
            mode="date"
            themeVariant={scheme === "dark" ? "dark" : "light"}
            onChange={async (event, date) => {
              if (event.type !== "set" || !date || !dateField) {
                setDateField(null);
                return;
              }

              const field = dateField;
              setDateField(null);

              const expiry = date.toISOString().slice(0, 10);

              await saveContractorDocumentMetadata({ field, expiry });
              await scheduleExpiryReminder(field, expiry);
              setContractor(await getContractor());
            }}
          />
        )
      )}

      {/* ---------- IMAGE PREVIEW ---------- */}
      <Modal visible={!!previewUrl} transparent>
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <Pressable
            style={{ position: "absolute", top: 40, right: 20, zIndex: 10 }}
            onPress={() => setPreviewUrl(null)}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>Close</Text>
          </Pressable>
          {previewUrl && (
            <Image
              source={{ uri: previewUrl }}
              style={{ flex: 1, resizeMode: "contain" }}
            />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}
