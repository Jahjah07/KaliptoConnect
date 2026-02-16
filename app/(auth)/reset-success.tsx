import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function ResetSuccess() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 600;

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        padding: isLargeScreen ? 40 : 24,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Success Icon */}
      <View
        style={{
          backgroundColor: COLORS.primary + "22",
          width: 110,
          height: 110,
          borderRadius: 999,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <Ionicons name="checkmark-circle" size={90} color={COLORS.primary} />
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 26,
          fontWeight: "800",
          color: COLORS.primary,
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Email Sent!
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          color: "#6B7280",
          fontSize: 15,
          textAlign: "center",
          width: "80%",
          marginBottom: 28,
        }}
      >
        We&apos;ve sent password reset instructions to your email. Follow the link to
        create a new password.
      </Text>

      {/* Back to Login */}
      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={{
          backgroundColor: COLORS.primary,
          paddingVertical: 14,
          paddingHorizontal: 26,
          borderRadius: 12,
          width: "70%",
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Back to Login
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
