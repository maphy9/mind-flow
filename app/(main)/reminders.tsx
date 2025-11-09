import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch, // Kept for reference, but we are replacing it
  Alert,
} from "react-native";
import Text from "@/components/general/Text";
import { useTheme } from "@/context/themeContext";
import * as Notifications from "expo-notifications";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

type Reminder = {
  id: string;
  title: string;
  rawTime: string;
  scheduleType: "once" | "daily";
  hour?: number;
  minute?: number;
  when?: number;
  enabled: boolean;
  notificationIds?: string[];
  createdAt?: any;
};

// --- No changes to helper functions ---
const describe = (r: Reminder) => {
  if (
    r.scheduleType === "daily" &&
    r.hour !== undefined &&
    r.minute !== undefined
  ) {
    const hh = String(r.hour).padStart(2, "0");
    const mm = String(r.minute).padStart(2, "0");
    return `Daily at ${hh}:${mm}`;
  }
  if (r.scheduleType === "once" && r.when) {
    return `Once at ${new Date(r.when).toLocaleString()}`;
  }
  return r.rawTime || "Custom";
};

async function ensureNotifPerms(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === "granted";
}

async function scheduleReminder(r: Reminder): Promise<string[]> {
  const ok = await ensureNotifPerms();
  if (!ok) return [];
  const ids: string[] = [];
  if (r.scheduleType === "daily" && r.hour != null && r.minute != null) {
    const id = await Notifications.scheduleNotificationAsync({
      content: { title: r.title, body: "It's time!", sound: true },
      trigger: { hour: r.hour, minute: r.minute, repeats: true },
    });
    ids.push(id);
  } else if (r.scheduleType === "once" && r.when) {
    const id = await Notifications.scheduleNotificationAsync({
      content: { title: r.title, body: "Reminder", sound: true },
      trigger: new Date(r.when),
    });
    ids.push(id);
  }
  return ids;
}

async function cancelReminder(ids?: string[]) {
  if (!ids?.length) return;
  await Promise.all(
    ids.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => {})
    )
  );
}
// --- End of helper functions ---

const Reminders: React.FC = () => {
  const { theme } = useTheme();
  const s = getStyles(theme);

  const [uid, setUid] = useState<string | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // --- No changes to logic hooks (useEffect, useCallback) ---
  useEffect(() => auth().onAuthStateChanged((u) => setUid(u?.uid ?? null)), []);

  useEffect(() => {
    if (!uid) {
      setReminders([]);
      return;
    }
    const ref = firestore()
      .collection("users")
      .doc(uid)
      .collection("reminders")
      .orderBy("createdAt", "asc");
    const unsub = ref.onSnapshot(
      (snap) => {
        if (!snap || snap.empty) return setReminders([]);
        const list: Reminder[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            title: String(data?.title ?? "Reminder"),
            rawTime: String(data?.rawTime ?? ""),
            scheduleType: data?.scheduleType === "once" ? "once" : "daily",
            hour: typeof data?.hour === "number" ? data.hour : undefined,
            minute: typeof data?.minute === "number" ? data.minute : undefined,
            when: typeof data?.when === "number" ? data.when : undefined,
            enabled: !!data?.enabled,
            notificationIds: Array.isArray(data?.notificationIds)
              ? data.notificationIds.filter((x: any) => typeof x === "string")
              : [],
          };
        });
        setReminders(list);
      },
      (err) => {
        console.warn("Reminders onSnapshot error:", err);
        setReminders([]);
      }
    );
    return unsub;
  }, [uid]);

  const toggle = useCallback(
    async (r: Reminder) => {
      if (!uid) return;
      const doc = firestore()
        .collection("users")
        .doc(uid)
        .collection("reminders")
        .doc(r.id);
      if (r.enabled) {
        await cancelReminder(r.notificationIds);
        await doc.update({ enabled: false, notificationIds: [] });
      } else {
        const newIds = await scheduleReminder(r);
        await doc.update({ enabled: true, notificationIds: newIds });
      }
    },
    [uid]
  );

  const remove = useCallback(
    (r: Reminder) => {
      if (!uid) return;
      Alert.alert("Remove reminder", `Delete "${r.title}"?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await cancelReminder(r.notificationIds);
            await firestore()
              .collection("users")
              .doc(uid)
              .collection("reminders")
              .doc(r.id)
              .delete();
          },
        },
      ]);
    },
    [uid]
  );
  // --- End of logic hooks ---

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      {reminders.map((r) => (
        <View key={r.id} style={s.card}>
          {/* Fixed: Keep button inside card bounds */}
          <TouchableOpacity onPress={() => remove(r)} style={s.removeBtn}>
            <Text style={s.removeText}>Remove</Text>
          </TouchableOpacity>

          <View style={s.cardHeader}>
            <Text style={s.title} numberOfLines={3}>
              {r.title}
            </Text>
          </View>

          <View style={s.body}>
            <View style={{ flex: 1 }}>
              <Text style={s.sub}>{describe(r)} </Text>
            </View>

            {/* Custom Toggle (Switch replacement) */}
            <TouchableOpacity activeOpacity={0.7} onPress={() => toggle(r)}>
              <View style={[s.toggle, r.enabled && s.toggleActive]}>
                <View
                  style={[s.toggleCircle, r.enabled && s.toggleCircleActive]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {reminders.length === 0 && (
        <Text style={{ color: theme.secondaryAccent, marginTop: 12 }}>
          No reminders yet. Add some from MindBot.
        </Text>
      )}
    </ScrollView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    // --- Original styles ---
    container: { flex: 1, backgroundColor: theme.primary },
    header: {
      color: theme.secondary,
      fontSize: 22,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 8,
      marginTop: 8,
    },
    card: {
      position: "relative",
      backgroundColor: theme.primaryAccent,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      padding: 12,
      marginBottom: 12,
      overflow: "hidden",
      elevation: 2,
    },
    cardHeader: {
      paddingRight: 84,
      marginBottom: 8,
    },
    title: { color: theme.secondary, fontSize: 18, fontWeight: "700" },
    removeBtn: {
      position: "absolute",
      right: 12,
      top: 12,
      // Hardcoded color replaced with theme.red
      backgroundColor: theme.red, // Changed from "#e74c3c"
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 12,
      zIndex: 1,
    },
    removeText: { color: "#fff", fontWeight: "700" },
    body: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primaryAccent,
      borderRadius: 12,
      padding: 12,
    },
    label: { color: theme.secondary, fontSize: 14, fontWeight: "700" },
    // Readability improvements for 'sub' text
    sub: {
      color: theme.secondary,
      marginTop: 4, // Changed from 2
      fontSize: 15, // Changed from 14
    },

    // --- Styles for the custom toggle, using theme colors ---
    toggle: {
      width: 51,
      height: 31,
      borderRadius: 16,
      // Background color when OFF (gray track)
      backgroundColor: theme.surfaceAccent, // Changed from hardcoded
      justifyContent: "center",
      padding: 2,
    },
    toggleActive: {
      // Background color when ON (green track)
      backgroundColor: theme.surface, // Changed from hardcoded
    },
    toggleCircle: {
      width: 27,
      height: 27,
      borderRadius: 14,
      // Thumb color (white)
      backgroundColor: theme.secondary, // Changed from "#fff" to theme.secondary (white in dark mode, dark in light mode)
    },
    toggleCircleActive: {
      alignSelf: "flex-end",
    },
  });

export default Reminders;
