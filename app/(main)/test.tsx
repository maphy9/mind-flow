
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
import { useTheme } from "@/hooks/useTheme";

const TestScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = getStyles(theme);
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

    router.replace({
      pathname: "/(main)/home",
      params: { newChillScore: overallRating.toFixed(0) }, // Round to integer
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

const getStyles = (theme) => StyleSheet.create({
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
