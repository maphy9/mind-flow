
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Card } from "react-native-paper";
import testData from "@/assets/tests/tests.json";

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
      calculateAndSaveResults(newAnswers);
    }
  };

  const calculateAndSaveResults = (finalAnswers: Record<string, number>) => {
    const burnoutScoring = testData.scoring.burnout;
    let burnoutScore = 0;

    if (burnoutScoring.method === "average") {
      const total = burnoutScoring.items.reduce((acc, itemId) => {
        return acc + (finalAnswers[itemId] || 0);
      }, 0);
      burnoutScore = total / burnoutScoring.items.length;
    }

    // Navigate back to home with the new chill score
    router.replace({
      pathname: "/(main)/home",
      params: { newChillScore: burnoutScore.toFixed(2) },
    });
  };

  const getSeverity = (
    score: number,
    severityLevels: { min: number; max: number; label: string }[]
  ) => {
    for (const level of severityLevels) {
      if (score >= level.min && score <= level.max) {
        return level.label;
      }
    }
    return "Unknown";
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
