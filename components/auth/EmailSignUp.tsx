import { useAuth } from "@/context/authContext";
import { useTheme } from "@/hooks/useTheme";
import { showAlert } from "@/redux/states/alerts";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import TextInput from "../general/TextInput";
import Text from "../general/Text";
import { isValidEmail } from "@/utils/email";
import { useRouter } from "expo-router";

const EmailSignUp = () => {
  const router = useRouter();
  const theme = useTheme();
  const { signUp } = useAuth();
  const dispatch = useDispatch();

  const styles = StyleSheet.create({
    signUpMethodsContainer: {
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
    buttonDisabled: {
      opacity: 0.5,
    },
    infoText: {
      color: theme.secondary,
      fontSize: 16,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      width: "100%",
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.secondary,
      marginRight: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxChecked: {
      backgroundColor: theme.surface,
    },
    checkboxText: {
      color: theme.secondary,
      fontSize: 14,
      flex: 1,
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignUp = () => {
    if (!isValidEmail(email)) {
      dispatch(showAlert({ text: "Invalid email", type: "error" }));
      return;
    }
    if (!termsAccepted) {
      dispatch(showAlert({ text: "Please accept the terms", type: "error" }));
      return;
    }
    signUp(email, password);
  };

  const canSignUp = termsAccepted && email.trim() && password.trim();

  return (
    <View style={styles.signUpMethodsContainer}>
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
        style={styles.checkboxContainer}
        onPress={() => setTermsAccepted(!termsAccepted)}
        activeOpacity={0.8}
      >
        <View
          style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
        >
          {termsAccepted && (
            <Text style={{ color: theme.secondary, fontSize: 16 }}>✓</Text>
          )}
        </View>
        <Text style={styles.checkboxText}>
          I accept the{" "}
          <Text style={{ color: theme.surface, fontWeight: "bold" }}>
            Terms and Conditions
          </Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.input,
          { backgroundColor: theme.surface },
          !canSignUp && styles.buttonDisabled,
        ]}
        onPress={handleSignUp}
        disabled={!canSignUp}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        Already have an account?{" "}
        <Text
          style={{ color: theme.surface, fontWeight: "bold" }}
          onPress={() => router.push("/login")}
        >
          Login
        </Text>
      </Text>
    </View>
  );
};

export default EmailSignUp;
