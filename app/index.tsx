import { auth } from "@/lib/firebase";
import { createSession } from "@/services/session.service";
import { Redirect } from "expo-router";
import type { User } from "firebase/auth";
import React, { useEffect, useState } from "react";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);

      if (u) {
        try {
          // 🔥 Ensure backend session cookie exists
          await createSession();
        } catch (err) {
          console.warn("Session restore failed:", err);
        }
      }

      setReady(true);
    });

    return () => unsub();
  }, []);

  if (!ready) return null;

  return <Redirect href={user ? "/home" : "/login"} />;
}