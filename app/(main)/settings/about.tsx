import { View, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { useTheme } from "@/context/themeContext";
import Text from "@/components/general/Text";
import { Ionicons } from "@expo/vector-icons";

const AboutScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="sparkles-outline" size={24} color={theme.secondary} />
          <Text style={styles.title}>Welcome to MindFlow</Text>
        </View>
        <Text style={styles.paragraph}>
          MindFlow is your daily health assistant for modern city life.
        </Text>
        <Text style={styles.paragraph}>
          Our app is designed to support your mental and physical health as you
          navigate the stresses of urban living. We combine three core features
          to help you find balance:
        </Text>

        <View style={styles.feature}>
          <Ionicons
            name="leaf-outline"
            size={20}
            color={theme.secondaryAccent}
            style={styles.icon}
          />
          <Text style={styles.featureText}>
            <Text style={styles.bold}>Calm Spots:</Text> A map of local parks
            and quiet zones to help you disconnect and recharge.
          </Text>
        </View>
        <View style={styles.feature}>
          <Ionicons
            name="chatbubbles-outline"
            size={20}
            color={theme.secondaryAccent}
            style={styles.icon}
          />
          <Text style={styles.featureText}>
            <Text style={styles.bold}>Mind Bot:</Text> A chat companion offering
            psychological first aid exercises to reduce tension.
          </Text>
        </View>
        <View style={styles.feature}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color={theme.secondaryAccent}
            style={styles.icon}
          />
          <Text style={styles.featureText}>
            <Text style={styles.bold}>Reminders:</Text> A gentle system to
            remind you to take breaks, drink water, and stretch.
          </Text>
        </View>

        <Text style={styles.paragraph}>
          MindFlow does not replace professional medical advice or therapy, but
          it serves as a powerful tool to help you manage stress, combat a
          sedentary lifestyle, and improve your overall well-being.
        </Text>
        <Text style={styles.paragraph}>
          Our goal is to provide a simple, accessible tool that becomes a
          trusted part of your daily routine.
        </Text>
      </View>
    </ScrollView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary,
      padding: 20,
    },
    card: {
      backgroundColor: theme.primaryAccent,
      borderRadius: 16,
      padding: 24,
      marginBottom: 36,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    title: {
      color: theme.secondary,
      fontSize: 22,
      fontWeight: "600",
      textAlign: "center",
      marginLeft: 8,
    },
    paragraph: {
      color: theme.secondaryAccent,
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 16,
    },
    feature: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    icon: {
      marginRight: 12,
      marginTop: 4,
    },
    featureText: {
      color: theme.secondaryAccent,
      fontSize: 16,
      lineHeight: 24,
      flex: 1,
    },
    bold: {
      color: theme.secondary,
      fontWeight: "600",
    },
  });

export default AboutScreen;
