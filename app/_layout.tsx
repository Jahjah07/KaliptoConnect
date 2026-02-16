// 1️⃣ React
import React, { useEffect, useState } from "react";

// 2️⃣ Expo / React Native
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

// 3️⃣ Firebase
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// 4️⃣ Absolute local imports
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth.store";

/* ------------------------------------------------------------------ */
/*                   GLOBAL NOTIFICATION HANDLER                      */
/* ------------------------------------------------------------------ */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const setUser = useAuthStore((s) => s.setUser);
  const [authLoaded, setAuthLoaded] = useState(false);
  const router = useRouter();

  /* ------------------------------------------------------------------ */
  /*                   ANDROID NOTIFICATION CHANNEL                     */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#1E6F5C",
        sound: "default",
      });
    }
  }, []);

  /* ------------------------------------------------------------------ */
  /*                        AUTH LISTENER                               */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoaded(true);

      if (u) {
        await registerForPushNotifications(u.uid);
      }
    });

    return unsub;
  }, []);

  /* ------------------------------------------------------------------ */
  /*                  HANDLE NOTIFICATION TAP                           */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        () => {
          router.push("/messagesScreen");
        }
      );

    return () => subscription.remove();
  }, []);

  /* ------------------------------------------------------------------ */
  /*                 REGISTER & STORE PUSH TOKEN                        */
  /* ------------------------------------------------------------------ */

  async function registerForPushNotifications(uid: string) {
    if (!Device.isDevice) return;

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } =
        await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") return;

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })
    ).data;

    await setDoc(
      doc(db, "users", uid),
      { expoPushToken: token },
      { merge: true }
    );
  }

  if (!authLoaded) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  );
}
