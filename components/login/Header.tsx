import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import Text from "../general/Text";
import logo from "@/assets/images/logo-dark.png";
import logoBoxDark from "@/assets/images/logo-box-dark.png";
import logoBoxLight from "@/assets/images/logo-box-light.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/authContext";

const Header = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const styles = StyleSheet.create({
    logoBox: {
      paddingTop: 8,
      paddingBottom: 48,
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
    <ImageBackground
      source={theme === Colors.dark ? logoBoxDark : logoBoxLight}
      resizeMode="stretch"
    >
      <SafeAreaView style={styles.logoBox}>
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

        <Text>{currentUser ? currentUser.displayName : "Not logged in"}</Text>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Header;
