// app/(main)/mind-bot.tsx
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  LayoutChangeEvent,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/themeContext";
import Text from "@/components/general/Text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import * as Notifications from "expo-notifications";

type Role = "user" | "assistant" | "system";
type ActionItem = { text: string; time: string; checked?: boolean };
type Msg = { id: string; role: Role; content: string; actions?: ActionItem[] };

type Plan = {
  message: string;
  actions: { text: string; time: string }[];
};

const SYSTEM_PROMPT = `You are MindBot. Always reply with a single valid JSON object (no code fences, no extra text). Shape:
{
  "message": string,
  "actions": [
    { "text": string, "time": string }
  ]
}
Rules:
- Output ONLY the JSON object. No markdown, no prose.
- Keep "message" warm, concise (1–3 sentences), and practical.
- Suggest up to 5 actions with realistic reminder "time" values like "in 10 minutes", "today 18:00", or ISO8601.
- Do not include any other fields.`;

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

// ---------- storage helpers ----------
const storageKey = (uid?: string | null) => `@mindbot_conversation:${uid ?? "anon"}`;

const sanitize = (arr: any[]): Msg[] =>
  (arr || [])
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .map((m, idx) => ({
      id: m.id ?? `${Date.now()}-${idx}`,
      role: m.role,
      content: m.content,
      actions: Array.isArray(m.actions)
        ? m.actions
            .filter(
              (a) =>
                a &&
                typeof a.text === "string" &&
                a.text.trim() &&
                typeof a.time === "string" &&
                a.time.trim()
            )
            .slice(0, 5)
            .map((a) => ({ text: a.text, time: a.time, checked: !!a.checked }))
        : undefined,
    }));

// ===== Helpers for reminders =====

function parseTimeToReminder(raw: string) {
  const t = raw.trim().toLowerCase();

  // HH:mm (daily)
  const m1 = t.match(/^(\d{1,2}):(\d{2})$/);
  if (m1) {
    const hour = Math.min(23, parseInt(m1[1], 10));
    const minute = Math.min(59, parseInt(m1[2], 10));
    return { scheduleType: "daily" as const, hour, minute };
  }

  // today HH:mm (once)
  const m2 = t.match(/^today\s+(\d{1,2}):(\d{2})$/);
  if (m2) {
    const hour = Math.min(23, parseInt(m2[1], 10));
    const minute = Math.min(59, parseInt(m2[2], 10));
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
    return { scheduleType: "once" as const, when: d.getTime() };
  }

  // in X minutes/hours (once)
  const m3 = t.match(/^in\s+(\d+)\s+(minute|minutes|hour|hours)$/);
  if (m3) {
    const n = parseInt(m3[1], 10);
    const ms = m3[2].startsWith("hour") ? n * 60 * 60 * 1000 : n * 60 * 1000;
    return { scheduleType: "once" as const, when: Date.now() + ms };
  }

  // Fallback: any HH:mm inside -> daily
  const m4 = t.match(/(\d{1,2}):(\d{2})/);
  if (m4) {
    const hour = Math.min(23, parseInt(m4[1], 10));
    const minute = Math.min(59, parseInt(m4[2], 10));
    return { scheduleType: "daily" as const, hour, minute };
  }

  return null;
}

async function ensureNotifPerms(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === "granted";
}

async function scheduleAndSaveReminder(
  uid: string,
  title: string,
  rawTime: string
) {
  const parsed = parseTimeToReminder(rawTime);
  const base: any = {
    title,
    rawTime,
    scheduleType: parsed?.scheduleType ?? "daily",
    hour: (parsed as any)?.hour ?? null,
    minute: (parsed as any)?.minute ?? null,
    when: (parsed as any)?.when ?? null,
    enabled: true,
    notificationIds: [],
    createdAt: firestore.FieldValue.serverTimestamp(),
  };

  const ok = await ensureNotifPerms();
  if (ok) {
    if (base.scheduleType === "daily" && base.hour != null && base.minute != null) {
      const id = await Notifications.scheduleNotificationAsync({
        content: { title, body: "It's time!", sound: true },
        trigger: { hour: base.hour, minute: base.minute, repeats: true },
      });
      base.notificationIds.push(id);
    } else if (base.scheduleType === "once" && base.when) {
      const id = await Notifications.scheduleNotificationAsync({
        content: { title, body: "Reminder", sound: true },
        trigger: new Date(base.when),
      });
      base.notificationIds.push(id);
    }
  }

  await firestore()
    .collection("users")
    .doc(uid)
    .collection("reminders")
    .add(base);
}

