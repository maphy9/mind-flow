import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/context/themeContext";
import DailyWellness from "@/components/main/home/DailyWellness";
import ExploreCards from "@/components/main/home/ExploreCards";

const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.primaryAccent }}
      contentContainerStyle={styles.scroll}
    >
      <DailyWellness />

      <ExploreCards />
    </ScrollView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    scroll: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
    },
  });

export default HomeScreen;
