import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth.store";
import { Redirect } from "expo-router";
import { COLORS } from "@/constants/colors";

export default function DashboardLayout() {
  const user = useAuthStore((s) => s.user);

  // Protect dashboard
  if (!user) return <Redirect href="/(auth)/login" />;

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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color }) => (
            <Ionicons name="folder" size={22} color={color} />
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
        name="receipts"
        options={{
          title: "Receipts",
          tabBarIcon: ({ color }) => (
            <Ionicons name="image" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="project/[id]/index" options={{ href: null }}/>
      <Tabs.Screen name="profile/edit" options={{ href: null }}/>
      <Tabs.Screen name="profile/documents" options={{ href: null }}/>
    </Tabs>
  );
}
