import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type AuthUser = {
  name: string;
  email: string;
  role: "admin";
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
};

const storageKey = "escort-auth-user";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem(storageKey);
    return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (email: string, password: string) => {
        if (!email.trim() || !password.trim()) return false;

        const nextUser: AuthUser = {
          name: email.split("@")[0] || "Administrador",
          email: email.trim(),
          role: "admin",
        };

        localStorage.setItem(storageKey, JSON.stringify(nextUser));
        setUser(nextUser);
        return true;
      },
      register: (name: string, email: string, password: string) => {
        if (!name.trim() || !email.trim() || password.trim().length < 6) return false;

        const nextUser: AuthUser = {
          name: name.trim(),
          email: email.trim(),
          role: "admin",
        };

        localStorage.setItem(storageKey, JSON.stringify(nextUser));
        setUser(nextUser);
        return true;
      },
      logout: () => {
        localStorage.removeItem(storageKey);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