// ===== Firestore helpers for suggestions tied to message =====

async function savePlanToCloud(uid: string, msgId: string, actions: ActionItem[]) {
  try {
    await firestore()
      .collection("users")
      .doc(uid)
      .collection("mindbotSuggestions")
      .doc(msgId)
      .set(
        {
          messageId: msgId,
          actions: actions.map((a) => ({ text: a.text, time: a.time, checked: !!a.checked })),
          updatedAt: firestore.FieldValue.serverTimestamp(),
          createdAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  } catch (e) {
    console.warn("MindBot: savePlanToCloud failed:", e);
  }
}

async function updatePlanCheckedInCloud(uid: string, msgId: string, actions: ActionItem[]) {
  try {
    await firestore()
      .collection("users")
      .doc(uid)
      .collection("mindbotSuggestions")
      .doc(msgId)
      .set(
        {
          actions: actions.map((a) => ({ text: a.text, time: a.time, checked: !!a.checked })),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  } catch (e) {
    console.warn("MindBot: updatePlanCheckedInCloud failed:", e);
  }
}

const MindBot: React.FC = () => {
  const { theme } = useTheme();
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();

  const listRef = useRef<FlatList<Msg>>(null);
  const [uid, setUid] = useState<string | null>(null);

  const [messages, setMessages] = useState<Msg[]>([
    { id: "sys", role: "system", content: SYSTEM_PROMPT },
    { id: "hello", role: "assistant", content: "Hi, how can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [inputBarH, setInputBarH] = useState(56);

  // Typing animation
  const TypingDots: React.FC = () => {
    const a1 = useRef(new Animated.Value(0.2)).current;
    const a2 = useRef(new Animated.Value(0.2)).current;
    const a3 = useRef(new Animated.Value(0.2)).current;

    useEffect(() => {
      const mk = (v: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(v, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.timing(v, { toValue: 0.2, duration: 350, useNativeDriver: true }),
          ])
        );

      const anim1 = mk(a1, 0);
      const anim2 = mk(a2, 150);
      const anim3 = mk(a3, 300);
      anim1.start(); anim2.start(); anim3.start();
      return () => { anim1.stop(); anim2.stop(); anim3.stop(); };
    }, [a1, a2, a3]);

    return (
      <View style={s.dotsRow}>
        <Animated.View style={[s.dotTyping, { opacity: a1 }]} />
        <Animated.View style={[s.dotTyping, { opacity: a2 }]} />
        <Animated.View style={[s.dotTyping, { opacity: a3 }]} />
      </View>
    );
  };

  // Auth
  useEffect(() => {
    const unsub = auth().onAuthStateChanged((user) => setUid(user?.uid ?? null));
    return unsub;
  }, []);

  // Load messages (local + cloud)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Local
        const raw = await AsyncStorage.getItem(storageKey(uid));
        const localMsgs = raw ? sanitize(JSON.parse(raw)) : [];
        if (!cancelled && localMsgs.length) {
          setMessages([{ id: "sys", role: "system", content: SYSTEM_PROMPT }, ...localMsgs]);
        }

        // Cloud history (messages only)
        if (uid) {
          const snap = await firestore()
            .collection("users")
            .doc(uid)
            .collection("mindbotMessages")
            .orderBy("createdAt", "asc")
            .limit(300)
            .get();

          const cloudMsgs: Msg[] = snap.docs.map((d) => {
            const data = d.data() as any;
            return { id: d.id, role: data.role, content: data.content } as Msg;
          });

          // Merge with local if any
          if (!cancelled && cloudMsgs.length) {
            // Also load suggestions mapped by messageId
            const sugSnap = await firestore()
              .collection("users")
              .doc(uid)
              .collection("mindbotSuggestions")
              .get();

            const sugMap = new Map<string, ActionItem[]>();
            sugSnap.docs.forEach((doc) => {
              const d = doc.data() as any;
              const actions: ActionItem[] = Array.isArray(d.actions)
                ? d.actions.map((a: any) => ({
                    text: String(a.text ?? ""),
                    time: String(a.time ?? ""),
                    checked: !!a.checked,
                  }))
                : [];
              sugMap.set(doc.id, actions);
            });

            const merged = cloudMsgs.map((m) =>
              sugMap.has(m.id) ? { ...m, actions: sanitize([{ actions: sugMap.get(m.id) }])[0]?.actions } : m
            );

            setMessages([{ id: "sys", role: "system", content: SYSTEM_PROMPT }, ...sanitize(merged)]);
          }
        }
      } catch (e) {
        console.warn("MindBot: load history failed:", e);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  // Visible messages (skip system)
  const visible = useMemo(() => messages.filter((m) => m.role !== "system"), [messages]);

  // Persist visible (including actions) to local storage
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(storageKey(uid), JSON.stringify(visible));
      } catch (e) {
        console.warn("MindBot: save local failed:", e);
      }
    })();
  }, [visible, uid]);

  // Save a single simple message to cloud
  const saveToCloud = useCallback(
    async (msg: Msg) => {
      if (!uid) return;
      try {
        await firestore()
          .collection("users")
          .doc(uid)
          .collection("mindbotMessages")
          .doc(msg.id) // use our id so suggestions can reference the same id
          .set({
            role: msg.role,
            content: msg.content,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
      } catch (e) {
        console.warn("MindBot: save cloud failed:", e);
      }
    },
    [uid]
  );

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, []);

  const onInputBarLayout = (e: LayoutChangeEvent) => {
    const h = Math.max(48, Math.round(e.nativeEvent.layout.height));
    if (h !== inputBarH) setInputBarH(h);
  };

  // Parse LLM JSON
  function safeParsePlan(text: string): Plan | null {
    try {
      const match = text.match(/\{[\s\S]*\}$/);
      const raw = match ? match[0] : text;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.message === "string" && Array.isArray(parsed.actions)) {
        const actions = parsed.actions
          .filter(
            (a: any) =>
              a && typeof a.text === "string" && a.text.trim() && typeof a.time === "string" && a.time.trim()
          )
          .slice(0, 5);
        return { message: parsed.message, actions };
      }
      return null;
    } catch {
      return null;
    }
  }

  // Send
  const onSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: Msg = { id: `${Date.now()}-user`, role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setSending(true);
    scrollToEnd();
    saveToCloud(userMsg);

    try {
      const apiKey = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
      if (!apiKey) throw new Error("Missing EXPO_PUBLIC_DEEPSEEK_API_KEY");

      const history = messages.concat(userMsg).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: DEEPSEEK_MODEL, messages: history, temperature: 0.3 }),
      });

      const json = await res.json();
      const rawReply = json?.choices?.[0]?.message?.content ?? "Sorry, I couldn’t generate a reply.";
      const maybePlan = safeParsePlan(rawReply);

      if (maybePlan) {
        const botId = `${Date.now()}-bot`;
        const botMsg: Msg = {
          id: botId,
          role: "assistant",
          content: maybePlan.message,
          actions: maybePlan.actions.map((a) => ({ text: a.text, time: a.time, checked: false })),
        };
        setMessages((p) => [...p, botMsg]);
        saveToCloud(botMsg);
        if (uid && botMsg.actions?.length) {
          await savePlanToCloud(uid, botId, botMsg.actions);
        }
      } else {
        const botMsg: Msg = { id: `${Date.now()}-bot`, role: "assistant", content: rawReply };
        setMessages((p) => [...p, botMsg]);
        saveToCloud(botMsg);
      }

      scrollToEnd();
    } catch {
      const errMsg: Msg = {
        id: `${Date.now()}-err`,
        role: "assistant",
        content: "Config/network issue. Check your DeepSeek key or connection and try again.",
      };
      setMessages((p) => [...p, errMsg]);
      saveToCloud(errMsg);
    } finally {
      setSending(false);
    }
  }, [input, sending, messages, scrollToEnd, saveToCloud, uid]);

  // Toggle an action on a specific message
  const toggleAction = useCallback(
    async (messageId: string, actionIndex: number) => {
      setMessages((prev) => {
        const next = prev.map((m) => {
          if (m.id !== messageId || !m.actions) return m;
          const actions = m.actions.map((a, idx) =>
            idx === actionIndex ? { ...a, checked: !a.checked } : a
          );
          return { ...m, actions };
        });
        return next;
      });

      // Persist to cloud & local (local handled by useEffect)
      const msg = messages.find((m) => m.id === messageId);
      const updated = msg?.actions
        ? msg.actions.map((a, idx) => (idx === actionIndex ? { ...a, checked: !a.checked } : a))
        : undefined;

      if (uid && updated) {
        await updatePlanCheckedInCloud(uid, messageId, updated);
      }
    },
    [messages, uid]
  );

