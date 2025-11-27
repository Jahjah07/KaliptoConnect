import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth.store";

export default function RootLayout() {
  const setUser = useAuthStore((s) => s.setUser);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoaded(true);
    });

    return unsub;
  }, []);

  if (!authLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>

    </Stack>
  );
}
