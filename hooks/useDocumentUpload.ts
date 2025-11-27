import * as ImagePicker from "expo-image-picker";

export async function pickImage() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}

// Replace this with Cloudinary / Firebase upload
export async function uploadToCloud(imageUri: string): Promise<string> {
  console.log("Uploading... mock!");
  return Promise.resolve(imageUri); // temporary
}
