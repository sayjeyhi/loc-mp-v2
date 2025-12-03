// Utility types for common patterns

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type NonNullable<T> = T extends null | undefined ? never : T;

// Function types
export type AsyncFunction<
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
> = (...args: TArgs) => Promise<TReturn>;
export type SyncFunction<
  TArgs extends unknown[] = unknown[],
  TReturn = unknown,
> = (...args: TArgs) => TReturn;

// Event handler types
export type ChangeEventHandler<T = Element> = (
  event: React.ChangeEvent<T>,
) => void;
export type ClickEventHandler<T = Element> = (
  event: React.MouseEvent<T>,
) => void;
export type SubmitEventHandler<T = Element> = (
  event: React.FormEvent<T>,
) => void;

// State setter types
export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
export type StateUpdater<T> = (prevState: T) => T;

// API response types
export type ApiResponse<T = unknown> = {
  success: boolean;
  statusCode: number;
  dataReason: string;
  data: T;
};

// Table and pagination types
export type SortOrder = "asc" | "desc" | "";
export type SortConfig = {
  order: SortOrder;
  key: string | number;
};

export type PaginationConfig = {
  pageIndex: number;
  pageSize: number;
  total?: number;
};

// Form types
export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;
