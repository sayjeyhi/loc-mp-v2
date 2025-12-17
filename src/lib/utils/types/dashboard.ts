// interface
export interface IInitialState {
  list: TDashboardRecentActivityList[];
}

export interface IAccountSummaryInitialState {
  requestCashDrawAmount?: number | null;
  activeWithDrawType?: string;
  disclaimerOpen?: boolean;
}

export interface TThirdPartyDisbursement {
  reqThirdPart: boolean;
  payee: number | null;
  bsb: string;
  accountNumber: string;
  reason: string;
}
export interface IVoluntaryPrepaymentInitialState {
  voluntaryPrepaymentAmount: any;
  requestCashDrawAmount?: number | null;
  activeWithDrawType: string;
  stepTwoSubmitLoading: boolean;
  disclaimerOpen: boolean;
}

// types
export type TDashboardRecentActivityList = {
  date: string;
  month: string;
  title: string;
  description: string;
  amount: string;
  balance: string;
};

export type TInitialDashboardState = {
  isAnnouncement: boolean;
};
