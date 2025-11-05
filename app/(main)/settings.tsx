import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/general/Text";
import { useAuth } from "@/context/authContext";
import emptyPfp from "@/assets/images/empty-pfp.png";

const Settings = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [userPfp, setUserPfp] = useState(emptyPfp);

  useEffect(() => {
    if (currentUser.photoURL) {
      setUserPfp(currentUser.photoURL);
    }
  }, [currentUser]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    sectionTitle: {
      color: theme.secondary,
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
    },
    accountCard: {
      backgroundColor: theme.primaryAccent,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 32,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    accountInfo: {
      flex: 1,
    },
    accountName: {
      color: theme.secondary,
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 4,
    },
    accountSubtext: {
      color: theme.secondaryAccent,
      fontSize: 14,
    },
    preferencesContainer: {
      marginBottom: 32,
    },
    preferenceItem: {
      backgroundColor: theme.primaryAccent,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    preferenceIcon: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    preferenceText: {
      color: theme.secondary,
      fontSize: 16,
      flex: 1,
    },
    toggle: {
      width: 51,
      height: 31,
      borderRadius: 16,
      backgroundColor: theme.surfaceAccent,
      justifyContent: "center",
      padding: 2,
    },
    toggleActive: {
      backgroundColor: theme.surface,
    },
    toggleCircle: {
      width: 27,
      height: 27,
      borderRadius: 14,
      backgroundColor: theme.secondary,
    },
    toggleCircleActive: {
      alignSelf: "flex-end",
    },
    languageValue: {
      color: theme.secondaryAccent,
      fontSize: 16,
      marginRight: 8,
    },
    appSettingsContainer: {
      marginBottom: 32,
    },
  });

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Account</Text>

      <TouchableOpacity
        style={styles.accountCard}
        activeOpacity={0.7}
        onPress={() => {}}
      >
        <Image
          source={typeof userPfp === "string" ? { uri: userPfp } : userPfp}
          style={styles.avatar}
        />
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>Yang Sung-Jae</Text>
          <Text style={styles.accountSubtext}>
            View and edit your personal information
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={theme.secondaryAccent}
        />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Preferences</Text>

      <View style={styles.preferencesContainer}>
        <TouchableOpacity
          style={styles.preferenceItem}
          activeOpacity={0.7}
          onPress={() => setNotificationsEnabled(!notificationsEnabled)}
        >
          <View style={styles.preferenceIcon}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.secondary}
            />
          </View>
          <Text style={styles.preferenceText}>Notifications</Text>
          <View
            style={[styles.toggle, notificationsEnabled && styles.toggleActive]}
          >
            <View
              style={[
                styles.toggleCircle,
                notificationsEnabled && styles.toggleCircleActive,
              ]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.preferenceItem}
          activeOpacity={0.7}
          onPress={() => setDarkModeEnabled(!darkModeEnabled)}
        >
          <View style={styles.preferenceIcon}>
            <Ionicons name="moon-outline" size={24} color={theme.secondary} />
          </View>
          <Text style={styles.preferenceText}>Dark mode</Text>
          <View style={[styles.toggle, darkModeEnabled && styles.toggleActive]}>
            <View
              style={[
                styles.toggleCircle,
                darkModeEnabled && styles.toggleCircleActive,
              ]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.preferenceItem}
          activeOpacity={0.7}
          onPress={() => {}}
        >
          <View style={styles.preferenceIcon}>
            <Ionicons name="globe-outline" size={24} color={theme.secondary} />
          </View>
          <Text style={styles.preferenceText}>Language</Text>
          <Text style={styles.languageValue}>English</Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.secondaryAccent}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>App Settings</Text>

      <View style={styles.appSettingsContainer}>
        <TouchableOpacity
          style={styles.preferenceItem}
          activeOpacity={0.7}
          onPress={() => {}}
        >
          <View style={styles.preferenceIcon}>
            <Ionicons name="trash-outline" size={24} color={theme.secondary} />
          </View>
          <Text style={styles.preferenceText}>Clear cache</Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.secondaryAccent}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.preferenceItem}
          activeOpacity={0.7}
          onPress={() => {}}
        >
          <View style={styles.preferenceIcon}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={theme.secondary}
            />
          </View>
          <Text style={styles.preferenceText}>About this app</Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.secondaryAccent}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
