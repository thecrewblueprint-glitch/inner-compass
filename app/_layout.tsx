import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { theme } from "@/src/design/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.colors.background }
        }}
      >
        <Stack.Screen name="index" options={{ title: "Inner Compass" }} />
        <Stack.Screen name="clarify" options={{ title: "Clarify" }} />
        <Stack.Screen name="guidance" options={{ title: "Perspective" }} />
        <Stack.Screen name="support" options={{ title: "Support" }} />
      </Stack>
    </>
  );
}
