import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { BarChart } from "react-native-gifted-charts";

const Tables = () => {
  const { width } = useWindowDimensions();
  const [testResults, setTestResults] = useState<
    { id: string; overallRating: number; createdAt: Date | null }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. забираем данные из Firestore
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          setError("User not authenticated.");
          setLoading(false);
          return;
        }

        const uid = user.uid;

        const snapshot = await firestore()
          .collection("users")
          .doc(uid)
          .collection("testResults")
          .orderBy("createdAt", "desc")
          .get();

        const results = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          const createdAt =
            data.createdAt && data.createdAt.seconds
              ? new Date(data.createdAt.seconds * 1000)
              : null;

          return {
            id: doc.id,
            overallRating: Number(data.overallRating ?? 0),
            createdAt,
          };
        });

        setTestResults(results);
        setLoading(false);
      } catch (err: any) {
        console.error("Failed to fetch test results:", err);
        setError(err.message || "Failed to fetch test results.");
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // 2. превращаем в данные для графика
  const chartData = useMemo(() => {
    // хотим слева-направо по времени → сортируем по возрастанию
    const sorted = [...testResults].sort((a, b) => {
      const ta = a.createdAt ? a.createdAt.getTime() : 0;
      const tb = b.createdAt ? b.createdAt.getTime() : 0;
      return ta - tb;
    });

    return sorted.map((item) => {
      // подпись вида "03.11" или "03.11 16:37" если нужно
      const label = item.createdAt
        ? item.createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          })
        : "—";

      return {
        label,
        value: item.overallRating,
        frontColor: "#3B82F6",
        topLabelComponent: () => (
          <Text
            style={{
              fontSize: 11,
              fontWeight: "600",
              color: "#0F172A",
              marginBottom: 4,
            }}
          >
            {item.overallRating}
          </Text>
        ),
      };
    });
  }, [testResults]);

  // 3. считаем maxValue и шаги
  const maxVal = useMemo(() => {
    if (chartData.length === 0) return 10;
    const m = Math.max(...chartData.map((d) => d.value));
    if (m <= 10) return 10;
    if (m <= 20) return 20;
    if (m <= 50) return 50;
    return Math.ceil(m / 10) * 10;
  }, [chartData]);

  const stepVal = useMemo(() => {
    if (maxVal <= 10) return 2;
    if (maxVal <= 20) return 4;
    if (maxVal <= 50) return 5;
    return 10;
  }, [maxVal]);

  const chartPaddingHorizontal = 12;
  const barWidth = 18;
  const spacing = 12;

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {loading && <Text style={styles.info}>Loading...</Text>}
      {error && <Text style={[styles.info, styles.error]}>{error}</Text>}

      {!loading && !error && chartData.length === 0 && (
        <Text style={styles.info}>No test results yet.</Text>
      )}

      {!loading && !error && chartData.length > 0 && (
        <View
          style={{
            backgroundColor: "#F8FAFC",
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            marginTop: 16,
            overflow: "hidden",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#0F172A",
              marginBottom: 8,
            }}
          >
            Test History
          </Text>

          <BarChart
            data={chartData}
            width={width - 16 * 2 - chartPaddingHorizontal * 2}
            initialSpacing={chartPaddingHorizontal}
            endSpacing={chartPaddingHorizontal}
            barWidth={barWidth}
            spacing={spacing}
            barBorderRadius={6}
            isAnimated
            animationDuration={900}
            yAxisThickness={1}
            xAxisThickness={1}
            yAxisColor="#CBD5E1"
            xAxisColor="#CBD5E1"
            yAxisTextStyle={{ color: "#64748B", fontSize: 12 }}
            xAxisLabelTextStyle={{
              color: "#475569",
              fontSize: 12,
              marginTop: 6,
            }}
            rotateLabel
            labelWidth={40}
            noOfSections={maxVal / stepVal}
            maxValue={maxVal}
            stepValue={stepVal}
            rulesType="solid"
            rulesThickness={1}
            rulesColor="#E2E8F0"
            yAxisLabelWidth={30}
            frontColor="#3B82F6"
            showLine={false}
            showGradient={false}
            showYAxisIndices={false}
            showFractionalValues={false}
            showValuesAsTopLabel
          />
        </View>
      )}

      {/* Можешь оставить и сырой список ниже — для дебага */}
      {!loading && !error && testResults.length > 0 && (
        <View style={{ marginTop: 18 }}>
          <Text style={styles.subtitle}>Raw list</Text>
          {testResults.map((res) => (
            <View key={res.id} style={styles.item}>
              <Text style={styles.date}>
                {res.createdAt
                  ? res.createdAt.toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "No date"}
              </Text>
              <Text style={styles.score}>Score: {res.overallRating}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  info: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
  error: {
    color: "#DC2626",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },
  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  date: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  score: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0B0F0A",
    marginTop: 4,
  },
});

export default Tables;
