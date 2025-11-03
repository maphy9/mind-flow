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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import DailyWellness from "@/components/main/Daily-wellness/DailyWellness";
import TestPromptModal from "@/components/main/TestPromptModal";

const getLocalImage = (name: string) => {
  const table: Record<string, any> = {
    map: require("@/assets/images/map.png"),
    mindbot: require("@/assets/images/mindbot.png"),
  };
  return table[name] ?? table["map"];
};

const HomeScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ newChillScore?: string }>();
  const theme = useTheme();
  const styles = getStyles(theme);

  const [streakDays, setStreakDays] = useState(7);
  const [chillScore, setChillScore] = useState(82);
  const [modalVisible, setModalVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (params.newChillScore) {
      const score = Math.round(parseFloat(params.newChillScore));
      if (!isNaN(score)) {
        setChillScore(score);
      }
    }
  }, [params.newChillScore]);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setModalVisible(true);
    }, 60000); // 1 minute
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

      {/* Header */}
      <Text style={[styles.header, { color: theme.secondary }]}>Home Screen</Text>

      {/* Daily Wellness (підключений компонент) */}
      <DailyWellness
        streakDays={streakDays}
        chillScore={chillScore}
        onStatsPress={() => router.push("/(main)/settings")}
      />

      {/* Explore */}
      <Text style={[styles.sectionTitle, { color: theme.secondary, marginTop: 14 }]}>
        Explore
      </Text>

      <ExploreCard
        title="Relaxation spots map"
        subtitle="Discover calming spots in the city"
        imageName="map"
        onPress={() => router.push("/(main)/calm-spots")}
      />

      <ExploreCard
        title="Chat with MindBot"
        subtitle="Get personalized support and guidance"
        imageName="mindbot"
        onPress={() => router.push("/(main)/mind-bot")}
      />

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

type ExploreCardProps = {
  title: string;
  subtitle: string;
  imageName: string;
  onPress: () => void;
};

const ExploreCard: React.FC<ExploreCardProps> = ({ title, subtitle, imageName, onPress }) => {
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
          source={getLocalImage(imageName)}
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

const getStyles = (theme) => StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    alignSelf: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
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
