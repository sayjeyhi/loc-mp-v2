import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  domain: string | null;
  configName: string | null;
  language?: string | null;
  isReviewMode: boolean | null;
  merchantPortalUrl: string | null;
  testMode: boolean;
  setAppConfig: (
    appConfig: Omit<AuthState, "setAppConfig" | "clearAppConfig" | "setTestMode">,
  ) => void;
  setIsReviewMode: (isReviewMode: boolean) => void;
  setMerchantPortalUrl: (merchantPortalUrl: string | null) => void;
  setTestMode: (testMode: boolean) => void;
  clearAppConfig: () => void;
}

export const useAppConfigStore = create<AuthState>()(
  persist(
    (set) => ({
      domain: null,
      language: null,
      configName: null,
      isReviewMode: null,
      merchantPortalUrl: null,
      testMode: false,
      setAppConfig: (appConfig) =>
        set(() => ({
          ...appConfig,
        })),
      setIsReviewMode: (isReviewMode: boolean) =>
        set(() => ({
          isReviewMode,
        })),
      setMerchantPortalUrl: (merchantPortalUrl: string | null) =>
        set(() => ({
          merchantPortalUrl,
        })),
      setTestMode: (testMode: boolean) =>
        set(() => ({
          testMode,
        })),
      clearAppConfig: () =>
        set(() => ({
          domain: null,
          language: null,
          configName: null,
          isReviewMode: null,
          merchantPortalUrl: null,
          testMode: false,
        })),
    }),
    {
      name: "app-config-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
