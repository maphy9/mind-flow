import { View } from "react-native";
import React from "react";
import { useTheme } from "../hooks/useTheme";
import { StyleSheet } from "react-native";
import { Slot } from "expo-router";

const _layout = () => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
};

export default _layout;
