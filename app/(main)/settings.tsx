import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import Text from "@/components/general/Text";
import { useAuth } from "@/context/authContext";
import emptyPfp from "@/assets/images/empty-pfp.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "react-native";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const systemColorScheme = useColorScheme();
  const { currentUser } = useAuth();
  const [userPfp, setUserPfp] = useState(emptyPfp);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [themeMode, setThemeMode] = useState("system");
  const [showThemeModal, setShowThemeModal] = useState(false);

  useEffect(() => {
    if (currentUser.photoURL) {
      setUserPfp(currentUser.photoURL);
    }
  }, [currentUser]);

  useEffect(() => {
    loadThemeMode();
    loadNotificationPreference();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("@theme_preference");
      if (savedTheme !== null) {
        setThemeMode(
          savedTheme === "dark" || savedTheme === "light"
            ? savedTheme
            : "system"
        );
      } else {
        setThemeMode("system");
      }
    } catch (error) {
      console.error("Error loading theme mode:", error);
    }
  };

  const loadNotificationPreference = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(status === "granted");
    } catch (error) {
      console.error("Error loading notification preference:", error);
    }
  };

  const handleThemeSelect = async (mode) => {
    setThemeMode(mode);
    setShowThemeModal(false);

    try {
      if (mode === "system") {
        await AsyncStorage.removeItem("@theme_preference");
        setTheme(systemColorScheme);
      } else {
        await AsyncStorage.setItem("@theme_preference", mode);
        setTheme(mode);
      }
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const toggleNotifications = async () => {
    try {
      const { status: currentStatus } =
        await Notifications.getPermissionsAsync();

      if (currentStatus === "granted") {
        setNotificationsEnabled(false);
      } else {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        setNotificationsEnabled(newStatus === "granted");
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
    }
  };

  const getThemeDisplayText = () => {
    if (themeMode === "system") return "System";
    if (themeMode === "dark") return "Dark";
    return "Light";
  };

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
    modalOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: theme.primaryAccent,
      borderRadius: 16,
      padding: 20,
      width: "80%",
      maxWidth: 300,
    },
    modalTitle: {
      color: theme.secondary,
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 20,
      textAlign: "center",
    },
    modalOption: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: theme.primary,
    },
    modalOptionSelected: {
      backgroundColor: theme.surface,
    },
    modalOptionText: {
      color: theme.secondary,
      fontSize: 16,
      textAlign: "center",
    },
    modalOptionTextSelected: {
      fontWeight: "600",
    },
  });

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
          <Text style={styles.accountName}>{currentUser.displayName}</Text>
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
          onPress={toggleNotifications}
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
          onPress={() => setShowThemeModal(true)}
        >
          <View style={styles.preferenceIcon}>
            <Ionicons name="moon-outline" size={24} color={theme.secondary} />
          </View>
          <Text style={styles.preferenceText}>Dark mode</Text>
          <Text style={styles.languageValue}>{getThemeDisplayText()}</Text>
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

      {showThemeModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowThemeModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Theme</Text>

              <TouchableOpacity
                style={[
                  styles.modalOption,
                  themeMode === "light" && styles.modalOptionSelected,
                ]}
                onPress={() => handleThemeSelect("light")}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    themeMode === "light" && styles.modalOptionTextSelected,
                  ]}
                >
                  Light
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalOption,
                  themeMode === "dark" && styles.modalOptionSelected,
                ]}
                onPress={() => handleThemeSelect("dark")}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    themeMode === "dark" && styles.modalOptionTextSelected,
                  ]}
                >
                  Dark
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalOption,
                  themeMode === "system" && styles.modalOptionSelected,
                ]}
                onPress={() => handleThemeSelect("system")}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    themeMode === "system" && styles.modalOptionTextSelected,
                  ]}
                >
                  System
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Settings;
