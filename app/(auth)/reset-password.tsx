import { useAuth } from "@/context/authContext";
import { showAlert } from "@/redux/states/alerts";
import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { useTheme } from "@/hooks/useTheme";
import Text from "@/components/general/Text";
import TextInput from "@/components/general/TextInput";
import { useRouter } from "expo-router";

const ResetPassword = () => {
  const router = useRouter();
  const theme = useTheme();
  const { resetPassword } = useAuth();
  const dispatch = useDispatch();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
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
      textAlign: "center",
      marginBottom: 20,
    },
  });

  const [email, setEmail] = useState("");

  const isValidEmail = () => {
    const s = email.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(s);
  };

  const handleResetPassword = async () => {
    if (!isValidEmail()) {
      dispatch(showAlert({ text: "Invalid email", type: "error" }));
      return;
    }
    const success = await resetPassword(email);
    if (success) {
      router.push("/login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.infoText}>
        Enter your email address and we'll send you a link to reset your
        password.
      </Text>

      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
        inputMode="email"
      />

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.input, { backgroundColor: theme.surface }]}
        onPress={handleResetPassword}
      >
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        Remember your password?{" "}
        <Text
          style={{ color: theme.surface, fontWeight: "bold" }}
          onPress={() => router.push("/login")}
        >
          Back to Login
        </Text>
      </Text>
    </SafeAreaView>
  );
};

export default ResetPassword;
