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

type StoredAccount = { name: string; email: string; role: Role; password: string };

/** Falha de operacao da conta, com texto pronto para a tela. */
export type AccountError = { message: string };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Devolve a conta autenticada, para quem precisa do perfil logo apos o login. */
  login: (email: string, password: string) => AuthUser | null;
  register: (
    name: string,
    email: string,
    password: string,
    role: Extract<Role, "empresa" | "motorista">,
  ) => AuthUser | null;
  logout: () => void;
  /** Atualiza nome e dados complementares (telefone, empresa, cargo). */
  updateProfile: (changes: ProfileChanges) => boolean;
  /** Null em caso de sucesso; com erro, a mensagem a exibir. */
  updateName: (name: string) => AccountError | null;
  changePassword: (current: string, next: string) => AccountError | null;
  deleteAccount: () => void;
};

const sessionKey = "escort-auth-user";
const accountsKey = "escort-auth-accounts";
/** Marca que as contas de demonstracao ja foram gravadas; sem isto, uma conta apagada voltaria. */
const seededKey = "escort-auth-seeded";
/** Dados complementares do perfil (telefone, empresa, cargo), por e-mail. */
const profilesKey = "escort-auth-profiles";

export const MIN_PASSWORD_LENGTH = 6;

/**
 * Contas de demonstracao.
 *
 * Elas sao gravadas no storage no primeiro carregamento, e nao consultadas como
 * constante: assim editar nome, trocar senha e encerrar conta funcionam nelas
 * como em qualquer outra. A tela de login anuncia estas tres.
 */
const seedAccounts: StoredAccount[] = [
  {
    name: "Administrador",
    email: "admin@escortinroad.com.br",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Transportadora Exemplo",
    email: "empresa@escortinroad.com.br",
    password: "empresa123",
    role: "empresa",
  },
  {
    name: "Motorista Exemplo",
    email: "motorista@escortinroad.com.br",
    password: "motorista123",
    role: "motorista",
  },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readAccounts() {
  return loadFromStorage<StoredAccount[]>(accountsKey, []);
}

/**
 * Grava as contas de demonstracao uma unica vez, preservando o que ja existir.
 * O flag evita que uma conta de demonstracao encerrada reapareca no refresh.
 */
function ensureSeeded() {
  if (loadFromStorage<boolean>(seededKey, false)) return readAccounts();

  const existing = readAccounts();
  const missing = seedAccounts.filter(
    (seed) => !existing.some((account) => normalizeEmail(account.email) === seed.email),
  );
  const merged = [...existing, ...missing];

  saveToStorage(accountsKey, merged);
  saveToStorage(seededKey, true);
  return merged;
}

function findAccount(email: string) {
  const normalized = normalizeEmail(email);
  return ensureSeeded().find((account) => normalizeEmail(account.email) === normalized) ?? null;
}

function writeAccount(account: StoredAccount) {
  const accounts = ensureSeeded().map((current) =>
    normalizeEmail(current.email) === normalizeEmail(account.email) ? account : current,
  );
  saveToStorage(accountsKey, accounts);
}

type ExtraDetails = Omit<ProfileDetails, "name">;

function loadProfiles() {
  return loadFromStorage<Record<string, ExtraDetails>>(profilesKey, {});
}

/** O nome vem sempre da conta; o perfil guarda so os dados complementares. */
function toSessionUser(account: StoredAccount): AuthUser {
  const extra = loadProfiles()[normalizeEmail(account.email)] ?? {};
  return {
    phone: extra.phone,
    company: extra.company,
    jobTitle: extra.jobTitle,
    name: account.name,
    email: account.email,
    role: account.role,
  };
}

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    ensureSeeded();
    return loadFromStorage<AuthUser | null>(sessionKey, null);
  });

  const value = useMemo<AuthContextValue>(() => {
    /** Guarda a sessao e devolve a conta, sem a senha. */
    function startSession(account: StoredAccount) {
      const nextUser = toSessionUser(account);
      saveToStorage(sessionKey, nextUser);
      setUser(nextUser);
      return nextUser;
    }

    return {
      user,
      isAuthenticated: Boolean(user),

      login: (email, password) => {
        const account = findAccount(email);
        if (!account || account.password !== password) return null;
        return startSession(account);
      },

      register: (name, email, password, role) => {
        if (!name.trim() || !email.trim() || password.trim().length < MIN_PASSWORD_LENGTH) return null;
        if (findAccount(email)) return null;

        const nextAccount: StoredAccount = {
          name: name.trim(),
          email: normalizeEmail(email),
          password,
          role,
        };
        saveToStorage(accountsKey, [...ensureSeeded(), nextAccount]);
        return startSession(nextAccount);
      },

      logout: () => {
        localStorage.removeItem(sessionKey);
        setUser(null);
      },

      updateProfile: (changes) => {
        if (!user) return false;
        if (changes.name !== undefined && !changes.name.trim()) return false;

        const account = findAccount(user.email);
        if (!account) return false;

        const extra: ExtraDetails = {
          phone: "phone" in changes ? clean(changes.phone) : user.phone,
          company: "company" in changes ? clean(changes.company) : user.company,
          jobTitle: "jobTitle" in changes ? clean(changes.jobTitle) : user.jobTitle,
        };
        saveToStorage(profilesKey, { ...loadProfiles(), [normalizeEmail(user.email)]: extra });

        const nextAccount = { ...account, name: clean(changes.name) ?? account.name };
        writeAccount(nextAccount);
        startSession(nextAccount);
        return true;
      },

      updateName: (name) => {
        if (!user) return { message: "Sessão expirada. Entre novamente." };

        const trimmed = name.trim();
        if (trimmed.length < 3) return { message: "O nome precisa ter pelo menos 3 caracteres." };

        const account = findAccount(user.email);
        if (!account) return { message: "Conta não encontrada." };

        writeAccount({ ...account, name: trimmed });
        startSession({ ...account, name: trimmed });
        return null;
      },

      changePassword: (current, next) => {
        if (!user) return { message: "Sessão expirada. Entre novamente." };

        const account = findAccount(user.email);
        if (!account) return { message: "Conta não encontrada." };
        if (account.password !== current) return { message: "A senha atual está incorreta." };
        if (next.trim().length < MIN_PASSWORD_LENGTH) {
          return { message: `A nova senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` };
        }
        if (next === current) return { message: "A nova senha deve ser diferente da atual." };

        writeAccount({ ...account, password: next });
        return null;
      },

      deleteAccount: () => {
        if (!user) return;

        const email = normalizeEmail(user.email);
        const remaining = ensureSeeded().filter((account) => normalizeEmail(account.email) !== email);
        saveToStorage(accountsKey, remaining);

        const { [email]: _removed, ...otherProfiles } = loadProfiles();
        saveToStorage(profilesKey, otherProfiles);

        localStorage.removeItem(sessionKey);
        setUser(null);
      },
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
