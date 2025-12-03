import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CashDrawData {
  drawStatus: string;
  creditDecision: string;
  requestedAmount: string;
  establishmentFee: string;
  wireFeeAmount: string | null;
  fundedAmount: string;
  createdAt: string;
  paybackAmount: string;
  estimatedDailyPaymentAmount: string;
  collectionSchedule: string;
  estimatedDisbursementDate: string;
}

interface CashDrawState {
  cashDrawData: CashDrawData | null;
  setCashDrawData: (data: CashDrawData) => void;
  clearCashDrawData: () => void;
}

export const useCashDrawStore = create<CashDrawState>()(
  persist(
    (set) => ({
      cashDrawData: null,
      setCashDrawData: (data: CashDrawData) => set({ cashDrawData: data }),
      clearCashDrawData: () => set({ cashDrawData: null }),
    }),
    {
      name: "cash-draw-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
