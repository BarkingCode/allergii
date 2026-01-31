import { Stack } from "expo-router";
import { MainPagesOptions } from "@/lib/screenOptions";

export default function ChatLayout() {
  return (
    <MainPagesOptions>
      <Stack.Screen
        name="index"
        options={{
          title: "Allergy Advisor",
          headerShown: true,
        }}
      />
    </MainPagesOptions>
  );
}
