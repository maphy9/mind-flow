import { View, StyleSheet } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { AuthProvider } from "@/context/authContext";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Snackbar from "@/components/general/Snackbar";

const _layout = () => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    layout: {
      flex: 1,
      backgroundColor: theme.primary,
    },
  });

  return (
    <Provider store={store}>
      <AuthProvider>
        <View style={styles.layout}>
          <Slot />

          <Snackbar />
        </View>
      </AuthProvider>
    </Provider>
  );
};

export default _layout;
