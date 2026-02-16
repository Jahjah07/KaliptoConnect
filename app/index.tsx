import { auth } from "@/lib/firebase";
import { restoreUserSession } from "@/services/session.service";
import { startTokenAutoRefresh } from "@/services/tokenRefresh.service";
import { Redirect } from "expo-router";
import type { User } from "firebase/auth";
import React, { useEffect, useState } from "react";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let unsub: any;

    async function init() {
      await restoreUserSession();

      unsub = auth.onAuthStateChanged((u) => {
        if (u) {
          startTokenAutoRefresh(); // 🔥 START ON APP LOAD
        }
        setUser(u);
        setReady(true);
      });
    }

    init();
    return () => unsub?.();
  }, []);

  if (!ready) return null;

  return <Redirect href={user ? "/home" : "/login"} />;
}
