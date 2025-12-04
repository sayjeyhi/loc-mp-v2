import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import DEFAULT_LOCALIZATIONS from "@/assets/localizations/default_localization.json";

export type SettingType = {
  id: number;
  value: string;
  setting: {
    id: number;
    title: string;
    default_value: string;
  };
};

export type CompanySettings = {
  id: number;
  name: string;
  description: string;
  domain: string;
  settings: SettingType[];
  logo_url: string;
  mobile_logo_url: string;
  auth_bg_url?: string;
  localizations?: {
    id: number;
    key: string;
    value: null | string;
    defaultValue: string;
  }[];
  country: {
    id: number;
    name: string;
    symbol: string;
  };
};

interface SettingsState {
  localizations: {
    id: number;
    key: string;
    value: null;
    defaultValue: string;
  }[];
  settings: CompanySettings | null;
  isLoading: boolean;
  error: string | null;
  setSettings: (settings: CompanySettings) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: null,
      isLoading: false,
      error: null,
      localizations: DEFAULT_LOCALIZATIONS,
      setSettings: (settings: CompanySettings) =>
        set(() => ({
          settings,
          error: null,
        })),
      setLoading: (loading: boolean) =>
        set(() => ({
          isLoading: loading,
        })),
      setError: (error: string | null) =>
        set(() => ({
          error,
          isLoading: false,
        })),
      clearSettings: () =>
        set(() => ({
          settings: null,
          isLoading: false,
          error: null,
        })),
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    },
  ),
);
