"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { SessionUser } from "@/lib/types/auth";

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  setAuthenticatedUser: (user: SessionUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: SessionUser | null;
}) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading: false, setAuthenticatedUser: setUser, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden.");
  }
  return context;
}
