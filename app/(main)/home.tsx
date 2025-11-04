import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import DailyWellness from "@/components/main/home/DailyWellness";
import TestPromptModal from "@/components/main/TestPromptModal";
import ExploreCards from "@/components/main/home/ExploreCards";

const HomeScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = getStyles(theme);

  const [modalVisible, setModalVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setModalVisible(true);
    }, 60000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleStartTest = () => {
    setModalVisible(false);
    resetTimer();
    router.push("/(main)/test");
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    resetTimer();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.primaryAccent }}
      contentContainerStyle={styles.scroll}
    >
      <TestPromptModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onStart={handleStartTest}
      />

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
