import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Text from "../general/Text";
import logo from "@/assets/images/logo-dark.png";

const Header = () => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    topBox: {
      backgroundColor: theme.surface,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      paddingTop: 32,
      paddingBottom: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    logoContainer: {
      width: 128,
      height: 128,
      borderRadius: "50%",
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      tintColor: theme.surface,
      width: 100,
      height: 100,
    },
  });

  return (
    <View style={styles.topBox}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      <Text
        style={{ fontSize: 32, fontWeight: "bold", color: theme.secondary }}
      >
        MindFlow
      </Text>

      <Text style={{ fontSize: 24, color: theme.secondary, opacity: 0.85 }}>
        Your path to a balanced life
      </Text>
    </View>
  );
};

export default Header;
