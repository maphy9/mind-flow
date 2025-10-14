import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import Header from "@/components/auth/Header";
import LoginMethods from "@/components/auth/login-methods/LoginMethods";

const Login = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Header />

      <LoginMethods />
    </ScrollView>
  );
};

export default Login;
