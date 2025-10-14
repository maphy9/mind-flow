import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import TextInput from "@/components/general/TextInput";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/authContext";
import { useDispatch } from "react-redux";
import { showAlert } from "@/redux/states/alerts";

const EmailLogin = () => {
  const theme = useTheme();
  const { login, signOut } = useAuth();
  const dispatch = useDispatch();

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
      color: theme.secondary,
      backgroundColor: theme.surfaceAccent,
    },
    buttonText: {
      color: theme.secondary,
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 24,
    },
    infoText: {
      color: theme.secondary,
      fontSize: 16,
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValidEmail = () => {
    const s = email.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(s);
  };

  const handleLogin = () => {
    if (!isValidEmail()) {
      dispatch(showAlert({ text: "Invalid email", type: "error" }));
      return;
    }
    login(email, password);
  };

  return (
    <View style={styles.loginMethodsContainer}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
        inputMode="email"
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
      />

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.input, { backgroundColor: theme.surface }]}
        onPress={handleLogin}
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

export default EmailLogin;
