import { StyleSheet, View } from "react-native";
import React from "react";
import Header from "@/components/login/Header";
import LoginMethods from "@/components/login/login-methods/LoginMethods";

const Login = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      gap: 32,
    },
  });

  return (
    <View style={styles.container}>
      <Header />

      <LoginMethods />
    </View>
  );
};

export default Login;
