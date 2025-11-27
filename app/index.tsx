import React from "react";
import { View, Text, Pressable } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { COLORS } from "@/constants/colors";
import { useAuthStore } from "@/store/auth.store";

export default function Index() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // Auto redirect if logged in
  if (user) {
    return <Redirect href="/home" />;   // ✔ Correct
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "700" }}>
        KaliptoConnect
      </Text>

      <Pressable onPress={() => router.push("/login")} style={{ marginTop: 20 }}>
        <Text style={{ color: "#fff", textDecorationLine: "underline" }}>
          Go to Login
        </Text>
      </Pressable>
    </View>
  );
}
