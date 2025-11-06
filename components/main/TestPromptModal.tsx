import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { useTheme } from "@/context/themeContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  onStart: () => void;
};

const TestPromptModal: React.FC<Props> = ({ visible, onClose, onStart }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Take a moment for your mind</Text>
            <Text style={styles.questionText}>
              Would you like to take a quick survey?
            </Text>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button onPress={onClose} color={theme.secondaryAccent}>
              Maybe later
            </Button>
            <Button
              onPress={onStart}
              mode="contained"
              style={styles.startButton}
              labelStyle={{ color: theme.primary }}
              theme={{ colors: { primary: theme.surface } }}
            >
              Start
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </Modal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    card: {
      width: "85%",
      maxWidth: 400,
      borderRadius: 16,
      backgroundColor: theme.primary,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 16,
      color: theme.secondary,
    },
    questionText: {
      fontSize: 15,
      textAlign: "center",
      color: theme.secondary,
      lineHeight: 22,
    },
    actions: {
      justifyContent: "flex-end",
      paddingTop: 16,
    },
    startButton: {
      marginLeft: 8,
    },
  });

export default TestPromptModal;
