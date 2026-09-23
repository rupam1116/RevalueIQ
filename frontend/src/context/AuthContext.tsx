"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { fetchWithAuth } from "@/lib/api";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";

export interface MongoUserProfile {
  phone?: string;
  avatar_url?: string;
  bio?: string;
  city?: string;
  country?: string;
  occupation?: string;
  organization?: string;
  circular_score?: number;
  circular_grade?: string;
  co2_saved_kg?: number;
  ewaste_prevented_kg?: number;
  karma_points?: number;
  level?: number;
}

export interface MongoUser {
  id: string;
  firebase_uid: string;
  email: string;
  display_name: string;
  photo_url?: string;
  role: string;
  status: string;
  is_active: boolean;
  is_verified: boolean;
  created_at?: string;
  last_login_at?: string;
  profile?: MongoUserProfile;
}

export interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  mongoUser: MongoUser | null;
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<FirebaseUser>;
  signup: (fullName: string, email: string, password?: string) => Promise<FirebaseUser>;
  loginWithGoogle: () => Promise<FirebaseUser>;
  verifyEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: (forceRefresh?: boolean) => Promise<string | null>;
  syncWithBackend: (token: string, extraData?: any) => Promise<MongoUser | null>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  mongoUser: null,
  user: null,
  loading: true,
  login: async () => ({} as FirebaseUser),
  signup: async () => ({} as FirebaseUser),
  loginWithGoogle: async () => ({} as FirebaseUser),
  verifyEmail: async () => { },
  sendPasswordReset: async () => { },
  logout: async () => { },
  getToken: async () => null,
  syncWithBackend: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [mongoUser, setMongoUser] = useState<MongoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const syncWithBackend = async (token: string, extraData?: any): Promise<MongoUser | null> => {
    try {
      let currentToken = token;
      let res = await fetchWithAuth("/api/v1/auth/sync", currentToken, {
        method: "POST",
        body: JSON.stringify(extraData || {}),
      });

      if (res.status === 401 && auth.currentUser) {
        try {
          const freshToken = await auth.currentUser.getIdToken(true);
          if (freshToken) {
            currentToken = freshToken;
            res = await fetchWithAuth("/api/v1/auth/sync", currentToken, {
              method: "POST",
              body: JSON.stringify(extraData || {}),
            });
          }
        } catch (refreshErr) {
          console.warn("Failed to refresh token during sync:", refreshErr);
        }
      }

      if (res.ok) {
        const data: MongoUser = await res.json();
        setMongoUser(data);
        console.log("Backend auth sync succeeded");
        return data;
      } else {
        console.warn("Backend auth sync failed: HTTP status", res.status);
      }
    } catch (err) {
      console.warn("Backend unavailable");
    }
    return null;
  };

  // 1. Firebase Auth Observer & MongoDB Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          await syncWithBackend(token);
        } catch (e) {
          console.warn("Failed to get ID token during auth state change:", e);
        }
      } else {
        setMongoUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. SaaS Route Protection Engine
  useEffect(() => {
    if (loading) return;

    // Public guest routes (ONLY for unauthenticated visitors)
    const publicGuestRoutes = [
      "/",
      "/login",
      "/signup",
      "/forgot-password",
      "/verify-email",
      "/register",
      "/reset-password",
    ];

    const isPublicGuestRoute = publicGuestRoutes.some(
      (route) => pathname === route || (route !== "/" && pathname.startsWith(route))
    );

    const isAppRoute = pathname.startsWith("/app");
    const isLegacyProtectedRoute = [
      "/dashboard",
      "/valuation",
      "/repair",
      "/marketplace",
      "/repair-shops",
      "/donation",
      "/community",
      "/history",
      "/profile",
      "/settings",
      "/upload",
    ].some((route) => pathname.startsWith(route));

    // Rule A: Authenticated user attempting to access ANY public route (including Landing Page "/") -> Redirect to "/app"
    if (firebaseUser && isPublicGuestRoute) {
      router.replace("/app");
      return;
    }

    // Rule B: Authenticated user on legacy route -> Redirect to corresponding "/app" workspace view
    if (firebaseUser && isLegacyProtectedRoute) {
      const subPath = pathname.replace(/^\//, "");
      router.replace(`/app?tab=${subPath}`);
      return;
    }

    // Rule C: Unauthenticated guest trying to access any protected route -> Redirect to "/" (Landing Page)
    if (!firebaseUser && (isAppRoute || isLegacyProtectedRoute)) {
      router.replace("/");
      return;
    }
  }, [firebaseUser, loading, pathname, router]);

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error("Password is required.");
    const res = await signInWithEmailAndPassword(auth, email, password);
    const token = await res.user.getIdToken();
    await syncWithBackend(token);
    return res.user;
  };

  const signup = async (fullName: string, email: string, password?: string) => {
    if (!password) throw new Error("Password is required.");
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (res.user && fullName) {
      await updateProfile(res.user, { displayName: fullName }).catch(() => { });
    }
    const token = await res.user.getIdToken();
    await syncWithBackend(token, { full_name: fullName });
    return res.user;
  };

  const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    const token = await res.user.getIdToken();
    await syncWithBackend(token);
    return res.user;
  };

  const verifyEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("SignOut error:", e);
    }
    setFirebaseUser(null);
    setMongoUser(null);
    router.replace("/");
  };

  const getToken = async (forceRefresh = false) => {
    if (auth.currentUser) {
      try {
        return await auth.currentUser.getIdToken(forceRefresh);
      } catch (e) {
        console.warn("Failed to get Firebase ID token:", e);
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        mongoUser,
        user: firebaseUser,
        loading,
        login,
        signup,
        loginWithGoogle,
        verifyEmail,
        sendPasswordReset,
        logout,
        getToken,
        syncWithBackend,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
