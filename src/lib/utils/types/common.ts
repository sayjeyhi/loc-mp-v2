import { ReactNode, CSSProperties } from "react";
import type { SortConfig, PaginationConfig, ApiResponse } from "./utility";

export interface CommonProps {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export type TableQueries = PaginationConfig & {
  query?: string;
  sort?: SortConfig;
  whereClause?: string;
  startDate?: string | null | number;
  endDate?: string | null | number;
  isNext?: boolean;
};

export type TPostResponse<T = unknown> = ApiResponse<T>;
