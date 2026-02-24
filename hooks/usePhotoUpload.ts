import { uploadPhoto } from "@/services/photos.service";
import { useAuthStore } from "@/store/auth.store";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export function usePhotoUpload(projectId?: string) {
  const user = useAuthStore((s) => s.user);

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const takePhoto = async (type: "before" | "after") => {
    if (!projectId) {
      console.log("❌ No project ID provided.");
      return false;
    }

    if (!type) {
      console.log("❌ No photo type provided.");
      return false;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required.");
      return false;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      base64: true,
    });

    if (result.canceled) return false;

    const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;

    setUploading(true);
    setSuccess(false);

    try {
      await uploadPhoto(projectId, base64, type);
      setSuccess(true);

      setTimeout(() => setSuccess(false), 1500);

      return true;
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload photo");
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    takePhoto,
    uploading,
    success,
  };
}