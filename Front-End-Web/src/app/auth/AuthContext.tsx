import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { loadFromStorage, saveToStorage } from "../lib/storage";

export type Role = "admin" | "empresa" | "motorista";

export type AuthUser = {
  name: string;
  email: string;
  role: Role;
};

type StoredAccount = AuthUser & { password: string };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: Extract<Role, "empresa" | "motorista">) => boolean;
  logout: () => void;
};

const sessionKey = "escort-auth-user";
const accountsKey = "escort-auth-accounts";

const seedAdmin: StoredAccount = {
  name: "Administrador",
  email: "admin@escortinroad.com.br",
  password: "admin123",
  role: "admin",
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function findAccount(email: string) {
  const normalized = normalizeEmail(email);
  if (normalized === seedAdmin.email) return seedAdmin;

  const accounts = loadFromStorage<StoredAccount[]>(accountsKey, []);
  return accounts.find((account) => normalizeEmail(account.email) === normalized);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadFromStorage<AuthUser | null>(sessionKey, null));

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (email: string, password: string) => {
        const account = findAccount(email);
        if (!account || account.password !== password) return false;

        const nextUser: AuthUser = { name: account.name, email: account.email, role: account.role };
        saveToStorage(sessionKey, nextUser);
        setUser(nextUser);
        return true;
      },
      register: (name: string, email: string, password: string, role: Extract<Role, "empresa" | "motorista">) => {
        if (!name.trim() || !email.trim() || password.trim().length < 6) return false;
        if (findAccount(email)) return false;

        const accounts = loadFromStorage<StoredAccount[]>(accountsKey, []);
        const nextAccount: StoredAccount = { name: name.trim(), email: email.trim(), password, role };
        saveToStorage(accountsKey, [...accounts, nextAccount]);

        const nextUser: AuthUser = { name: nextAccount.name, email: nextAccount.email, role: nextAccount.role };
        saveToStorage(sessionKey, nextUser);
        setUser(nextUser);
        return true;
      },
      logout: () => {
        localStorage.removeItem(sessionKey);
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
