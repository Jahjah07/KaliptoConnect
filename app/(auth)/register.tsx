// app/(auth)/register.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/ui/Button";
import { registerWithEmail } from "@/services/auth.service";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const [showPassword, setShowPassword] = useState(false);
  const isLargeScreen = width >= 600;

  // 🔥 FIX: give the style a proper type
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
      console.log("calling auth.service")
      const res = await registerWithEmail(email, password, name);
      console.log("Result: ", res)
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
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[containerStyle, { marginBottom: 20 }]}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "700",
            color: COLORS.primary,
            marginBottom: 4,
          }}
        >
          Create Account
        </Text>
        <Text style={{ color: "#6B7280" }}>
          Enter your details below to continue
        </Text>
      </View>

      {/* Card */}
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
        <TextInput
          placeholder="Full Name"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
          style={{
            borderWidth: 1,
            borderColor: "#E5E7EB",
            height: 48,
            borderRadius: 10,
            paddingHorizontal: 12,
            marginBottom: 12,
          }}
        />

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
            paddingHorizontal: 12,
            marginBottom: 12,
          }}
        />

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
              paddingHorizontal: 12,
              paddingRight: 40,
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
          title={loading ? "Creating account..." : "Create Account"}
          onPress={onRegister}
          disabled={loading}
        />

        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={{ marginTop: 12 }}
        >
          <Text
            style={{
              textAlign: "center",
              marginTop: 8,
              color: COLORS.primary,
            }}
          >
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
