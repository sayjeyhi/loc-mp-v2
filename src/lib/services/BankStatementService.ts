import ApiService from "./ApiService";

export async function apiGetBankStatement<T>() {
  return ApiService.fetchData<T>(
    {
      url: "/api/loc-merchant-portal/v1/bank-statement/",
      method: "GET",
    },
    true,
  );
}

export async function apiReconnectBankStatement<T>(id: string) {
  return ApiService.fetchData<T>(
    {
      url: `/api/loc-merchant-portal/v1/bank-statement/${id}/reconnect`,
      method: "GET",
    },
    true,
  );
}
