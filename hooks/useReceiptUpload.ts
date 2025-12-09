import { runOCR } from "@/services/ocr.service";
import { extractReceiptDataText } from "@/utils/extractReceiptData";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";

export function useReceiptUpload(projectId?: string) {
  const [loading, setLoading] = useState(false);

  const takeReceiptPhoto = async () => {
    if (!projectId) return false;

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission required");
      return false;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.8,
    });

    if (result.canceled) return false;

    const base64 = result.assets[0].base64!;
    const dataURL = `data:image/jpeg;base64,${base64}`;

    setLoading(true);

    try {
      const rawText = await runOCR(dataURL);
      const { amount, store, date } = extractReceiptDataText(rawText);

      // ⭐ RELATIVE ROUTE WITH TYPESCRIPT OVERRIDE
      router.push(
        `review?base64=${encodeURIComponent(dataURL)}&amount=${amount}&store=${encodeURIComponent(store)}&date=${date}` as any
      );

      return true;
    } catch (err) {
      console.log("OCR failed:", err);
      alert("Failed to scan receipt");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { takeReceiptPhoto, loading };
}
