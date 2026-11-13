import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { loadFromStorage, saveToStorage } from "../lib/storage";

export type Role = "admin" | "empresa" | "motorista";

/** Dados de perfil editáveis em Configurações > Perfil. */
export type ProfileDetails = {
  name: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
};

export type AuthUser = ProfileDetails & {
  email: string;
  role: Role;
};

export type ProfileChanges = Partial<ProfileDetails>;

export type ChangePasswordResult = "ok" | "wrong-password" | "demo-account";

type StoredAccount = { name: string; email: string; role: Role; password: string };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Retorna o usuário logado, ou null se e-mail/senha não conferem. */
  login: (email: string, password: string) => AuthUser | null;
  register: (name: string, email: string, password: string, role: Extract<Role, "empresa" | "motorista">) => boolean;
  updateProfile: (changes: ProfileChanges) => boolean;
  changePassword: (currentPassword: string, nextPassword: string) => ChangePasswordResult;
  logout: () => void;
};

const sessionKey = "escort-auth-user";
const accountsKey = "escort-auth-accounts";
/** Perfil editado por e-mail, para sobreviver a logout/login (inclusive da conta demo). */
const profilesKey = "escort-auth-profiles";

/** Contas de demonstração (as mesmas listadas na tela de login). A senha delas não pode ser trocada. */
export const demoAccounts: readonly StoredAccount[] = [
  { name: "Administrador", email: "admin@escortinroad.com.br", password: "admin123", role: "admin" },
  { name: "Empresa Demo", email: "empresa@escortinroad.com.br", password: "empresa123", role: "empresa" },
  { name: "Motorista Demo", email: "motorista@escortinroad.com.br", password: "motorista123", role: "motorista" },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function findDemoAccount(email: string) {
  const normalized = normalizeEmail(email);
  return demoAccounts.find((account) => account.email === normalized);
}

function findAccount(email: string) {
  const normalized = normalizeEmail(email);
  const demo = findDemoAccount(normalized);
  if (demo) return demo;

  const accounts = loadFromStorage<StoredAccount[]>(accountsKey, []);
  return accounts.find((account) => normalizeEmail(account.email) === normalized);
}

function loadProfiles() {
  return loadFromStorage<Record<string, ProfileDetails>>(profilesKey, {});
}

function toSessionUser(account: StoredAccount): AuthUser {
  const profile: Partial<ProfileDetails> = loadProfiles()[normalizeEmail(account.email)] ?? {};
  return { ...profile, name: profile.name ?? account.name, email: account.email, role: account.role };
}

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadFromStorage<AuthUser | null>(sessionKey, null));

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (email: string, password: string) => {
        const account = findAccount(email);
        if (!account || account.password !== password) return null;

        const nextUser = toSessionUser(account);
        saveToStorage(sessionKey, nextUser);
        setUser(nextUser);
        return nextUser;
      },
      register: (name: string, email: string, password: string, role: Extract<Role, "empresa" | "motorista">) => {
        if (!name.trim() || !email.trim() || password.trim().length < 6) return false;
        if (findAccount(email)) return false;

        const accounts = loadFromStorage<StoredAccount[]>(accountsKey, []);
        const nextAccount: StoredAccount = { name: name.trim(), email: email.trim(), password, role };
        saveToStorage(accountsKey, [...accounts, nextAccount]);

        const nextUser = toSessionUser(nextAccount);
        saveToStorage(sessionKey, nextUser);
        setUser(nextUser);
        return true;
      },
      updateProfile: (changes: ProfileChanges) => {
        if (!user) return false;
        if (changes.name !== undefined && !changes.name.trim()) return false;

        const profile: ProfileDetails = {
          name: clean(changes.name) ?? user.name,
          phone: "phone" in changes ? clean(changes.phone) : user.phone,
          company: "company" in changes ? clean(changes.company) : user.company,
          jobTitle: "jobTitle" in changes ? clean(changes.jobTitle) : user.jobTitle,
        };

        saveToStorage(profilesKey, { ...loadProfiles(), [normalizeEmail(user.email)]: profile });

        const nextUser: AuthUser = { ...user, ...profile };
        saveToStorage(sessionKey, nextUser);
        setUser(nextUser);
        return true;
      },
      changePassword: (currentPassword: string, nextPassword: string) => {
        const account = user && findAccount(user.email);
        if (!account || account.password !== currentPassword) return "wrong-password";
        if (findDemoAccount(account.email)) return "demo-account";

        const accounts = loadFromStorage<StoredAccount[]>(accountsKey, []);
        saveToStorage(
          accountsKey,
          accounts.map((stored) =>
            normalizeEmail(stored.email) === normalizeEmail(account.email) ? { ...stored, password: nextPassword } : stored,
          ),
        );
        return "ok";
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
