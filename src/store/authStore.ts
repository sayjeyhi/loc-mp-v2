import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserState {
  username: string;
  accountNumber: string;
  authority: string[];
  sessionId?: string;
  id?: string;
  token?: string | null;
  tokenForOtp?: string | null;
  tokenExpireTime?: number;
  isFromLogin?: boolean;
  setPassword?: boolean;
  channel?: "sms" | "email";
}

interface AuthState {
  user: UserState | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserState) => void;
  setAuthToken: (token: string | null) => void;
  setOtpToken: (token: string | null) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user: UserState) =>
        set(() => ({
          user,
          isAuthenticated: !!user?.token && !user?.setPassword,
        })),
      setAuthToken: (token: string | null) =>
        set((state) => ({
          user: state.user ? { ...state.user, token } : null,
          isAuthenticated: !!token && !state.user?.setPassword,
        })),
      setOtpToken: (token: string | null) =>
        set((state) => ({
          user: state.user ? { ...state.user, tokenForOtp: token } : null,
        })),
      clearAuth: () =>
        set(() => ({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })),
      logout: async () => {
        try {
          [
            "auth-store",
            "user_session",
            "auth_token",
            "user_data",
            "otp_verified",
            "login_credentials",
            "tokenForOtp",
            "token",
          ].map(item => localStorage.removeItem(item));
        } catch (error) {
          console.error("Error during logout:", error);
        } finally {
          set(() => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }));
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    },
  ),
);
