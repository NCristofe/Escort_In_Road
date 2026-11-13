import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { panelItems, type PanelPath } from "../data/panels";

export type FontScale = "small" | "normal" | "large" | "xlarge";

export type NotificationChannel = "email" | "sms" | "whatsapp";
export type NotificationEvent =
  | "cargoStatus"
  | "delays"
  | "deliveries"
  | "documents"
  | "weeklyReport";

export type Settings = {
  notifications: {
    channels: Record<NotificationChannel, boolean>;
    events: Record<NotificationEvent, boolean>;
  };
  /** Página aberta depois do login, quando o usuário não veio de uma rota protegida. */
  homePage: PanelPath;
  /** Painéis escondidos do menu "Painéis" (continuam acessíveis pela URL). */
  hiddenPanels: PanelPath[];
  fontScale: FontScale;
  reduceMotion: boolean;
  analyticsCookies: boolean;
};

export const defaultSettings: Settings = {
  notifications: {
    channels: { email: true, sms: false, whatsapp: false },
    events: {
      cargoStatus: true,
      delays: true,
      deliveries: true,
      documents: true,
      weeklyReport: false,
    },
  },
  homePage: "/admin-usuarios",
  hiddenPanels: [],
  fontScale: "normal",
  reduceMotion: false,
  analyticsCookies: false,
};

export const fontScalePx: Record<FontScale, number> = {
  small: 14,
  normal: 16,
  large: 18,
  xlarge: 20,
};

type SettingsContextValue = {
  settings: Settings;
  updateSettings: (changes: Partial<Settings>) => void;
  resetSettings: () => void;
};

export const settingsStorageKey = "escort-settings";
const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const validPanelPaths = new Set<string>(panelItems.map((item) => item.path));

function readStoredSettings(): Settings {
  try {
    const raw = localStorage.getItem(settingsStorageKey);
    if (!raw) return defaultSettings;
    const stored = JSON.parse(raw) as Partial<Settings>;

    return {
      ...defaultSettings,
      ...stored,
      notifications: {
        channels: { ...defaultSettings.notifications.channels, ...stored.notifications?.channels },
        events: { ...defaultSettings.notifications.events, ...stored.notifications?.events },
      },
      homePage:
        stored.homePage && validPanelPaths.has(stored.homePage) ? stored.homePage : defaultSettings.homePage,
      hiddenPanels: (stored.hiddenPanels ?? []).filter((path) => validPanelPaths.has(path)),
      fontScale: stored.fontScale && stored.fontScale in fontScalePx ? stored.fontScale : defaultSettings.fontScale,
    };
  } catch {
    return defaultSettings;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => readStoredSettings());

  useEffect(() => {
    try {
      localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
    } catch {
      // Sem armazenamento disponível (modo privado, etc.): as preferências valem só nesta sessão.
    }
  }, [settings]);

  // Aplica as preferências de acessibilidade no documento inteiro.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--font-size", `${fontScalePx[settings.fontScale]}px`);
    root.classList.toggle("reduce-motion", settings.reduceMotion);
  }, [settings.fontScale, settings.reduceMotion]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      updateSettings: (changes) => setSettings((current) => ({ ...current, ...changes })),
      resetSettings: () => setSettings(defaultSettings),
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used inside SettingsProvider");
  return context;
}
