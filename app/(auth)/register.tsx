// app/(auth)/register.tsx
import Button from "@/components/ui/Button";
import { COLORS } from "@/constants/colors";
import { registerWithEmail } from "@/services/auth.service";
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

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 600;

  const containerStyle: ViewStyle = {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  };

  const onRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerWithEmail(email, password, name);
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Registration Failed", err.message || "Unable to register");
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
          Create Account
        </Text>
        <Text style={{ color: "#6B7280", fontSize: 14 }}>
          Enter your details below to continue
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
        {/* Full Name */}
        <View style={{ position: "relative", marginBottom: 18 }}>
          <Text style={{ marginBottom: 6, color: "#374151", fontWeight: "500" }}>
            Full Name
          </Text>

          <TextInput
            placeholder="John Doe"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
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
            name="person-outline"
            size={20}
            color="#6B7280"
            style={{ position: "absolute", left: 14, top: 38 }}
          />
        </View>

        {/* Email */}
        <View style={{ position: "relative", marginBottom: 18 }}>
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

        {/* Password */}
        <View style={{ position: "relative", marginBottom: 24 }}>
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

        {/* CTA */}
        <Button
          title={loading ? "Creating account..." : "Create Account"}
          onPress={onRegister}
          disabled={loading}
        />

        {/* Redirect */}
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
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
