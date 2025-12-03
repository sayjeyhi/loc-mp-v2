// Contract data structure
export interface ContractData {
  id: number;
  date: string;
  status: "closed" | "processing" | "performing";
  requestedAmount: number;
  paybackAmount: number;
  paymentAmount: number;
  daysOpen: number;
  collectedAmount: number;
  discountedBalance: number;
  outstandingBalance: number;
  paymentCount: number;
  drawdownAmount: number;
  drawdownFee: number;
  savedAmount: number;
  outstandingPaybackAmount: string;
  outstandingPayoffAmount: string;
  number: number;
}
