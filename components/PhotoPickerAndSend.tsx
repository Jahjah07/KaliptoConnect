// components/PhotoPickerAndSend.tsx
import React from "react";
import { View, TouchableOpacity, Text, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addPhoto } from "@/services/api";
import { COLORS } from "@/constants/colors";

export default function PhotoPickerAndSend({ projectId }: { projectId: string }) {
  const [localUri, setLocalUri] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) {
      Alert.alert("Permission required", "We need permission to access photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      console.log(asset.uri);
    }
  };

  const onSend = async () => {
    if (!localUri) return;
    setUploading(true);

    try {
      // Option A: Upload file to your storage (S3/GCS) with signed URL or server endpoint
      // Option B: For now, we send metadata only and let server handle later
      const fileName = localUri.split("/").pop() || `photo-${Date.now()}.jpg`;

      // If you uploaded to storage, set the url; here we omit url
      await addPhoto(projectId, {
        fileName,
        url: undefined,
        caption: "Site photo",
      });

      Alert.alert("Uploaded", "Photo metadata saved.");
      setLocalUri(null);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 12 }}>
        <Text style={{ color: COLORS.primary }}>Pick Image</Text>
      </TouchableOpacity>

      {localUri ? <Image source={{ uri: localUri }} style={{ width: 120, height: 90, borderRadius: 8 }} /> : null}

      {localUri && (
        <TouchableOpacity onPress={onSend} style={{ marginTop: 10, padding: 10, backgroundColor: COLORS.primary, borderRadius: 8 }}>
          <Text style={{ color: "#fff" }}>{uploading ? "Uploading..." : "Send Photo"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
