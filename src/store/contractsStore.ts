import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ContractData } from "@/utils/types/contracts";

interface ContractsState {
  contracts: ContractData[];
  isLoading: boolean;
  error: string | null;
  setContracts: (
    contracts: ContractData[],
    total?: number,
    aggregations?: any,
  ) => void;
  aggregations: any;
  total: number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearContracts: () => void;
}

export const useContractsStore = create<ContractsState>()(
  persist(
    (set, get) => ({
      contracts: [],
      isLoading: false,
      error: null,
      aggregations: null,
      total: 0,
      setContracts: (contracts, total, aggregations) =>
        set(() => ({
          contracts,
          total,
          aggregations,
          isLoading: false,
          error: null,
        })),
      setLoading: (loading: boolean) =>
        set(() => ({
          isLoading: loading,
        })),
      setError: (error: string | null) =>
        set(() => ({
          error,
        })),
      clearContracts: () =>
        set(() => ({
          contracts: [],
          isLoading: false,
          error: null,
        })),
    }),
    {
      name: "contracts-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    },
  ),
);
