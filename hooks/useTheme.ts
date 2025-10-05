import { useColorScheme } from "react-native";
import { Colors } from "../constants/colors";

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  return theme;
};
