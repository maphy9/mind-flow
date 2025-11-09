import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth } from "@react-native-firebase/auth";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from "@react-native-firebase/firestore";
import { BarChart } from "react-native-gifted-charts";
import { useTheme } from "@/context/themeContext";

const authInstance = getAuth();
const db = getFirestore();

const Tables = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchResults = useCallback(async () => {
    try {
      const user = authInstance.currentUser;
      if (!user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const testResultsColRef = collection(
        db,
        "users",
        user.uid,
        "testResults"
      );
      const q = query(testResultsColRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

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
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch test results:", err);
      setError(err.message || "Failed to fetch test results.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchResults();
    }, [fetchResults])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchResults();
  }, [fetchResults]);

  const chartData = useMemo(() => {
    const sorted = [...testResults].sort((a, b) => {
      const ta = a.createdAt ? a.createdAt.getTime() : 0;
      const tb = b.createdAt ? b.createdAt.getTime() : 0;
      return ta - tb;
    });

    return sorted.map((item) => {
      const label = item.createdAt
        ? item.createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          })
        : "—";

      return {
        label,
        value: item.overallRating,
        frontColor: theme.surface,
        topLabelComponent: () => (
          <Text style={[styles.topLabel, { color: theme.secondary }]}>
            {item.overallRating}
          </Text>
        ),
      };
    });
  }, [testResults, theme]);

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
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.secondary}
        />
      }
    >
      {loading && testResults.length === 0 && (
        <Text style={styles.info}>Loading...</Text>
      )}

      {error && <Text style={[styles.info, styles.error]}>{error}</Text>}

      {!loading && !error && chartData.length === 0 && (
        <Text style={styles.info}>No test results yet.</Text>
      )}

      {!loading && !error && chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Test History</Text>

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
            yAxisColor={theme.secondary}
            xAxisColor={theme.secondary}
            yAxisTextStyle={{ color: theme.secondary, fontSize: 12 }}
            xAxisLabelTextStyle={{
              color: theme.secondary,
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
            rulesColor={theme.secondaryAccent}
            yAxisLabelWidth={30}
            frontColor="#3B82F6"
            showLine={false}
            showGradient={false}
            showYAxisIndices={false}
            showFractionalValues={false}
          />
        </View>
      )}

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

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      backgroundColor: theme.primary,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.secondary,
      marginBottom: 8,
    },
    info: {
      fontSize: 16,
      color: theme.secondaryAccent,
      marginTop: 8,
    },
    error: {
      color: theme.red,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
      color: theme.secondary,
    },
    item: {
      backgroundColor: theme.primaryAccent,
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
      color: theme.secondary,
    },
    score: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.secondary,
      marginTop: 4,
    },
    chartContainer: {
      backgroundColor: theme.primaryAccent,
      borderRadius: 16,
      paddingTop: 12,
      paddingBottom: 40,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.secondaryAccent,
      marginTop: 16,
      overflow: "hidden",
    },
    topLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.secondary,
      marginBottom: 4,
    },
  });

export default Tables;
