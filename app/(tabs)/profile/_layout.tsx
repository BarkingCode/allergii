import { global } from "@/constants/Theme";
import { MainPagesOptions } from "@/lib/screenOptions";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <MainPagesOptions>
      <Stack.Screen name="index" options={{ title: "Profile" }} />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          title: "Terms of Service",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "Privacy Policy",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="delete-account"
        options={{
          title: "Delete Account",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="(auth)/signin"
        options={{
          title: "Sign In",
          headerLargeTitle: true,
          headerShown: true,
        }}
      />
    </MainPagesOptions>
  );
}
