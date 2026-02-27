import { COLORS } from "@/constants/colors";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { Redirect, router, Tabs } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DashboardLayout() {
  const user = useAuthStore((s) => s.user);
  const [unreadCount, setUnreadCount] = useState(0);

  /* ---------------------------------------------------------- */
  /*              Listen to unread count (Realtime)             */
  /* ---------------------------------------------------------- */

  useEffect(() => {
    if (!user?.uid) return;

    const conversationRef = doc(db, "conversations", user.uid);

    const unsub = onSnapshot(conversationRef, async (snapshot) => {
      const count = snapshot.data()?.unreadCount?.contractor ?? 0;

      setUnreadCount(count);

      // 🔥 Sync app icon badge (iOS + Android)
      await Notifications.setBadgeCountAsync(count);
    });

    return unsub;
  }, [user?.uid]);

  // Redirect AFTER hooks
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 70,
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="project"
        options={{
          title: "Projects",
          tabBarIcon: ({ color }) => (
            <Ionicons name="folder" size={22} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            router.replace("/(dashboard)/project");
          },
        }}
      />

      <Tabs.Screen
        name="messagesScreen"
        options={{
          title: "Message",
          tabBarIcon: ({ color }) => (
            <View>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={22}
                color={color}
              />

              {unreadCount > 0 && (
                <TabsBadge count={unreadCount} />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="photos"
        options={{
          title: "Photos",
          tabBarIcon: ({ color }) => (
            <Ionicons name="camera" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle" size={24} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            router.replace("/(dashboard)/profile");
          },
        }}
      />

      {/* Hidden index route */}
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}

/* ---------------------------------------------------------- */
/*                     Badge Component                        */
/* ---------------------------------------------------------- */

function TabsBadge({ count }: { count: number }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {count > 99 ? "99+" : count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -8,
    top: -4,
    backgroundColor: "#EF4444",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
});
