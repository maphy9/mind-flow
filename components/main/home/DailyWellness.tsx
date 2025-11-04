import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

const DailyWellness = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = getStyles(theme);

  const [streakDays] = useState(7);
  const [chillScore] = useState(82);

  return (
    <>
      <Text style={styles.sectionTitle}>Daily Wellness</Text>

      <View style={styles.row}>
        <View style={styles.tile}>
          <Text style={styles.tileTitle} numberOfLines={2}>
            Your current streak
          </Text>

          <View style={styles.centerRow}>
            <Text style={styles.number}>{streakDays}</Text>
            <Text style={styles.unit}>days</Text>
          </View>
        </View>

        <View style={styles.tile}>
          <Text style={styles.tileTitle} numberOfLines={2}>
            Overall rating
          </Text>

          <View style={styles.centerRow}>
            <Text style={styles.number}>{chillScore}</Text>
            <Text style={styles.unit}>score</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(main)/settings")}
            activeOpacity={0.85}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>
              <Text style={styles.linkUnderline}>See more statistics</Text> ›
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: 22,
      fontWeight: "800",
      marginBottom: 10,
      color: theme.secondary,
    },
    row: {
      flexDirection: "row",
      gap: 12,
    },
    tile: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 24,
      paddingHorizontal: 18,
      paddingVertical: 16,
      justifyContent: "space-between",
      minHeight: 160,
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
      fontSize: 18,
      fontWeight: "700",
      color: theme.secondary,
      marginBottom: 8,
    },
    centerRow: {
      flexDirection: "row",
      alignItems: "baseline",
      columnGap: 8,
      marginVertical: 8,
    },
    number: {
      fontSize: 64,
      lineHeight: 64,
      fontWeight: "800",
      color: theme.secondary,
      letterSpacing: -0.5,
    },
    unit: {
      fontSize: 20,
      lineHeight: 20,
      fontWeight: "700",
      color: theme.secondary,
    },
    linkContainer: {
      alignSelf: "flex-start",
      marginTop: 8,
    },
    linkText: {
      fontSize: 16,
      color: theme.secondary,
    },
    linkUnderline: {
      textDecorationLine: "underline",
    },
  });

export default DailyWellness;
