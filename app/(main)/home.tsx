// app/(main)/home.tsx
import React from "react";
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

/**
 * Локальні зображення за назвою:
 * Додаси нове — просто допиши пару "ім'я: require(...)" нижче.
 */
const getLocalImage = (name: string) => {
  const table: Record<string, any> = {
    map: require("@/assets/images/map.png"),
    mindbot: require("@/assets/images/mindbot.png"),
  };
  return table[name] ?? table["map"];
};

const HomeScreen = () => {
  const router = useRouter();
  const theme =
    useTheme?.() ?? {
      primary: "#2E7D32",
      primarySoft: "#DDF3E3",
      surface: "#FFFFFF",
      text: "#111827",
      textMuted: "#6B7280",
      card: "#FFFFFF",
      border: "#E5E7EB",
      shadow: "rgba(0,0,0,0.10)",
      accent: "#47B57A",
    };

  const streakDays = 7;
  const chillScore = 82;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.primarySoft }}
      contentContainerStyle={styles.scroll}
    >
      {/* Header */}
      <Text style={[styles.header, { color: theme.text }]}>Home Screen</Text>

      {/* ✅ Daily Wellness (підключений компонент) */}
      <DailyWellness
        streakDays={streakDays}
        chillScore={chillScore}
        onStatsPress={() => router.push("/(main)/settings")}
      />

      {/* Explore */}
      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 14 }]}>
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
  imageName: string; // ім'я в таблиці getLocalImage()
  onPress: () => void;
};

const ExploreCard: React.FC<ExploreCardProps> = ({
  title,
  subtitle,
  imageName,
  onPress,
}) => {
  // квадрат 1×1, трохи більший за попередній прев’ю
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

const styles = StyleSheet.create({
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

  /** ---- EXPLORE CARD ---- */
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
    backgroundColor: "#FFFFFF",
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
    borderColor: "#E5E7EB",
  },
  exploreTextCol: {
    flex: 1,
    paddingRight: 14,
  },
  exploreTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  exploreSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  viewBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#47B57A",
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
    color: "#0B0F0A",
    fontWeight: "700",
    fontSize: 16,
  },
  thumbImg: {
    // базові стилі для прев’ю; конкретний розмір задаємо в компоненті
    borderWidth: 0.8,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
});

export default HomeScreen;
