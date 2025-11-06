import { Tabs, useRouter } from "expo-router";
import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import {
  registerNotifications,
  scheduleDailyNotification,
} from "@/utils/notifications";
import { useEffect } from "react";
import { useAuth } from "@/context/authContext";

export default function TabLayout() {
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser == null) {
      return;
    }

    async function setupNotificationsAndHandleInitialLaunch() {
      const granted = await registerNotifications();
      if (granted) {
        await scheduleDailyNotification();
      }

      const response = Notifications.getLastNotificationResponse();
      if (response) {
        const { url } = response.notification.request.content.data as any;
        if (url) {
          const routePath = url.replace(/.*?:\/\//g, "/");
          router.replace(routePath);
        }
      }

      const subscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const { url } = response.notification.request.content.data as any;

          if (url) {
            const routePath = url.replace(/.*?:\/\//g, "/");
            router.push(routePath);
          }
        });

      return () => subscription.remove();
    }

    setupNotificationsAndHandleInitialLaunch();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.secondary,
        tabBarInactiveTintColor: theme.secondaryAccent,
        tabBarStyle: {
          backgroundColor: theme.surfaceAccent,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: theme.surfaceAccent,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
        },
        headerTintColor: theme.secondary,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        sceneStyle: {
          backgroundColor: theme.primary,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calm-spots"
        options={{
          title: "Calm Spots",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mind-bot"
        options={{
          title: "Mind Bot",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: "Reminders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          href: null,
          headerShown: false ,
        }}
      />
      <Tabs.Screen
              name="tables"
              options={{
                href: null,
                title: "Your Test Results",
              }}
            />
    </Tabs>
  );
}
