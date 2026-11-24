import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
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

/**
 * Sessao com prazo. Antes ela ficava salva sem validade, e quem entrou uma vez
 * como admin num navegador continuava admin para sempre ao abrir o site.
 */
const sessionKey = "escort-auth-session";
/** Formato antigo (sem prazo). Apagado no carregamento para derrubar sessoes eternas. */
const legacySessionKey = "escort-auth-user";
/** Sem nenhuma interacao por este tempo, a sessao expira. */
export const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
/** Mesmo com uso continuo, e preciso entrar de novo depois disto. */
export const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;
/** Intervalo minimo entre gravacoes de "ultima atividade". */
const ACTIVITY_WRITE_INTERVAL_MS = 60 * 1000;

type StoredSession = { user: AuthUser; loginAt: number; lastActiveAt: number };

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

function removeKey(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // storage indisponivel: nada salvo para remover
  }
}

function isSessionValid(session: StoredSession, now = Date.now()) {
  return (
    now - session.loginAt < SESSION_MAX_AGE_MS &&
    now - session.lastActiveAt < SESSION_IDLE_TIMEOUT_MS &&
    // relogio adiantado ou dado adulterado: nao confia
    session.loginAt <= now &&
    session.lastActiveAt <= now
  );
}

/** Sessao salva, se ainda estiver no prazo e a conta ainda existir. Caso contrario, apaga. */
function readSession(): StoredSession | null {
  removeKey(legacySessionKey);

  const session = loadFromStorage<StoredSession | null>(sessionKey, null);
  if (
    !session ||
    typeof session.loginAt !== "number" ||
    typeof session.lastActiveAt !== "number" ||
    !session.user?.email ||
    !isSessionValid(session) ||
    !findAccount(session.user.email)
  ) {
    removeKey(sessionKey);
    return null;
  }
  return session;
}

function clearSession() {
  removeKey(sessionKey);
  removeKey(legacySessionKey);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    ensureSeeded();
    return readSession()?.user ?? null;
  });

  // Enquanto houver sessao: renova a "ultima atividade" quando a pessoa usa a
  // pagina e encerra a sessao assim que o prazo vencer, mesmo com a aba aberta.
  useEffect(() => {
    if (!user) return;

    let lastWrite = 0;
    const touch = () => {
      const now = Date.now();
      if (now - lastWrite < ACTIVITY_WRITE_INTERVAL_MS) return;

      const session = loadFromStorage<StoredSession | null>(sessionKey, null);
      if (!session || !isSessionValid(session, now)) return;

      lastWrite = now;
      saveToStorage(sessionKey, { ...session, lastActiveAt: now });
    };

    const check = () => {
      if (!readSession()) setUser(null);
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      check();
      touch();
    };

    // Login/logout em outra aba vale para esta tambem.
    const onStorage = (event: StorageEvent) => {
      if (event.key === sessionKey || event.key === null) check();
    };

    const activityEvents = ["pointerdown", "keydown", "scroll"] as const;
    activityEvents.forEach((name) => window.addEventListener(name, touch, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);
    const timer = window.setInterval(check, 30 * 1000);

    return () => {
      activityEvents.forEach((name) => window.removeEventListener(name, touch));
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
      window.clearInterval(timer);
    };
  }, [user]);

  const value = useMemo<AuthContextValue>(() => {
    /**
     * Guarda a sessao e devolve a conta, sem a senha.
     * Num login, comeca um prazo novo; ao atualizar o perfil, mantem o prazo atual.
     */
    function startSession(account: StoredAccount, { renew = true } = {}) {
      const nextUser = toSessionUser(account);
      const now = Date.now();
      const current = renew ? null : loadFromStorage<StoredSession | null>(sessionKey, null);
      const session: StoredSession = {
        user: nextUser,
        loginAt: current?.loginAt ?? now,
        lastActiveAt: now,
      };
      saveToStorage(sessionKey, session);
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
        clearSession();
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
        startSession(nextAccount, { renew: false });
        return true;
      },

      updateName: (name) => {
        if (!user) return { message: "Sessão expirada. Entre novamente." };

        const trimmed = name.trim();
        if (trimmed.length < 3) return { message: "O nome precisa ter pelo menos 3 caracteres." };

        const account = findAccount(user.email);
        if (!account) return { message: "Conta não encontrada." };

        writeAccount({ ...account, name: trimmed });
        startSession({ ...account, name: trimmed }, { renew: false });
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

        clearSession();
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
