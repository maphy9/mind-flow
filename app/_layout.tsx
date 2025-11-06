import { useColorScheme, View } from "react-native";
import React, { useEffect } from "react";
import { router, Slot, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/context/authContext";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Snackbar from "@/components/general/Snackbar";
import { ThemeProvider, useTheme } from "@/context/themeContext";

const _layout = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <ThemedLayout />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

const ThemedLayout = () => {
  const { theme, loadThemePreference } = useTheme();
  const systemColorScheme = useColorScheme();
  const { currentUser } = useAuth();

  useEffect(() => {
    loadThemePreference();
  }, [systemColorScheme]);

  useEffect(() => {
    if (currentUser === null) {
      router.push("/(auth)/login");
    }
  }, [currentUser]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.primary,
      }}
    >
      <Slot />
      <Snackbar />
    </View>
  );
};
export default _layout;
