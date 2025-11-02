// components/main/Daily-wellness/DailyWellness.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from "react-native";

const TILE_BG = "#49B98A";
const TEXT_DARK = "#0B0F0A";

export type DailyWellnessProps = {
  streakDays: number;
  chillScore: number;
  onStatsPress: () => void;

  /** РУЧКИ ДЛЯ ВИРІВНЮВАННЯ (у px, додатне значення зсуває вниз) */
  streakUnitOffsetY?: number;      // зсув для "days"
  scoreUnitOffsetY?: number;       // зсув для "score"
  streakNumberOffsetY?: number;    // зсув для великої цифри зліва
  scoreNumberOffsetY?: number;     // зсув для великої цифри справа
};

const DailyWellness: React.FC<DailyWellnessProps> = ({
  streakDays,
  chillScore,
  onStatsPress,
  streakUnitOffsetY = -7,
  scoreUnitOffsetY = -1,
  streakNumberOffsetY = 0,
  scoreNumberOffsetY = 6,
}) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 380;

  const S = {
    tileHeight: isSmall ? 152 : 160,
    titleSize: isSmall ? 16 : 18,
    numberSize: isSmall ? 56 : 64,
    unitSize: isSmall ? 18 : 20,
  };

  // Базова iOS-корекція (можеш міняти глобально тут)
  const IOS_BASELINE_TWEAK = -2;

  return (
    <>
      <Text style={styles.sectionTitle}>Daily Wellness</Text>

      <View style={styles.row}>
        {/* Left tile: Streak */}
        <View style={[styles.tile, { height: S.tileHeight }]}>
          <Text style={[styles.tileTitle, { fontSize: S.titleSize }]} numberOfLines={2}>
            Your current streak
          </Text>

          <View style={[styles.centerRow, { marginTop: -20 }]}>
            <Text
              style={[
                styles.number,
                {
                  fontSize: S.numberSize,
                  lineHeight: S.numberSize,
                  transform: [{ translateY: streakNumberOffsetY }],
                },
              ]}
            >
              {streakDays}
            </Text>

            <Text
              style={[
                styles.unit,
                {
                  fontSize: S.unitSize,
                  lineHeight: S.unitSize,
                  transform: [
                    {
                      translateY:
                        (Platform.OS === "ios" ? IOS_BASELINE_TWEAK : 0) + streakUnitOffsetY,
                    },
                  ],
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              days
            </Text>
          </View>

          <View style={{ height: 6 }} />
        </View>

        {/* Right tile: Overall rating */}
        <View style={[styles.tile, { height: S.tileHeight }]}>
          <Text style={[styles.tileTitle, { fontSize: S.titleSize }]} numberOfLines={2}>
            Overall rating
          </Text>

          <View style={styles.centerRow}>
            <Text
              style={[
                styles.number,
                {
                  fontSize: S.numberSize,
                  lineHeight: S.numberSize,
                  transform: [{ translateY: scoreNumberOffsetY }],
                },
              ]}
            >
              {chillScore}
            </Text>

            <Text
              style={[
                styles.unit,
                {
                  fontSize: S.unitSize,
                  lineHeight: S.unitSize,
                  transform: [
                    {
                      translateY:
                        (Platform.OS === "ios" ? IOS_BASELINE_TWEAK : 0) + scoreUnitOffsetY,
                    },
                  ],
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              score
            </Text>
          </View>

          <TouchableOpacity onPress={onStatsPress} activeOpacity={0.85} style={styles.linkContainer}>
            <Text style={styles.linkText} numberOfLines={1} adjustsFontSizeToFit>
              <Text style={styles.linkUnderline}>See more statistics</Text> ›
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: TILE_BG,
    borderRadius: 24,
    paddingLeft: 18,
    paddingTop: 16,
    paddingBottom: 12,
    paddingRight: 18,
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 6 },
    }),
  },
  tileTitle: {
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 6,
    flexShrink: 1,
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "flex-end", // базове вирівнювання по нижньому краю
    columnGap: 10,
  },
  number: {
    fontWeight: "800",
    color: TEXT_DARK,
    letterSpacing: -0.5,
    includeFontPadding: false, // Android: прибирає зайві поля шрифту
  },
  unit: {
    fontWeight: "700",
    color: TEXT_DARK,
    flexShrink: 1,
    includeFontPadding: false, // Android: прибирає зайві поля шрифту
  },
  linkContainer: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    paddingRight: 4,
  },
  linkText: {
    fontSize: 16,
    color: TEXT_DARK,
  },
  linkUnderline: {
    textDecorationLine: "underline",
  },
});

export default DailyWellness;