const onAddSelected = useCallback(
  async (messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg?.actions || msg.actions.length === 0) return;

    const chosen = msg.actions.filter((a) => a.checked);
    if (chosen.length === 0) return;

    const user = auth().currentUser;
    const currUid = user?.uid;
    if (!currUid) {
      const info: Msg = {
        id: `${Date.now()}-err`,
        role: "assistant",
        content: "Please sign in to create reminders.",
      };
      setMessages((p) => [...p, info]);
      saveToCloud(info);
      return;
    }

    // 1) Schedule selected reminders
    for (const act of chosen) {
      await scheduleAndSaveReminder(currUid, act.text, act.time);
    }

    // 2) Remove selected actions from the message
    const remaining = (msg.actions || []).filter((a) => !a.checked);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, actions: remaining.length ? remaining : undefined } : m
      )
    );

    // 3) Persist updated actions in Firestore (or delete the doc if none left)
    if (uid) {
      const sugRef = firestore()
        .collection("users")
        .doc(uid)
        .collection("mindbotSuggestions")
        .doc(messageId);

      if (remaining.length > 0) {
        await updatePlanCheckedInCloud(uid, messageId, remaining);
      } else {
        // No actions left for this message -> remove its suggestions doc
        await sugRef.delete().catch(() => {});
      }
    }

    // 4) Confirm in chat
    const confirm: Msg = {
      id: `${Date.now()}-added`,
      role: "assistant",
      content: `Added ${chosen.length} reminder${chosen.length > 1 ? "s" : ""}.`,
    };
    setMessages((p) => [...p, confirm]);
    saveToCloud(confirm);
    scrollToEnd();
  },
  [messages, saveToCloud, uid]
);


  const keyboardOffset = Math.max(0, inputBarH + insets.bottom - 19);

  const renderItem = ({ item }: { item: Msg }) => {
    const isUser = item.role === "user";
    return (
      <View>
        <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleBot]}>
          <Text style={[s.text, isUser ? s.textUser : s.textBot]}>{item.content}</Text>
        </View>

        {/* Per-message checklist (assistant only) */}
        {item.role === "assistant" && item.actions && item.actions.length > 0 && (
          <View style={s.planCard}>
            <Text style={s.planTitle}>Suggested actions</Text>
            <View style={{ gap: 10 }}>
              {item.actions.map((a, i) => {
                const checked = !!a.checked;
                return (
                  <TouchableOpacity
                    key={`${item.id}-${i}-${a.text}`}
                    style={[s.planItem, checked && s.planItemSelected]}
                    onPress={() => toggleAction(item.id, i)}
                    activeOpacity={0.8}
                  >
                    <View style={s.checkbox}>
                      <View style={[s.dot, checked && s.dotOn]} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.planText}>{a.text}</Text>
                      <Text style={s.planSub}>{a.time}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={s.cta} onPress={() => onAddSelected(item.id)}>
              <Text style={s.ctaText}>Add selected to reminders</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Footer: typing indicator while fetching
  const ListFooter = () =>
    sending ? (
      <View style={[s.bubble, s.bubbleBot, { alignSelf: "flex-start" }]}>
        <TypingDots />
      </View>
    ) : (
      <View style={{ height: 4 }} />
    );

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardOffset}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.inner}>
          <FlatList
            ref={listRef}
            style={s.chatList}
            data={visible}
            renderItem={renderItem}
            keyExtractor={(m) => m.id}
            ListFooterComponent={ListFooter}
            scrollEnabled
            keyboardDismissMode="on-drag"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={[s.list, { paddingBottom: inputBarH + insets.bottom }]}
            scrollIndicatorInsets={{ bottom: inputBarH + insets.bottom }}
            onContentSizeChange={scrollToEnd}
            keyboardShouldPersistTaps="handled"
            maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          />

          <View style={s.inputBar} onLayout={onInputBarLayout}>
            <TextInput
              style={s.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor={theme.secondaryAccent}
              multiline
              textAlignVertical="top"
              autoCorrect
              autoCapitalize="sentences"
              selectionColor={theme.secondary}
              onFocus={scrollToEnd}
            />
            <TouchableOpacity
              style={[s.sendBtn, sending && { opacity: 0.7 }]}
              onPress={onSend}
              disabled={sending}
              activeOpacity={0.8}
            >
              {sending ? <ActivityIndicator color={theme.secondary} /> : <Text style={s.send}>➤</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.primary },
    inner: { flex: 1 },
    chatList: { flex: 1 },
    list: { paddingHorizontal: 16, paddingTop: 12, gap: 8, backgroundColor: theme.primary },

    bubble: {
      maxWidth: "88%",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 14,
      marginVertical: 4,
    },
    bubbleUser: {
      alignSelf: "flex-end",
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    bubbleBot: {
      alignSelf: "flex-start",
      backgroundColor: theme.primaryAccent,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    text: { fontSize: 15, lineHeight: 20 },
    textUser: { color: theme.secondary },
    textBot: { color: theme.secondary, opacity: 0.95 },

    // typing dots
    dotsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 2,
    },
    dotTyping: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.secondary,
    },

    // per-message plan card
    planCard: {
      marginHorizontal: 0,
      marginTop: 4,
      marginBottom: 8,
      padding: 14,
      borderRadius: 16,
      backgroundColor: theme.primaryAccent,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      gap: 12,
    },
    planTitle: { color: theme.secondary, fontSize: 16, fontWeight: "600" },
    planItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 10,
      borderRadius: 12,
      backgroundColor: theme.primary,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
    },
    planItemSelected: { backgroundColor: theme.surfaceAccent },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.secondary,
      alignItems: "center",
      justifyContent: "center",
    },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "transparent" },
    dotOn: { backgroundColor: theme.secondary },
    planText: { color: theme.secondary, fontSize: 15, fontWeight: "600" },
    planSub: { color: theme.secondaryAccent, fontSize: 12, marginTop: 2 },

    // input
    inputBar: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border,
      backgroundColor: theme.primaryAccent,
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 140,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.surfaceAccent,
      color: theme.secondary,
    },
    sendBtn: {
      height: 44,
      minWidth: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surface,
    },
    send: { color: theme.secondary, fontSize: 18, fontWeight: "700", marginTop: 1 },
    // centered pill CTA
  cta: {
    alignSelf: "center",
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: theme.surface,
    borderRadius: 999,          // full pill
    minWidth: "70%",            // nice wide pill
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  });

export default MindBot;
