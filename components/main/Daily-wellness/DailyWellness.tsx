// components/main/Daily-wellness/DailyWellness.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from "react-native";

const TILE_BG = "#49B98A";
const TEXT_DARK = "#0B0F0A";

export type DailyWellnessProps = {
  streakDays: number;
  chillScore: number;
  onStatsPress: () => void;
};

const DailyWellness: React.FC<DailyWellnessProps> = ({ streakDays, chillScore, onStatsPress }) => {
  const { width } = useWindowDimensions();
  const isSmall = width < 380;

  const S = {
    tileHeight: isSmall ? 152 : 160,
    titleSize: isSmall ? 16 : 18,
    numberSize: isSmall ? 56 : 64,
    unitSize: isSmall ? 18 : 20,
  };

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
            <Text style={[styles.number, { fontSize: S.numberSize, lineHeight: S.numberSize }]}>{streakDays}</Text>
            <Text style={[styles.unit, { fontSize: S.unitSize }]} numberOfLines={1} adjustsFontSizeToFit>
              days
            </Text>
          </View>

          <View style={{ height: 6 }} />
        </View>

        {/* Right tile: Chill score */}
        <View style={[styles.tile, { height: S.tileHeight }]}>
          <Text style={[styles.tileTitle, { fontSize: S.titleSize }]} numberOfLines={2}>
            Current chill score
          </Text>

          {/* Правий рядок без зсуву */}
          <View style={styles.centerRow}>
            <Text style={[styles.number, { fontSize: S.numberSize, lineHeight: S.numberSize }]}>{chillScore}</Text>
            <Text style={[styles.unit, { fontSize: S.unitSize }]} numberOfLines={1} adjustsFontSizeToFit>
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
    paddingRight: 18, // більше простору справа, щоб текст не “вилазив”
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
    flexShrink: 1, // дозволяє стискати довгі заголовки
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "center", // рівне вертикальне вирівнювання цифри і слова
    columnGap: 10,
    // без marginTop тут — зсув задаємо точково лише для лівої плитки
  },
  number: {
    fontWeight: "800",
    color: TEXT_DARK,
    letterSpacing: -0.5,
  },
  unit: {
    fontWeight: "700",
    color: TEXT_DARK,
    flexShrink: 1, // не дає штовхати за межі
  },
  linkContainer: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    paddingRight: 4, // запас, щоб стрілка не торкалась краю
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
