import React from "react";
import { StyleSheet, View } from "react-native";
import OtherLoginMethods from "./OtherLoginMethods";
import EmailLoginMethod from "./EmailLoginMethod";

const LoginMethods = () => {
  const styles = StyleSheet.create({
    loginMethods: {
      flex: 1,
      justifyContent: "space-between",
    },
  });

  return (
    <View style={styles.loginMethods}>
      <EmailLoginMethod />

      <OtherLoginMethods />
    </View>
  );
};

export default LoginMethods;
