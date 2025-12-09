import Button from "@/components/ui/Button";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
    ViewStyle,
} from "react-native";

// TODO: update with your actual reset function
import { sendPasswordReset } from "@/services/auth.service";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 600;

  const containerStyle: ViewStyle = {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  };

  const onSubmit = async () => {
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordReset(email);
      Alert.alert(
        "Check your email",
        "We've sent you instructions to reset your password."
      );
      router.push("/login");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Unable to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        padding: isLargeScreen ? 40 : 24,
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View
        style={[
          containerStyle,
          {
            marginBottom: 28,
            gap: 6,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: COLORS.primary,
            letterSpacing: -0.5,
          }}
        >
          Forgot Password
        </Text>
        <Text style={{ color: "#6B7280", fontSize: 14 }}>
          Enter your email to receive password reset instructions.
        </Text>
      </View>

      {/* Card */}
      <View
        style={[
          containerStyle,
          {
            backgroundColor: "#fff",
            padding: 22,
            borderRadius: 20,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 12,
            elevation: 3,
          },
        ]}
      >
        {/* Email Input */}
        <View style={{ position: "relative", marginBottom: 24 }}>
          <Text style={{ marginBottom: 6, color: "#374151", fontWeight: "500" }}>
            Email Address
          </Text>

          <TextInput
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1.2,
              borderColor: "#E5E7EB",
              height: 50,
              borderRadius: 12,
              paddingHorizontal: 46,
              backgroundColor: "#F9FAFB",
            }}
          />

          <Ionicons
            name="mail-outline"
            size={20}
            color="#6B7280"
            style={{
              position: "absolute",
              left: 14,
              top: 38,
            }}
          />
        </View>

        {/* CTA */}
        <Button
          title={loading ? "Sending..." : "Send Reset Link"}
          onPress={onSubmit}
          disabled={loading}
        />

        {/* Back to login */}
        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={{ marginTop: 20 }}
        >
          <Text
            style={{
              textAlign: "center",
              color: COLORS.primary,
              fontWeight: "500",
            }}
          >
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
