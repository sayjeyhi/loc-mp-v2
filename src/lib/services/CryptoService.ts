import ApiService from "./ApiService";

export async function apiGetCryptoDashboardData<T>() {
  return ApiService.fetchData<T>({
    url: "/crypto/dashboard",
    method: "GET",
  });
}

export async function apiGetPortfolioData<T>() {
  return ApiService.fetchData<T>({
    url: "/crypto/portfolio",
    method: "GET",
  });
}

export async function apiGetWalletData<T>() {
  return ApiService.fetchData<T>({
    url: "/crypto/wallets",
    method: "GET",
  });
}

export async function apiGetTransctionHistoryData<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>({
    url: "/crypto/wallets/history",
    method: "post",
    data,
  });
}

export async function apiGetMarketData<T, U extends Record<string, unknown>>(
  data: U,
) {
  return ApiService.fetchData<T>({
    url: "/crypto/market",
    method: "post",
    data,
  });
}
