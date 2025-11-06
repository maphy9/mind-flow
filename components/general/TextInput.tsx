import { StyleSheet, TextInput as _TextInput } from "react-native";
import React from "react";
import { useTheme } from "@/context/themeContext";
import { hexToRgba } from "@/utils/colors";

const TextInput = ({ style = {}, ...props }) => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    textInput: {
      fontFamily: "Lato",
    },
  });
  const placeholderTextColor = hexToRgba(
    (style as any).color ?? theme.secondary,
    0.5
  );

  return (
    <_TextInput
      style={[styles.textInput, style]}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
};

export default TextInput;
