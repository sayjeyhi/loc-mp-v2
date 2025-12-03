import { create } from 'zustand'
import {
  type TTransactionHistory,
  type TPaymentHistory,
} from '@/utils/types/paymentHistory'

interface TableQueries {
  total: number
  pageIndex: number
  pageSize: number
  query: string
  sort: {
    order: 'asc' | 'desc'
    key: string
  }
  startDate: string | null
  endDate: string | null
}

interface ActivityState {
  // Transaction History
  transactionHistory: TTransactionHistory[]
  transactionLoading: boolean
  transactionError: string | null
  transactionTableData: TableQueries

  // Payment History
  paymentHistory: TPaymentHistory[]
  paymentLoading: boolean
  paymentError: string | null
  paymentTableData: TableQueries

  // Actions
  setTransactionHistory: (data: TTransactionHistory[], total?: number) => void
  setTransactionLoading: (loading: boolean) => void
  setTransactionError: (error: string | null) => void
  setTransactionTableData: (data: Partial<TableQueries>) => void
  clearTransactionHistory: () => void

  setPaymentHistory: (data: TPaymentHistory[], total?: number) => void
  setPaymentLoading: (loading: boolean) => void
  setPaymentError: (error: string | null) => void
  setPaymentTableData: (data: Partial<TableQueries>) => void
  clearPaymentHistory: () => void
}

const initialTableData: TableQueries = {
  total: 0,
  pageIndex: 1,
  pageSize: 25,
  query: '',
  sort: {
    order: 'desc',
    key: 'dueAt',
  },
  startDate: null,
  endDate: null,
}

export const useActivityStore = create<ActivityState>((set) => ({
  // Transaction History
  transactionHistory: [],
  transactionLoading: false,
  transactionError: null,
  transactionTableData: { ...initialTableData },

  // Payment History
  paymentHistory: [],
  paymentLoading: false,
  paymentError: null,
  paymentTableData: { ...initialTableData },

  // Transaction Actions
  setTransactionHistory: (data, total) =>
    set((state) => ({
      transactionHistory: data,
      transactionTableData: {
        ...state.transactionTableData,
        total: total ?? data.length,
      },
      transactionLoading: false,
      transactionError: null,
    })),

  setTransactionLoading: (loading) =>
    set(() => ({
      transactionLoading: loading,
    })),

  setTransactionError: (error) =>
    set(() => ({
      transactionError: error,
      transactionLoading: false,
    })),

  setTransactionTableData: (data) =>
    set((state) => ({
      transactionTableData: {
        ...state.transactionTableData,
        ...data,
      },
    })),

  clearTransactionHistory: () =>
    set(() => ({
      transactionHistory: [],
      transactionLoading: false,
      transactionError: null,
      transactionTableData: { ...initialTableData },
    })),

  // Payment Actions
  setPaymentHistory: (data, total) =>
    set((state) => ({
      paymentHistory: data,
      paymentTableData: {
        ...state.paymentTableData,
        total: total ?? data.length,
      },
      paymentLoading: false,
      paymentError: null,
    })),

  setPaymentLoading: (loading) =>
    set(() => ({
      paymentLoading: loading,
    })),

  setPaymentError: (error) =>
    set(() => ({
      paymentError: error,
      paymentLoading: false,
    })),

  setPaymentTableData: (data) =>
    set((state) => ({
      paymentTableData: {
        ...state.paymentTableData,
        ...data,
      },
    })),

  clearPaymentHistory: () =>
    set(() => ({
      paymentHistory: [],
      paymentLoading: false,
      paymentError: null,
      paymentTableData: { ...initialTableData },
    })),
}))
