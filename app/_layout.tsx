import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

const _layout = () => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    layout: {
      flex: 1,
      backgroundColor: theme.primary,
    },
  });

  return (
    <View style={styles.layout}>
      <Slot />
    </View>
  );
};

export default _layout;
