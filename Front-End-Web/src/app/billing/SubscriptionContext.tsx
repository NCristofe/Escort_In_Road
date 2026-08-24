import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  initialApiKeys,
  plans,
  secretPrefix,
  type ApiEnvironment,
  type ApiKey,
  type ApiScope,
  type BillingCycle,
  type PaymentMethodId,
  type PlanId,
} from "../data/billing";

export type SubscriptionState = {
  planId: PlanId;
  cycle: BillingCycle;
  /** Data da proxima cobranca, em ISO. Nulo no plano gratuito. */
  renewsAt: string | null;
  method: PaymentMethodId | null;
  /** Ultimos quatro digitos do cartao. Nunca guardamos o numero completo. */
  cardLast4: string | null;
  cardBrand: string | null;
  /** Assinatura cancelada segue ativa ate o fim do ciclo pago. */
  cancelAtPeriodEnd: boolean;
};

type UpgradeInput = {
  planId: PlanId;
  cycle: BillingCycle;
  method: PaymentMethodId;
  cardLast4?: string;
  cardBrand?: string;
};

type SubscriptionContextValue = {
  subscription: SubscriptionState;
  apiKeys: ApiKey[];
  isPremium: boolean;
  /** Teto de chaves ativas do plano vigente. */
  keyQuota: number;
  activeKeyCount: number;
  upgrade: (input: UpgradeInput) => void;
  cancelSubscription: () => void;
  resumeSubscription: () => void;
  downgradeToFree: () => void;
  createApiKey: (input: { name: string; environment: ApiEnvironment; scopes: ApiScope[]; secret: string }) => ApiKey;
  revokeApiKey: (id: string) => void;
};

const storageKey = "escort-subscription";
const keysStorageKey = "escort-api-keys";

const freeSubscription: SubscriptionState = {
  planId: "gratuito",
  cycle: "mensal",
  renewsAt: null,
  method: null,
  cardLast4: null,
  cardBrand: null,
  cancelAtPeriodEnd: false,
};

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Armazenamento indisponivel (aba anonima, cota cheia): a sessao segue em memoria.
  }
}

/** Soma um ciclo inteiro à data de hoje para estimar a proxima cobranca. */
function nextRenewal(cycle: BillingCycle) {
  const date = new Date();
  if (cycle === "anual") date.setFullYear(date.getFullYear() + 1);
  else date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionState>(() =>
    readStored(storageKey, freeSubscription),
  );
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => readStored(keysStorageKey, initialApiKeys));

  const update = useCallback((next: SubscriptionState) => {
    setSubscription(next);
    persist(storageKey, next);
  }, []);

  const updateKeys = useCallback((next: ApiKey[]) => {
    setApiKeys(next);
    persist(keysStorageKey, next);
  }, []);

  const value = useMemo<SubscriptionContextValue>(() => {
    const isPremium = subscription.planId === "premium";
    const activeKeys = apiKeys.filter((key) => !key.revokedAt);

    return {
      subscription,
      apiKeys,
      isPremium,
      keyQuota: plans[subscription.planId].limits.apiKeys,
      activeKeyCount: activeKeys.length,

      upgrade: ({ planId, cycle, method, cardLast4, cardBrand }) =>
        update({
          planId,
          cycle,
          renewsAt: nextRenewal(cycle),
          method,
          cardLast4: cardLast4 ?? null,
          cardBrand: cardBrand ?? null,
          cancelAtPeriodEnd: false,
        }),

      cancelSubscription: () => update({ ...subscription, cancelAtPeriodEnd: true }),
      resumeSubscription: () => update({ ...subscription, cancelAtPeriodEnd: false }),
      downgradeToFree: () => update(freeSubscription),

      createApiKey: ({ name, environment, scopes, secret }) => {
        const created: ApiKey = {
          id: `key_${secret.slice(-6)}`,
          name: name.trim(),
          environment,
          prefix: secretPrefix(secret),
          scopes,
          createdAt: new Date().toISOString().slice(0, 10),
          lastUsedAt: null,
          revokedAt: null,
        };
        updateKeys([created, ...apiKeys]);
        return created;
      },

      revokeApiKey: (id) =>
        updateKeys(
          apiKeys.map((key) =>
            key.id === id ? { ...key, revokedAt: new Date().toISOString().slice(0, 10) } : key,
          ),
        ),
    };
  }, [apiKeys, subscription, update, updateKeys]);

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error("useSubscription must be used inside SubscriptionProvider");
  return context;
}
