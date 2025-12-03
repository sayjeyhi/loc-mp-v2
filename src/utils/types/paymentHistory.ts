export type TPaymentHistory = {
  dueAt: string;
  //retDate: string;
  //retAmount: number;
  processingMode: string;
  guid: string;
  paymentType: string;
  amount: number;
  status: string;
};

export type TTransactionHistory = {
  dueAt: string;
  paymentType: string;
  amount: number;
  status: string;
  guid: string;
};
