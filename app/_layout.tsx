import { useColorScheme, View } from "react-native";
import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "@/context/authContext";
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

  useEffect(() => {
    loadThemePreference();
  }, [systemColorScheme]);

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
