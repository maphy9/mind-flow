// app/(main)/reminders.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import Text from "@/components/general/Text";
import { useTheme } from "@/context/themeContext";
import * as Notifications from "expo-notifications";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

type Reminder = {
  id: string;
  title: string;          // e.g. "Drink water"
  rawTime: string;        // original text from the bot (e.g. "today 18:00", "07:00", "in 10 minutes")
  scheduleType: "once" | "daily";
  hour?: number;          // for daily
  minute?: number;        // for daily
  when?: number;          // epoch ms for once
  enabled: boolean;
  notificationIds?: string[];
  createdAt?: any;
};

// Human summary for UI
const describe = (r: Reminder) => {
  if (r.scheduleType === "daily" && r.hour !== undefined && r.minute !== undefined) {
    const hh = String(r.hour).padStart(2, "0");
    const mm = String(r.minute).padStart(2, "0");
    return `Daily at ${hh}:${mm}`;
  }
  if (r.scheduleType === "once" && r.when) {
    return `Once at ${new Date(r.when).toLocaleString()}`;
  }
  return r.rawTime || "Custom";
};

// Ensure permissions
async function ensureNotifPerms(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === "granted";
}

// (Re)Schedule one reminder locally; returns array of notification IDs
async function scheduleReminder(r: Reminder): Promise<string[]> {
  const ok = await ensureNotifPerms();
  if (!ok) return [];

  const ids: string[] = [];

  if (r.scheduleType === "daily" && r.hour != null && r.minute != null) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: r.title,
        body: "It's time!",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        hour: r.hour,
        minute: r.minute,
        repeats: true,
      },
    });
    ids.push(id);
  } else if (r.scheduleType === "once" && r.when) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: r.title,
        body: "Reminder",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: new Date(r.when),
    });
    ids.push(id);
  }

  return ids;
}

async function cancelReminder(ids?: string[]) {
  if (!ids?.length) return;
  await Promise.all(
    ids.map((id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => {}))
  );
}

const Reminders: React.FC = () => {
  const { theme } = useTheme();
  const s = getStyles(theme);

  const [uid, setUid] = useState<string | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Auth -> uid
  useEffect(() => {
    return auth().onAuthStateChanged((u) => setUid(u?.uid ?? null));
  }, []);

  // Live subscribe to reminders
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

  const unsubscribe = ref.onSnapshot(
    (snap) => {
      // ✅ guard against null/undefined snapshots
      if (!snap) {
        setReminders([]);
        return;
      }

      if (snap.empty) {
        setReminders([]);
        return;
      }

      const list: Reminder[] = snap.docs.map((d) => {
        const data = d.data() as any;

        // createdAt can be missing until server timestamp resolves
        const createdAt =
          data?.createdAt?.toDate?.() ??
          (typeof data?.createdAt === "number" ? new Date(data.createdAt) : null);

        return {
          id: d.id,
          title: String(data?.title ?? "Reminder"),
          rawTime: String(data?.rawTime ?? ""),
          scheduleType:
            data?.scheduleType === "once" ? "once" : "daily",
          hour: typeof data?.hour === "number" ? data.hour : undefined,
          minute: typeof data?.minute === "number" ? data.minute : undefined,
          when: typeof data?.when === "number" ? data.when : undefined,
          enabled: !!data?.enabled,
          notificationIds: Array.isArray(data?.notificationIds)
            ? data.notificationIds.filter((x: any) => typeof x === "string")
            : [],
          createdAt,
        };
      });

      setReminders(list);
    },
    (err) => {
      console.warn("Reminders onSnapshot error:", err);
      setReminders([]); // avoid null access
    }
  );

  return unsubscribe;
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
        // disable
        await cancelReminder(r.notificationIds);
        await doc.update({ enabled: false, notificationIds: [] });
      } else {
        // enable
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

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={s.header}>Reminders</Text>

      {reminders.map((r) => (
        <View key={r.id} style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.title}>{r.title}</Text>
            <TouchableOpacity onPress={() => remove(r)} style={s.removeBtn}>
              <Text style={s.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>

          <View style={s.body}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Reminder</Text>
              <Text style={s.sub}>{describe(r)}</Text>
            </View>
            <Switch
              value={r.enabled}
              onValueChange={() => toggle(r)}
              thumbColor={r.enabled ? "#fff" : "#fff"}
              trackColor={{ false: theme.surfaceAccent, true: theme.secondary }}
            />
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
      backgroundColor: theme.primaryAccent,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      padding: 12,
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    title: { color: theme.secondary, fontSize: 18, fontWeight: "700" },
    removeBtn: {
      backgroundColor: "#e74c3c",
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 12,
    },
    removeText: { color: "#fff", fontWeight: "700" },
    body: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 12,
    },
    label: { color: theme.secondary, fontSize: 14, fontWeight: "700" },
    sub: { color: theme.secondaryAccent, marginTop: 2 },
  });

export default Reminders;
