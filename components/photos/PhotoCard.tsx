// src/components/photos/PhotoCard.tsx
import { Image, View, Text } from "react-native";

export default function PhotoCard({ uri }: { uri: string }) {
  return (
    <View
      style={{
        width: "48%",
        height: 160,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 16,
        backgroundColor: "#eee",
      }}
    >
      <Image
        source={{ uri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>
  );
}
