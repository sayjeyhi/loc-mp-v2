import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PrepaymentRequestData {
  prepaymentAmount: string;
  serviceCharge: string;
  overlimitAch: boolean;
  outstandingFees: string;
  arrears: string;
  totalAmount: string;
  balloonAmount: string;
  balloonDate: string;
  before: {
    fundedAmount: string;
    fundedOutstanding: string;
    paybackOutstanding: string;
    payoffOutstanding: string;
    dailyPayment: string;
    totalPrepayAmount: string;
    totalSavedAmount: string;
    totalPaidBackAmount: string;
    totalPaidBackPercent: string;
  };
  after: {
    fundedAmount: string;
    fundedOutstanding: string;
    paybackOutstanding: string;
    payoffOutstanding: string;
    dailyPayment: string;
    totalPrepayAmount: string;
    totalSavedAmount: string;
    totalPaidBackAmount: string;
    totalPaidBackPercent: string;
  };
  difference: {
    fundedAmount: string;
    fundedOutstanding: string;
    paybackOutstanding: string;
    payoffOutstanding: string;
    dailyPayment: string;
    totalPrepayAmount: string;
    totalSavedAmount: string;
    totalPaidBackAmount: string;
    totalPaidBackPercent: string;
  };
  result: string;
}

export interface PrepaymentCreateData {
  accountId: number;
  merchantName: string;
  totalAmount: string;
  overlimitAch: boolean;
  result: string;
}

interface PrepaymentState {
  prepaymentData: PrepaymentRequestData | null;
  requestedAmount: string;
  createData: PrepaymentCreateData | null;
  setPrepaymentData: (data: PrepaymentRequestData) => void;
  setRequestedAmount: (amount: string) => void;
  setCreateData: (data: PrepaymentCreateData) => void;
  clearPrepaymentData: () => void;
}

export const usePrepaymentStore = create<PrepaymentState>()(
  persist(
    (set) => ({
      prepaymentData: null,
      requestedAmount: "",
      createData: null,
      setPrepaymentData: (data: PrepaymentRequestData) =>
        set({ prepaymentData: data }),
      setRequestedAmount: (amount: string) => set({ requestedAmount: amount }),
      setCreateData: (data: PrepaymentCreateData) => set({ createData: data }),
      clearPrepaymentData: () =>
        set({ prepaymentData: null, requestedAmount: "", createData: null }),
    }),
    {
      name: "prepayment-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
