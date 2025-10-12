import { View, StyleSheet } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { AuthProvider } from "@/context/authContext";

const _layout = () => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    layout: {
      flex: 1,
      backgroundColor: theme.primary,
    },
  });

  return (
    <AuthProvider>
      <View style={styles.layout}>
        <Slot />
      </View>
    </AuthProvider>
  );
};

export default _layout;
