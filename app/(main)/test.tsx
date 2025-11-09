import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/context/themeContext";
import { useRouter } from "expo-router";
import { Card } from "react-native-paper";
import testData from "@/assets/tests/tests.json";

// FIX: Import modular auth and firestore functions
import { getAuth } from "@react-native-firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "@react-native-firebase/firestore";

// FIX: Initialize Firebase services outside the component
const authInstance = getAuth();
const db = getFirestore();

const TestScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswer = (questionId: string, value: number) => {
    if (isLoading) return;

    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsLoading(true);
      void calculateAndSaveResults(newAnswers);
    }
  };

  const calculateAndSaveResults = async (
    finalAnswers: Record<string, number>
  ) => {
    // ... (Calculation logic remains the same)
    const { depression, loneliness, burnout } = testData.scoring;
    const depScore = depression.items.reduce(
      (acc, id) => acc + (finalAnswers[id] || 0),
      0
    );
    const lonScore = loneliness.items.reduce(
      (acc, id) => acc + (finalAnswers[id] || 0),
      0
    );
    const boTotal = burnout.items.reduce(
      (acc, id) => acc + (finalAnswers[id] || 0),
      0
    );
    const boScore = boTotal / burnout.items.length;
    const depNorm = 1 - depScore / 27;
    const lonNorm = 1 - lonScore / 6;
    const boNorm = 1 - boScore / 100;
    const overallRating = (depNorm * 0.4 + lonNorm * 0.3 + boNorm * 0.3) * 100;
    const overallRatingRounded = Math.round(overallRating);

    try {
      // FIX: Use the initialized auth instance
      const user = authInstance.currentUser;
      if (!user) {
        throw new Error(
          "User is not authenticated. Please sign in to save results."
        );
      }
      const uid = user.uid;

      // FIX: Use modular firestore functions (doc, setDoc, serverTimestamp)
      const userDocRef = doc(db, "users", uid);
      await setDoc(
        userDocRef,
        { lastUpdatedAt: serverTimestamp() },
        { merge: true }
      );

      // FIX: Use modular firestore functions (collection, addDoc, serverTimestamp)
      const testResultsColRef = collection(db, "users", uid, "testResults");
      await addDoc(testResultsColRef, {
        overallRating: overallRatingRounded,
        overallRatingRaw: overallRating,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Failed to save overallRating:", e);
      Alert.alert(
        "Saving error",
        e instanceof Error ? e.message : "Failed to save the test result."
      );
      setIsLoading(false);
    }

    router.replace({
      pathname: "/(main)/home",
      params: { newChillScore: String(overallRatingRounded) },
    });
  };

  const currentQuestion = testData.questions[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.progressIndicator}>
            Question {currentQuestionIndex + 1} of {testData.questions.length}
          </Text>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </Card.Content>
      </Card>

      <View style={styles.optionsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.secondary} />
        ) : (
          currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(currentQuestion.id, option.value)}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

// ... (getStyles remains the same)
const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      justifyContent: "center",
      backgroundColor: theme.primaryAccent,
    },
    card: {
      marginBottom: 24,
      borderRadius: 16,
      backgroundColor: theme.primary,
    },
    progressIndicator: {
      textAlign: "center",
      marginBottom: 16,
      color: theme.secondaryAccent,
      fontWeight: "500",
    },
    questionText: {
      fontSize: 18,
      textAlign: "center",
      lineHeight: 26,
      color: theme.secondary,
    },
    optionsContainer: {
      marginTop: 16,
      justifyContent: "center",
      minHeight: 100, // Give space for the spinner
    },
    optionButton: {
      backgroundColor: theme.primary,
      paddingVertical: 18,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.primaryAccent,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    optionText: {
      fontSize: 16,
      textAlign: "center",
      color: theme.secondary,
      fontWeight: "500",
    },
  });

export default TestScreen;
