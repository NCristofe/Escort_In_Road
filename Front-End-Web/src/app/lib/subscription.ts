import { loadFromStorage, saveToStorage } from "./storage";

export type PlanId = "free" | "premium";

export type InvoiceStatus = "paid" | "pending" | "failed";

export type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
};

export type Subscription = {
  plan: PlanId;
  since: string;
  renewsAt: string | null;
  invoices: Invoice[];
};

export type CheckoutPayment = {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

const subscriptionsKey = "escort-subscriptions";
const PREMIUM_PRICE = 199;

function readAll(): Record<string, Subscription> {
  return loadFromStorage<Record<string, Subscription>>(subscriptionsKey, {});
}

function writeAll(subscriptions: Record<string, Subscription>) {
  saveToStorage(subscriptionsKey, subscriptions);
}

function defaultSubscription(): Subscription {
  return {
    plan: "free",
    since: new Date().toISOString(),
    renewsAt: null,
    invoices: [],
  };
}

export function getSubscription(email: string): Subscription {
  const all = readAll();
  return all[email] ?? defaultSubscription();
}

export function upgradeToPremium(email: string, payment: CheckoutPayment): Subscription {
  const all = readAll();
  const now = new Date();
  const renewsAt = new Date(now);
  renewsAt.setDate(renewsAt.getDate() + 30);

  const last4 = payment.cardNumber.replace(/\D/g, "").slice(-4);

  const invoice: Invoice = {
    id: `FAT-${now.getTime()}`,
    date: now.toISOString(),
    description: `Assinatura Premium - cartao final ${last4 || "0000"}`,
    amount: PREMIUM_PRICE,
    status: "paid",
  };

  const current = all[email] ?? defaultSubscription();
  const next: Subscription = {
    plan: "premium",
    since: current.plan === "premium" ? current.since : now.toISOString(),
    renewsAt: renewsAt.toISOString(),
    invoices: [invoice, ...current.invoices],
  };

  all[email] = next;
  writeAll(all);
  return next;
}

export function cancelPremium(email: string): Subscription {
  const all = readAll();
  const current = all[email] ?? defaultSubscription();
  const next: Subscription = {
    ...current,
    plan: "free",
    renewsAt: null,
  };
  all[email] = next;
  writeAll(all);
  return next;
}

export { PREMIUM_PRICE };
