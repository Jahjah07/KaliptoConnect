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
    return <Redirect href="/home" />;
  }

  return (
    <Redirect href="/login" />
  );
}
