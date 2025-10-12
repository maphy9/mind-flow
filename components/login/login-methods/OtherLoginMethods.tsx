import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import googleLogo from "@/assets/images/google-logo.png";
import facebookLogo from "@/assets/images/facebook-logo.png";
import twitterLogo from "@/assets/images/twitter-logo.png";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/authContext";

const OtherLoginMethods = () => {
  const { loginWithGoogle } = useAuth();
  const theme = useTheme();
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
    loginMethodIcons: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 50,
      alignItems: "center",
      marginBottom: 60,
    },
    loginMethodIcon: {
      width: 48,
      height: 48,
      objectFit: "contain",
    },
    loginMethodsContainerHeading: {
      width: "100%",
      flexDirection: "row",
      marginBottom: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    iconButton: {
      backgroundColor: theme.primary,
      width: 48,
      height: 48,
      borderRadius: 48,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 2,
    },
    horizontalLine: {
      flex: 1,
      backgroundColor: theme.secondary,
      height: 1,
      marginHorizontal: 10,
    },
  });

  return (
    <View style={styles.loginMethodsContainer}>
      <View style={styles.loginMethodsContainerHeading}>
        <View style={styles.horizontalLine} />

        <Text style={styles.infoText}>Other login methods</Text>

        <View style={styles.horizontalLine} />
      </View>

      <View style={styles.loginMethodIcons}>
        <TouchableOpacity
          onPress={loginWithGoogle}
          activeOpacity={0.8}
          style={[styles.iconButton]}
        >
          <Image source={googleLogo} style={styles.loginMethodIcon} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={[styles.iconButton]}>
          <Image source={facebookLogo} style={styles.loginMethodIcon} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={[styles.iconButton]}>
          <Image source={twitterLogo} style={styles.loginMethodIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OtherLoginMethods;
