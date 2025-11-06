import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "@/constants/colors";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState(COLORS[systemColorScheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("@theme_preference");
      if (savedTheme !== null) {
        setThemeState(COLORS[savedTheme]);
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    }
  };

  const setTheme = async (themeType) => {
    try {
      setThemeState(COLORS[themeType]);
      await AsyncStorage.setItem("@theme_preference", themeType);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const value = {
    theme,
    setTheme,
    loadThemePreference,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
