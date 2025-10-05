import { StyleSheet, Text as _Text } from "react-native";
import React from "react";

const Text = ({ children, style = {} }) => {
  const styles = StyleSheet.create({
    text: {
      fontFamily: "Lato",
    },
  });

  return <_Text style={[styles.text, style]}>{children}</_Text>;
};

export default Text;
