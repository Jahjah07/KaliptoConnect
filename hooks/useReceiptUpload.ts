import { uploadReceipt } from "@/services/receipts.service";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export function useReceiptUpload(projectId?: string) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const takeReceiptPhoto = async () => {
    if (!projectId) {
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
      // 🧾 Upload directly — no OCR
      await uploadReceipt(projectId, base64);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);

      return true;
    } catch (err) {
      console.error("Receipt upload failed:", err);
      alert("Failed to upload receipt");
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    takeReceiptPhoto,
    uploading,
    success,
  };
}
