import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  name: string;
  email: string;
  role: "admin";
  phone?: string;
  company?: string;
  jobTitle?: string;
};

export type ProfileChanges = Partial<Pick<AuthUser, "name" | "email" | "phone" | "company" | "jobTitle">>;

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  updateProfile: (changes: ProfileChanges) => boolean;
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
      updateProfile: (changes: ProfileChanges) => {
        if (!user) return false;
        if (changes.name !== undefined && !changes.name.trim()) return false;
        if (changes.email !== undefined && !changes.email.trim()) return false;

        const nextUser: AuthUser = {
          ...user,
          ...Object.fromEntries(
            Object.entries(changes).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]),
          ),
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
