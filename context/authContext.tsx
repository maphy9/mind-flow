import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as _signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "react-native-google-signin";
import { useDispatch } from "react-redux";
import { showAlert } from "@/redux/states/alerts";

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const dispatch = useDispatch();

  function login(email, password) {
    signInWithEmailAndPassword(auth, email, password).catch(() => {
      dispatch(showAlert({ text: "Invalid credentials", type: "error" }));
    });
  }

  function signOut() {
    return _signOut(auth);
  }

  async function signUp(email, password) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      dispatch(showAlert({ text: "Success, try loggin in", type: "info" }));
      return true;
    } catch {
      dispatch(showAlert({ text: "Couldn't sign you up", type: "error" }));
      return false;
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      dispatch(
        showAlert({
          text: "Check your email",
          type: "info",
        })
      );
      return true;
    } catch {
      dispatch(
        showAlert({
          text: "Failed to send password reset link",
          type: "error",
        })
      );
      return false;
    }
  }

  async function loginWithGoogle() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.idToken;
    if (!idToken) {
      dispatch(showAlert({ text: "Something went wrong", type: "error" }));
      return false;
    }
    const googleCredential = GoogleAuthProvider.credential(idToken);

    signInWithCredential(auth, googleCredential).catch(() => {
      dispatch(
        showAlert({ text: "Couldn't login with google", type: "error" })
      );
    });
  }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      offlineAccess: true,
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user as any);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    signOut,
    signUp,
    resetPassword,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
