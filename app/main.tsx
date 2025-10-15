import React, { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "@/components/general/Text";
import { useRouter } from "expo-router";

const main = () => {
  const router = useRouter();
  const { currentUser, signOut } = useAuth();
  const theme = useTheme();
  const styles = StyleSheet.create({
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
  });

  useEffect(() => {
    if (currentUser === null) {
      router.push("/login");
    }
  }, [currentUser]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: theme.surface }}>
        {currentUser
          ? currentUser.displayName ?? currentUser.email
          : "Not logged in"}
      </Text>

      <Text style={{ color: theme.surface }}>Hello world</Text>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.input, { backgroundColor: theme.surface }]}
        onPress={signOut}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default main;
