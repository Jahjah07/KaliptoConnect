import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, View } from "react-native";

export default function ReceiptPreviewScreen() {
  const { image } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Pressable
        onPress={() => router.back()}
        style={{ position: "absolute", top: 50, left: 20, zIndex: 10 }}
      >
        <Ionicons name="close" size={30} color="#fff" />
      </Pressable>

      <Image
        source={{ uri: image as string }}
        style={{ flex: 1 }}
        resizeMode="contain"
      />
    </View>
  );
}
