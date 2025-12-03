import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: Profile) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
}

export interface Profile {
  account: Account;
  merchant: Merchant;
}

export interface Account {
  number: string;
  status: string;
  state: string;
  maxFundingLimit: string;
  maxAutoApproval: string;
  defaultSurcharge: string;
  availableBalance: string;
  fundedOutstandingAmount: string;
  pendingBalance: string;
  collectionFrequencyType: string;
  collectionFrequencyTypeDescription: string;
  paymentCount: number;
  payoffOutstandingAmount: string;
  paybackOutstandingAmount: string;
  lastPaidPaymentDate: any;
  paidPaybacksCount: number;
  totalSavedAmount: number;
  potentialDiscount: number;
  isInTrailingRepayment: boolean;
  arrears: string;
  overpaymentBalance: any;
  outstandingBounceFees: any;
  balanceToFees: string;
  merchantFunderEstablishmentFeeType: string;
  merchantFunderEstablishmentFeeAmount: string;
  merchantFunderEstablishmentFeePercent: any;
}

export interface Merchant {
  businessName: string;
  businessStartDate: string;
  stateOfIncorporation: any;
  businessEmail: string;
  website: any;
  primaryContact: PrimaryContact;
  federalId: string;
  businessType: any;
}

export interface PrimaryContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: any;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: false,
      error: null,
      setProfile: (profile: Profile) =>
        set(() => ({
          profile,
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
      clearProfile: () =>
        set(() => ({
          profile: null,
          isLoading: false,
          error: null,
        })),
    }),
    {
      name: "profile-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    },
  ),
);
