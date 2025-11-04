import { View } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { AuthProvider } from "@/context/authContext";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Snackbar from "@/components/general/Snackbar";

const _layout = () => {
  const theme = useTheme();

  return (
    <Provider store={store}>
      <AuthProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.primary,
          }}
        >
          <Slot />

          <Snackbar />
        </View>
      </AuthProvider>
    </Provider>
  );
};

export default _layout;
