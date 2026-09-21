import { loadFromStorage, saveToStorage } from "./storage";

export type ApiKeyStatus = "active" | "revoked";

export type ApiKey = {
  id: string;
  label: string;
  token: string;
  createdAt: string;
  lastUsed: string | null;
  status: ApiKeyStatus;
};

const apiKeysKey = "escort-api-keys";

function readAll(): Record<string, ApiKey[]> {
  return loadFromStorage<Record<string, ApiKey[]>>(apiKeysKey, {});
}

function writeAll(keys: Record<string, ApiKey[]>) {
  saveToStorage(apiKeysKey, keys);
}

function randomToken(): string {
  const segment = () => Math.random().toString(36).slice(2, 10);
  return `eir_live_${segment()}${segment()}`;
}

export function maskToken(token: string): string {
  return `${token.slice(0, 12)}${"•".repeat(12)}${token.slice(-4)}`;
}

export function getApiKeys(email: string): ApiKey[] {
  return readAll()[email] ?? [];
}

export function generateApiKey(email: string, label: string): ApiKey {
  const all = readAll();
  const current = all[email] ?? [];

  const key: ApiKey = {
    id: `KEY-${Date.now()}`,
    label: label.trim() || "Integracao ERP",
    token: randomToken(),
    createdAt: new Date().toISOString(),
    lastUsed: null,
    status: "active",
  };

  all[email] = [key, ...current];
  writeAll(all);
  return key;
}

export function revokeApiKey(email: string, id: string): void {
  const all = readAll();
  const current = all[email] ?? [];
  all[email] = current.map((key) => (key.id === id ? { ...key, status: "revoked" as const } : key));
  writeAll(all);
}
