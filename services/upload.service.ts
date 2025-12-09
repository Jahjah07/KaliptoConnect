import Constants from "expo-constants";

const CLOUD_NAME = Constants.expoConfig?.extra?.CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = Constants.expoConfig?.extra?.CLOUDINARY_UPLOAD_PRESET;

export async function uploadToCloudinary(localUri: string) {
  const formData = new FormData();

  formData.append("file", {
    uri: localUri,
    type: "image/jpeg",
    name: "document.jpg",
  } as any);

  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!data.secure_url) {
    console.log("Cloudinary Error:", data);
    throw new Error("Upload failed");
  }

  return data.secure_url;
}
