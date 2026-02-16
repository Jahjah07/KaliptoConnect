import { Stack } from "expo-router";

export default function ProjectLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}