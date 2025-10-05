import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import TextInput from "@/components/general/TextInput";
import { useTheme } from "@/hooks/useTheme";

const EmailLoginMethod = () => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    loginMethodsContainer: {
      paddingHorizontal: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      width: "100%",
      height: 56,
      borderRadius: 100,
      paddingHorizontal: 20,
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 2,
      marginBottom: 10,
    },
    buttonText: {
      color: theme.primary,
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 24,
    },
    infoText: {
      color: theme.secondary,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.loginMethodsContainer}>
      <TextInput
        style={[
          styles.input,
          { color: theme.secondary, backgroundColor: theme.surfaceAccent },
        ]}
        placeholder="Email"
        inputMode="email"
      />

      <TextInput
        style={[
          styles.input,
          { color: theme.secondary, backgroundColor: theme.surfaceAccent },
        ]}
        placeholder="Password"
        secureTextEntry={true}
      />

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.input, { backgroundColor: theme.surface }]}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        Forgot your password?{" "}
        <Text style={{ color: theme.surface, fontWeight: "bold" }}>
          Reset password
        </Text>
      </Text>

      <Text style={styles.infoText}>
        Don’t have an account?{" "}
        <Text style={{ color: theme.surface, fontWeight: "bold" }}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};

export default EmailLoginMethod;
