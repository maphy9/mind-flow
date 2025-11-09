import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { useTheme } from "@/context/themeContext";
import Text from "@/components/general/Text";
import { useAuth } from "@/context/authContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const InfoRow = ({ label, value, theme }) => {
  const styles = getStyles(theme);
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const AccountScreen = () => {
  const { theme } = useTheme();
  const { currentUser, signOut } = useAuth();
  const styles = getStyles(theme);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View
          style={[
            styles.infoRow,
            { borderBottomWidth: 1, borderBottomColor: theme.surfaceAccent },
          ]}
        >
          <Text style={styles.infoLabel}>Display Name</Text>
          <Text style={styles.infoValue}>
            {currentUser?.displayName || "Not set"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>
            {currentUser?.email || "Not set"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.signOutButton}
        activeOpacity={0.7}
        onPress={async () => {
          router.push("/(auth)/login");
          await signOut();
        }}
      >
        <Ionicons name="log-out-outline" size={22} color="#E53E3E" />
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
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
      marginBottom: 24,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 18,
      paddingHorizontal: 16,
    },
    infoLabel: {
      color: theme.secondaryAccent,
      fontSize: 16,
    },
    infoValue: {
      color: theme.secondary,
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
      textAlign: "right",
      marginLeft: 12,
    },
    signOutButton: {
      backgroundColor: theme.primaryAccent,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    signOutButtonText: {
      color: "#E53E3E",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 12,
    },
  });

export default AccountScreen;
