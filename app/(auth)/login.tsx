// app/(auth)/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/ui/Button";
import { loginWithEmail } from "@/services/auth.service";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

const LOGO = require("@/assets/images/favicon.ico.png");

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const [showPassword, setShowPassword] = useState(false);

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
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[containerStyle, { alignItems: "center", marginBottom: 24 }]}>
        <Image
          source={LOGO}
          style={{ width: 90, height: 90, borderRadius: 16, marginBottom: 12 }}
        />
        <Text
          style={{
            fontSize: 26,
            fontWeight: "700",
            color: COLORS.primary,
            marginBottom: 4,
          }}
        >
          KaliptoConnect
        </Text>
        <Text style={{ color: "#6B7280" }}>
          Contractor Tracking Made Simple
        </Text>
      </View>

      <View
        style={[
          containerStyle,
          {
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 16,
            shadowOpacity: 0.08,
          },
        ]}
      >
        <View style={{ position: "relative", marginBottom: 12 }}>
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              height: 48,
              borderRadius: 10,
              paddingHorizontal: 40, // space for icon
            }}
          />

          <Ionicons
            name="mail"
            size={20}
            color="#6B7280"
            style={{
              position: "absolute",
              left: 12,
              top: 14,
            }}
          />
        </View>

        <View
          style={{
            position: "relative",
            marginBottom: 16,
          }}
        >
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              height: 48,
              borderRadius: 10,
              paddingHorizontal: 40,
              paddingRight: 40,
            }}
          />

          {/* Lock Icon */}
          <Ionicons
            name="lock-closed"
            size={20}
            color="#6B7280"
            style={{
              position: "absolute",
              left: 12,
              top: 14,
            }}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>


        <Button
          title={loading ? "Signing in..." : "Sign In"}
          onPress={onSignIn}
          disabled={loading}
        />

        <TouchableOpacity
          onPress={() => router.push("/register")}
          style={{ marginTop: 12 }}
        >
          <Text
            style={{
              textAlign: "center",
              marginTop: 8,
              color: COLORS.primary,
            }}
          >
            Don’t have an account? Create one
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
