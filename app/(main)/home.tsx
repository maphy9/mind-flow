import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import DailyWellness from "@/components/main/Daily-wellness/DailyWellness";
import TestPromptModal from "@/components/main/TestPromptModal";
import mapImage from "@/assets/images/map.png";
import mindbotImage from "@/assets/images/mindbot.png";

const HomeScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = getStyles(theme);

  const [modalVisible, setModalVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setModalVisible(true);
    }, 60000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
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

      <View style={{ paddingVertical: 24 }}>
        <Text style={styles.sectionTitle}>Explore</Text>

        <ExploreCard
          title="Relaxation spots map"
          subtitle="Discover calming spots in the city"
          image={mapImage}
          onPress={() => router.push("/(main)/calm-spots")}
        />

        <ExploreCard
          title="Chat with MindBot"
          subtitle="Get personalized support and guidance"
          image={mindbotImage}
          onPress={() => router.push("/(main)/mind-bot")}
        />
      </View>
    </ScrollView>
  );
};

const ExploreCard = ({ title, subtitle, image, onPress }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const PREVIEW_SIZE = 100;

  return (
    <View style={styles.cardShadow}>
      <View style={styles.exploreCard}>
        <View style={styles.exploreTextCol}>
          <Text style={styles.exploreTitle}>{title}</Text>
          <Text style={styles.exploreSubtitle}>{subtitle}</Text>

          <Pressable
            android_ripple={{ color: "rgba(0,0,0,0.08)", borderless: false }}
            style={({ pressed }) => [
              styles.viewBtn,
              pressed && { opacity: 0.9 },
            ]}
            onPress={onPress}
          >
            <Text style={styles.viewBtnText}>View</Text>
          </Pressable>
        </View>

        <Image
          source={image}
          resizeMode="cover"
          style={[
            styles.thumbImg,
            { width: PREVIEW_SIZE, height: PREVIEW_SIZE, borderRadius: 16 },
          ]}
          accessible
          accessibilityRole="image"
        />
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    scroll: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "800",
      marginBottom: 10,
      color: theme.secondary,
    },
    cardShadow: {
      marginTop: 12,
      borderRadius: 20,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
        },
        android: {
          elevation: 8,
        },
      }),
      backgroundColor: "transparent",
    },
    exploreCard: {
      width: "100%",
      borderRadius: 20,
      backgroundColor: theme.primary,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        },
        android: {
          elevation: 3,
        },
      }),
      borderWidth: 1,
      borderColor: theme.primaryAccent,
    },
    exploreTextCol: {
      flex: 1,
      paddingRight: 14,
    },
    exploreTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.secondary,
      marginBottom: 4,
    },
    exploreSubtitle: {
      fontSize: 13,
      color: theme.secondaryAccent,
      marginBottom: 12,
    },
    viewBtn: {
      alignSelf: "flex-start",
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor: theme.surface,
      borderRadius: 28,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
        },
        android: {
          elevation: 2,
        },
      }),
    },
    viewBtnText: {
      color: theme.secondary,
      fontWeight: "700",
      fontSize: 16,
    },
    thumbImg: {
      borderWidth: 0.8,
      borderColor: theme.primaryAccent,
      backgroundColor: theme.surfaceAccent,
    },
  });

export default HomeScreen;
