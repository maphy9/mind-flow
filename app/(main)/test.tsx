import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Card } from "react-native-paper";
import testData from "@/assets/tests/tests.json";

// ДОДАНО: імпорти Firebase Auth/Firestore
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const TestScreen = () => {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Коли тест завершено — рахуємо і зберігаємо результати
      // Виклик асинхронної функції без очікування (дозволяє не міняти сигнатуру)
      void calculateAndSaveResults(newAnswers);
    }
  };

  // ЗМІНА: робимо асинхронною та додаємо запис у Firestore
  const calculateAndSaveResults = async (finalAnswers: Record<string, number>) => {
    const { depression, loneliness, burnout } = testData.scoring;

    // 1. Raw scores
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

    // 2. Normalization (0-1, higher is better)
    const depNorm = 1 - depScore / 27;
    const lonNorm = 1 - lonScore / 6;
    const boNorm = 1 - boScore / 100;

    // 3. Weighted average
    const overallRating = (depNorm * 0.4 + lonNorm * 0.3 + boNorm * 0.3) * 100;
    const overallRatingRounded = Math.round(overallRating);

    // 4. ЗАПИС У FIRESTORE під поточним користувачем
    try {
      const user = auth().currentUser;
      if (!user) {
        // Якщо користувач не автентифікований — не пишемо під анонімом,
        // а кидаємо чітку помилку (можете замінити на signInAnonymously(), якщо хочете).
        throw new Error("User is not authenticated. Please sign in to save results.");
      }

      const uid = user.uid;

      // Опційно: оновимо профіль користувача часовою міткою (merge, щоб не перетерти інші поля)
      await firestore()
        .collection("users")
        .doc(uid)
        .set(
          { lastUpdatedAt: firestore.FieldValue.serverTimestamp() },
          { merge: true }
        );

      // Основний запис результату у підколекцію testResults
      await firestore()
        .collection("users")
        .doc(uid)
        .collection("testResults")
        .add({
          overallRating: overallRatingRounded,   // зберігаємо інт
          overallRatingRaw: overallRating,       // і сире значення (з плаваючою)
          createdAt: firestore.FieldValue.serverTimestamp(), // серверний час/дата
        });
    } catch (e) {
      console.error("Failed to save overallRating:", e);
      Alert.alert(
        "Saving error",
        e instanceof Error ? e.message : "Failed to save the test result."
      );
      // Продовжуємо навігацію навіть якщо запис не вдався — за бажанням можна змінити
    }

    // 5. Навігація назад на home з новим score
    router.replace({
      pathname: "/(main)/home",
      params: { newChillScore: String(overallRatingRounded) }, // ціле число
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
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(currentQuestion.id, option.value)}
          >
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  card: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  progressIndicator: {
    textAlign: "center",
    marginBottom: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  questionText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    color: "#111827",
  },
  optionsContainer: {
    marginTop: 16,
  },
  optionButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#374151",
    fontWeight: "500",
  },
});

export default TestScreen;
