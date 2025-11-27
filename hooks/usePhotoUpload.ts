import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { addPhoto } from "@/services/api";

export function usePhotoUpload() {
  const takePhoto = async () => {
    // Ask camera permission
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is needed.");
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    Alert.alert("Photo Taken!", `URI:\n${asset.uri}`);
    return asset;
    // const fileName = asset.fileName || `photo-${Date.now()}.jpg`;

    // STEP 1: Upload metadata to backend (MongoDB)
    // await addPhoto(projectId, {
    //   fileName,
    //   url: asset.uri, // TEMP: local URI (replace with S3/Firebase uploaded URL)
    //   caption: "Site Photo",
    // });

    // Alert.alert("Uploaded!", "Photo sent to server.");
  };

  return { takePhoto };
}
