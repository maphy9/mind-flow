// app/(main)/mind-bot.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/themeContext";
import Text from "@/components/general/Text";

type Role = "user" | "assistant" | "system";
type Msg = { id: string; role: Role; content: string };

const SYSTEM_PROMPT =
  "You are MindBot, a warm, concise mental-wellness guide. Keep replies short and practical.";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

const MindBot: React.FC = () => {
  const { theme } = useTheme();
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();

  const listRef = useRef<FlatList<Msg>>(null);
  const [messages, setMessages] = useState<Msg[]>([
    { id: "sys", role: "system", content: SYSTEM_PROMPT },
    { id: "hello", role: "assistant", content: "Hi, how can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [inputBarH, setInputBarH] = useState(56);

  const visible = useMemo(
    () => messages.filter((m) => m.role !== "system"),
    [messages]
  );

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() =>
      listRef.current?.scrollToEnd({ animated: true })
    );
  }, []);

  const onInputBarLayout = (e: LayoutChangeEvent) => {
    const h = Math.max(48, Math.round(e.nativeEvent.layout.height));
    if (h !== inputBarH) setInputBarH(h);
  };

  const onSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: Msg = { id: String(Date.now()), role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setSending(true);
    scrollToEnd();

    try {
      const apiKey = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
      if (!apiKey) throw new Error("Missing EXPO_PUBLIC_DEEPSEEK_API_KEY");

      const payloadMessages = messages.concat(userMsg).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: DEEPSEEK_MODEL,
          messages: payloadMessages,
          temperature: 0.4,
        }),
      });

      const json = await res.json();
      const reply =
        json?.choices?.[0]?.message?.content?.trim() ??
        "Sorry, I couldn’t generate a reply.";

      setMessages((p) => [
        ...p,
        { id: `${Date.now()}-bot`, role: "assistant", content: reply },
      ]);
      scrollToEnd();
    } catch {
      setMessages((p) => [
        ...p,
        {
          id: `${Date.now()}-err`,
          role: "assistant",
          content:
            "Config/network issue. Check your DeepSeek key or connection and try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }, [input, sending, messages, scrollToEnd]);

  // 🧮 Slightly smaller offset to remove the visual gap
  const keyboardOffset = Math.max(0, inputBarH + insets.bottom - 19);

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
            data={visible}
            renderItem={({ item }) => {
              const isUser = item.role === "user";
              return (
                <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleBot]}>
                  <Text style={[s.text, isUser ? s.textUser : s.textBot]}>
                    {item.content}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(m) => m.id}
            contentContainerStyle={[
              s.list,
              { paddingBottom: inputBarH + insets.bottom },
            ]}
            onContentSizeChange={scrollToEnd}
            keyboardShouldPersistTaps="handled"
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
              {sending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.send}>➤</Text>
              )}
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
    inner: { flex: 1, justifyContent: "space-between" },
    list: {
      paddingHorizontal: 16,
      paddingTop: 12,
      gap: 8,
      backgroundColor: theme.primary,
    },
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
      backgroundColor: theme.secondary,
    },
    send: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 1 },
  });

export default MindBot;
