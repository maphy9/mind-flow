import { StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

export const useStyles = () => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    text: {
      color: theme.secondary,
    },
  });

  return styles;
};
