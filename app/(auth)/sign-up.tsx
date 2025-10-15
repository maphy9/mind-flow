import EmailSignUp from "@/components/auth/EmailSignUp";
import GoogleLogin from "@/components/auth/GoogleLogin";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <EmailSignUp />

      <GoogleLogin />
    </SafeAreaView>
  );
};

export default SignUp;
