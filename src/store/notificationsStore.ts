import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  notificationType: string;
  scheduledStart?: number;
  scheduledEnd?: number;
  sendNow: string;
  postedBy: string;
  timezone?: string;
  _ts: number;
};

interface NotificationsState {
  notifications: NotificationItem[] | null;
  isLoading: boolean;
  error: string | null;
  setNotifications: (notifications: NotificationItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      notifications: null,
      isLoading: false,
      error: null,
      setNotifications: (notifications) =>
        set(() => ({
          notifications,
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
      clearNotifications: () =>
        set(() => ({
          notifications: null,
          isLoading: false,
          error: null,
        })),
    }),
    {
      name: "notifications-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    },
  ),
);
