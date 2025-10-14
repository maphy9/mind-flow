import React from "react";
import { StyleSheet } from "react-native";
import EmailLogin from "./EmailLogin";
import GoogleLogin from "./GoogleLogin";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginMethods = () => {
  const styles = StyleSheet.create({
    loginMethods: {
      flex: 1,
      justifyContent: "space-between",
    },
  });

  return (
    <SafeAreaView style={styles.loginMethods}>
      <EmailLogin />

      <GoogleLogin />
    </SafeAreaView>
  );
};

export default LoginMethods;
