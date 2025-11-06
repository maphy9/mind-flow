import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import googleLogo from "@/assets/images/google-logo.png";
import { useTheme } from "@/context/themeContext";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";

const GoogleLogin = () => {
  const { loginWithGoogle } = useAuth();
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    loginMethodsContainer: {
      paddingHorizontal: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    infoText: {
      color: theme.secondary,
      fontSize: 16,
    },
    loginMethods: {
      flex: 1,
      justifyContent: "space-between",
    },
    loginMethodIcon: {
      width: 48,
      height: 48,
      objectFit: "contain",
    },
    loginMethodsContainerHeading: {
      width: "100%",
      flexDirection: "row",
      marginBottom: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    horizontalLine: {
      flex: 1,
      backgroundColor: theme.secondary,
      height: 1,
      marginHorizontal: 10,
    },
    input: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      width: "100%",
      height: 64,
      borderRadius: 100,
      paddingHorizontal: 20,
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 2,
      color: theme.secondary,
      backgroundColor: theme.surfaceAccent,
    },
    buttonText: {
      color: theme.secondary,
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 24,
    },
  });

  return (
    <View style={styles.loginMethodsContainer}>
      <View style={styles.loginMethodsContainerHeading}>
        <View style={styles.horizontalLine} />

        <Text style={styles.infoText}>Other login methods</Text>

        <View style={styles.horizontalLine} />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.input, { backgroundColor: theme.surface }]}
        onPress={loginWithGoogle}
      >
        <Text style={styles.buttonText}>Login with Google</Text>
        <Image source={googleLogo} style={styles.loginMethodIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default GoogleLogin;
