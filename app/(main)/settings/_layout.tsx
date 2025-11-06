import { Stack } from "expo-router";
import { useTheme } from "@/context/themeContext";

export default function SettingsLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.surfaceAccent,
        },
        headerTintColor: theme.secondary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: "Account",
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: "About This App",
        }}
      />
    </Stack>
  );
}
