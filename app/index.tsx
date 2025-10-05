import { StyleSheet, Text } from "react-native";
import React from "react";
import { useTheme } from "../hooks/useTheme";

const Home = () => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    text: {
      color: theme.secondary,
    },
  });

  return <Text style={styles.text}>Home</Text>;
};

export default Home;
