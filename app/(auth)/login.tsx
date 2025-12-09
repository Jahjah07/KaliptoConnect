// app/(auth)/login.tsx
import Button from "@/components/ui/Button";
import { COLORS } from "@/constants/colors";
import { loginWithEmail } from "@/services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

const LOGO = require("@/assets/images/favicon.ico.png");

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 600;

  const containerStyle: ViewStyle = {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  };

  const onSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      router.replace("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to sign in";
      Alert.alert("Login Failed", message);
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
            alignItems: "center",
            marginBottom: 32,
            gap: 6,
          },
        ]}
      >
        <Image
          source={LOGO}
          style={{
            width: 90,
            height: 90,
            borderRadius: 20,
            marginBottom: 6,
          }}
        />

        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: COLORS.primary,
            letterSpacing: -0.5,
          }}
        >
          KaliptoConnect
        </Text>

        <Text style={{ color: "#6B7280", fontSize: 14 }}>
          Contractor Tracking Made Simple
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
        {/* Email Field */}
        <View style={{ position: "relative", marginBottom: 18 }}>
          <Text style={{ marginBottom: 6, color: "#374151", fontWeight: "500" }}>
            Email Address
          </Text>

          <TextInput
            placeholder="example@email.com"
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

        {/* Password Field */}
        <View style={{ position: "relative", marginBottom: 20 }}>
          <Text style={{ marginBottom: 6, color: "#374151", fontWeight: "500" }}>
            Password
          </Text>

          <TextInput
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={{
              borderWidth: 1.2,
              borderColor: "#E5E7EB",
              height: 50,
              borderRadius: 12,
              paddingHorizontal: 46,
              paddingRight: 44,
              backgroundColor: "#F9FAFB",
            }}
          />

          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#6B7280"
            style={{
              position: "absolute",
              left: 14,
              top: 38,
            }}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 14,
              top: 34,
              padding: 6,
            }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={() => router.push("/forgot-password")}
          style={{ alignSelf: "flex-end", marginBottom: 12 }}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* CTA */}
        <Button
          title={loading ? "Signing in..." : "Sign In"}
          onPress={onSignIn}
          disabled={loading}
        />

        {/* Link to Register */}
        <TouchableOpacity
          onPress={() => router.push("/register")}
          style={{ marginTop: 20 }}
        >
          <Text
            style={{
              textAlign: "center",
              color: COLORS.primary,
              fontWeight: "500",
            }}
          >
            Don't have an account? Create one
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
