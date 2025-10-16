import EmailLogin from "@/components/auth/EmailLogin";
import GoogleLogin from "@/components/auth/GoogleLogin";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser !== null) {
      router.push("/home");
    }
  }, [currentUser]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <EmailLogin />

      <GoogleLogin />
    </SafeAreaView>
  );
};

export default Login;
