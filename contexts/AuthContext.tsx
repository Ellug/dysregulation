"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { app, db } from "@/lib/firebase";

interface ExtendedUser {
  uid: string;
  email: string;
  name: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  friends: string[];
  picture: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const auth = getAuth(app);

  const fetchUserProfile = async (firebaseUser: User) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      setUser({
        uid: firebaseUser.uid,
        email: data.email,
        name: data.name,
        createdAt: data.createdAt,
        lastLogin: data.lastLogin,
        friends: data.friends,
        picture: data.picture
      });
    } else {
      const newUser: ExtendedUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "",
        createdAt: serverTimestamp() as Timestamp,
        lastLogin: serverTimestamp() as Timestamp,
        friends: [],
        picture: firebaseUser.photoURL || ""
      };

      await setDoc(userRef, newUser);
      setUser(newUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) await fetchUserProfile(firebaseUser);
      else setUser(null);
    });
    return () => unsubscribe();
  }, [auth]);

  const loginWithEmail = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserProfile(cred.user);
  };

  const signupWithEmail = async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await fetchUserProfile(cred.user);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await fetchUserProfile(cred.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithEmail, signupWithEmail, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};