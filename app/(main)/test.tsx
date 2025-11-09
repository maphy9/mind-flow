import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator, // НОВЕ: імпорт спінера
} from "react-native";
import { useTheme } from "@/context/themeContext";
import { useRouter } from "expo-router";
import { Card } from "react-native-paper";
import testData from "@/assets/tests/tests.json";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const TestScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // НОВЕ: стан завантаження

  const handleAnswer = (questionId: string, value: number) => {
    // ЗМІНЕНО: Блокуємо нові відповіді, якщо вже йде збереження
    if (isLoading) return;

    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // ЗМІНЕНО: вмикаємо завантаження перед збереженням
      setIsLoading(true);
      void calculateAndSaveResults(newAnswers);
    }
  };

  const calculateAndSaveResults = async (
    finalAnswers: Record<string, number>
  ) => {
    // ... (код розрахунку залишається без змін)
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
      const user = auth().currentUser;
      if (!user) {
        throw new Error(
          "User is not authenticated. Please sign in to save results."
        );
      }
      const uid = user.uid;

      await firestore()
        .collection("users")
        .doc(uid)
        .set(
          { lastUpdatedAt: firestore.FieldValue.serverTimestamp() },
          { merge: true }
        );

      await firestore()
        .collection("users")
        .doc(uid)
        .collection("testResults")
        .add({
          overallRating: overallRatingRounded,
          overallRatingRaw: overallRating,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (e) {
      console.error("Failed to save overallRating:", e);
      Alert.alert(
        "Saving error",
        e instanceof Error ? e.message : "Failed to save the test result."
      );
      // ЗМІНЕНО: якщо сталася помилка, вимикаємо завантаження,
      // щоб користувач не застряг (особливо якщо навігація не спрацює)
      setIsLoading(false);
      // Ми все ще намагаємось перейти, але якщо це не вдасться,
      // UI не буде заблоковано.
    }

    // Навігація відбувається після try/catch.
    // Нам не потрібно вимикати isLoading, оскільки
    // компонент буде розмонтовано.
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

      {/* ЗМІНЕНО: Контейнер з опціями тепер показує або кнопки, або спінер */}
      <View style={styles.optionsContainer}>
        {isLoading ? (
          // НОВЕ: Показуємо індикатор, поки йде збереження
          <ActivityIndicator size="large" color={theme.secondary} />
        ) : (
          // Існуюча логіка кнопок
          currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(currentQuestion.id, option.value)}
              // Нам не потрібен 'disabled' тут, бо весь блок замінюється
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

// ... (getStyles залишається без змін)
const getStyles = (theme) =>
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
      // НОВЕ: переконуємось, що спінер буде по центру, якщо він з'явиться
      justifyContent: "center",
      minHeight: 100, // Даємо трохи місця для спінера
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
