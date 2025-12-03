import ApiService from "./ApiService";

/**
 * @deprecated Use {@link apiGetContractStatusOrg}
 */
export async function apiGetContractStatus<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>(
    {
      url: "/api/loc-merchant-portal/v1/payment/",
      method: "GET",
      params: data,
    },
    true,
  );
}

export async function apiGetContractStatusOrg<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>(
    {
      url: "/api/loc-merchant-portal/v1/draw/",
      method: "GET",
      data,
    },
    true,
  );
}
